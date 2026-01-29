import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

// ============================================================================
// SSE Real-time Events Stream
// ============================================================================

async function verifyOrganizerAuth(request: NextRequest) {
  try {
    // Check if Firebase Admin is initialized
    if (!adminAuth || !adminDb) {
      console.error('Firebase Admin not initialized');
      return { error: 'Service temporarily unavailable', status: 503 };
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '') || sessionCookie;

    if (!token) {
      return { error: 'Unauthorized: No token provided', status: 401 };
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      return { error: 'User not found', status: 404 };
    }

    const userData = userDoc.data();

    if (!userData || (userData.role !== 'organizer' && userData.role !== 'admin')) {
      return { error: 'Forbidden: Organizer access required', status: 403 };
    }

    return { 
      userId: decodedToken.uid,
      organizerId: userData.organizerId || decodedToken.uid
    };
  } catch (error: any) {
    console.error('Auth verification error:', error);
    
    // Handle specific Firebase errors
    if (error.code === 'auth/id-token-expired') {
      return { error: 'Token expired', status: 401 };
    }
    if (error.code === 'auth/argument-error') {
      return { error: 'Invalid token', status: 401 };
    }
    
    return { error: 'Authentication failed', status: 401 };
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyOrganizerAuth(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    // Create SSE response
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial connection message
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'connected', 
            timestamp: new Date().toISOString(),
            organizerId: auth.organizerId,
            eventId 
          })}\n\n`));

          // Set up Firestore listeners for real-time updates
          const unsubscribers: (() => void)[] = [];

          // Listen for check-ins (only if eventId is provided)
          if (eventId && adminDb) {
            try {
              const checkInListener = adminDb
                .collection('accessLogs')
                .where('eventId', '==', eventId)
                .orderBy('timestamp', 'desc')
                .limit(1)
                .onSnapshot((snapshot) => {
                  snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                      const data = change.doc.data();
                      try {
                        controller.enqueue(encoder.encode(`event: ${data.action}\ndata: ${JSON.stringify({
                          type: data.action,
                          eventId,
                          timestamp: data.timestamp?.toDate?.()?.toISOString(),
                          data: {
                            participantId: data.participantId,
                            gate: data.gate,
                            result: data.result,
                          }
                        })}\n\n`));
                      } catch (err) {
                        console.error('Error encoding check-in event:', err);
                      }
                    }
                  });
                }, (error) => {
                  console.error('Check-in listener error:', error);
                });
              unsubscribers.push(checkInListener);
            } catch (error) {
              console.error('Error setting up event listeners:', error);
            }
          }

          // Listen for device status changes (if adminDb is available)
          if (adminDb) {
            try {
              const deviceListener = adminDb
                .collection('devices')
                .where('organizerId', '==', auth.organizerId)
                .onSnapshot((snapshot) => {
                  snapshot.docChanges().forEach((change) => {
                    if (change.type === 'modified') {
                      const data = change.doc.data();
                      try {
                        controller.enqueue(encoder.encode(`event: device_status\ndata: ${JSON.stringify({
                          type: 'device_status',
                          timestamp: new Date().toISOString(),
                          data: {
                            deviceId: change.doc.id,
                            status: data.status,
                            batteryLevel: data.batteryLevel,
                            lastPing: data.lastPing?.toDate?.()?.toISOString(),
                          }
                        })}\n\n`));
                      } catch (err) {
                        console.error('Error encoding device status:', err);
                      }
                    }
                  });
                }, (error) => {
                  console.error('Device listener error:', error);
                });
              unsubscribers.push(deviceListener);
            } catch (error) {
              console.error('Error setting up device listener:', error);
            }
          }

          // Send heartbeat every 30 seconds to keep connection alive
          const heartbeatInterval = setInterval(() => {
            try {
              controller.enqueue(encoder.encode(`: heartbeat\n\n`));
            } catch (err) {
              console.error('Heartbeat error:', err);
              clearInterval(heartbeatInterval);
            }
          }, 30000);

          // Clean up on close
          request.signal.addEventListener('abort', () => {
            clearInterval(heartbeatInterval);
            unsubscribers.forEach(unsub => {
              try {
                unsub();
              } catch (err) {
                console.error('Error unsubscribing:', err);
              }
            });
            try {
              controller.close();
            } catch (err) {
              console.error('Error closing controller:', err);
            }
          });
        } catch (error) {
          console.error('Error in stream start:', error);
          try {
            controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({
              type: 'error',
              message: 'Stream initialization failed'
            })}\n\n`));
            controller.close();
          } catch (err) {
            console.error('Error sending error event:', err);
          }
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('GET /api/organizer/realtime error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
