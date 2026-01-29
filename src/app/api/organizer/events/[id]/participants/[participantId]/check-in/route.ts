import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
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
// POST - Check-in a participant
// ============================================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; participantId: string }> }
) {
  const { id, participantId } = await params;
  const auth = await verifyOrganizerAuth(request);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const ownership = await verifyEventOwnership(id, auth.organizerId);
  if ('error' in ownership) {
    return NextResponse.json({ error: ownership.error }, { status: ownership.status });
  }

  try {
    const body = await request.json();
    const { gate, deviceId } = body;

    // Get participant ticket
    const ticketDoc = await adminDb.collection('tickets').doc(participantId).get();
    
    if (!ticketDoc.exists) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

    const ticketData = ticketDoc.data();
    
    if (ticketData?.eventId !== id) {
      return NextResponse.json({ error: 'Participant not in this event' }, { status: 400 });
    }

    // Check for duplicate check-in
    if (ticketData?.checkInStatus === 'checked_in') {
      // Log duplicate attempt
      await adminDb.collection('accessLogs').add({
        eventId: id,
        participantId,
        timestamp: new Date(),
        action: 'check_in',
        gate: gate || 'Unknown',
        result: 'duplicate',
        reason: `Already checked in at ${ticketData.checkInTime?.toDate?.()?.toISOString()}`,
        deviceId,
        performedBy: auth.userId,
      });

      return NextResponse.json({
        success: false,
        result: 'duplicate',
        message: 'Already checked in',
        checkInTime: ticketData.checkInTime?.toDate?.()?.toISOString(),
      });
    }

    const now = new Date();

    // Update ticket
    await adminDb.collection('tickets').doc(participantId).update({
      checkInStatus: 'checked_in',
      checkInTime: now,
      gate: gate || 'Unknown',
      updatedAt: now,
    });

    // Create access log
    await adminDb.collection('accessLogs').add({
      eventId: id,
      participantId,
      timestamp: now,
      action: 'check_in',
      gate: gate || 'Unknown',
      result: 'success',
      deviceId,
      performedBy: auth.userId,
    });

    // Update event live metrics (if using real-time counters)
    await adminDb.collection('events').doc(id).update({
      'liveMetrics.currentOccupancy': FieldValue.increment(1),
      'liveMetrics.totalCheckIns': FieldValue.increment(1),
    });

    return NextResponse.json({
      success: true,
      result: 'success',
      checkInTime: now.toISOString(),
      gate,
      participant: {
        id: participantId,
        name: ticketData.attendeeName || ticketData.userName,
        ticketType: ticketData.ticketType,
      },
    });
  } catch (error) {
    console.error('Error checking in participant:', error);
    return NextResponse.json(
      { error: 'Failed to check in participant' },
      { status: 500 }
    );
  }
}
