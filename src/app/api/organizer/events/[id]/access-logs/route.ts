import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

// ============================================================================
// Authentication Helper
// ============================================================================

async function verifyOrganizerAuth(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '') || sessionCookie;

    if (!token) {
      return { error: 'Unauthorized', status: 401 };
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.data();

    if (!userData || userData.role !== 'organizer') {
      return { error: 'Forbidden: Organizer access required', status: 403 };
    }

    return { 
      userId: decodedToken.uid,
      organizerId: userData.organizerId || decodedToken.uid
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { error: 'Authentication failed', status: 401 };
  }
}

async function verifyEventOwnership(eventId: string, organizerId: string) {
  const eventDoc = await adminDb.collection('events').doc(eventId).get();
  if (!eventDoc.exists) {
    return { error: 'Event not found', status: 404 };
  }
  
  const eventData = eventDoc.data();
  if (eventData?.organizerId !== organizerId) {
    return { error: 'Forbidden: Not your event', status: 403 };
  }

  return { event: { id: eventDoc.id, ...eventData } };
}

// ============================================================================
// GET /api/organizer/events/[id]/access-logs - Get access logs
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await verifyOrganizerAuth(request);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const ownership = await verifyEventOwnership(id, auth.organizerId);
  if ('error' in ownership) {
    return NextResponse.json({ error: ownership.error }, { status: ownership.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const gate = searchParams.get('gate');
    const result = searchParams.get('result'); // success, failed, duplicate
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');
    const limit = parseInt(searchParams.get('limit') || '100');

    // Build query
    let query = adminDb
      .collection('accessLogs')
      .where('eventId', '==', id)
      .orderBy('timestamp', 'desc')
      .limit(limit);

    if (gate && gate !== 'all') {
      query = query.where('gate', '==', gate);
    }

    if (result && result !== 'all') {
      query = query.where('result', '==', result);
    }

    if (startTime) {
      query = query.where('timestamp', '>=', new Date(startTime));
    }

    if (endTime) {
      query = query.where('timestamp', '<=', new Date(endTime));
    }

    const snapshot = await query.get();
    
    const logs = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        eventId: id,
        timestamp: data.timestamp?.toDate?.()?.toISOString() || null,
        participantId: data.participantId,
        participantName: data.participantName || 'Unknown',
        ticketId: data.ticketId,
        gate: data.gate,
        result: data.result,
        reason: data.reason,
        deviceId: data.deviceId,
      };
    });

    // Get stats
    const [totalScans, successScans, failedScans] = await Promise.all([
      adminDb.collection('accessLogs').where('eventId', '==', id).count().get(),
      adminDb.collection('accessLogs')
        .where('eventId', '==', id)
        .where('result', '==', 'success')
        .count().get(),
      adminDb.collection('accessLogs')
        .where('eventId', '==', id)
        .where('result', '==', 'failed')
        .count().get(),
    ]);

    return NextResponse.json({
      logs,
      stats: {
        totalScans: totalScans.data().count,
        successScans: successScans.data().count,
        failedScans: failedScans.data().count,
        successRate: totalScans.data().count > 0 
          ? Math.round((successScans.data().count / totalScans.data().count) * 100) 
          : 0,
      },
      limit,
    });
  } catch (error) {
    console.error('Error fetching access logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch access logs' },
      { status: 500 }
    );
  }
}
