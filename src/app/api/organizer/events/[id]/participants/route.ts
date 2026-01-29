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
// GET /api/organizer/events/[id]/participants - List participants
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
    const checkInStatus = searchParams.get('checkInStatus');
    const ticketType = searchParams.get('ticketType');
    const search = searchParams.get('search')?.toLowerCase();
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = adminDb
      .collection('tickets')
      .where('eventId', '==', id)
      .orderBy('purchaseDate', 'desc')
      .limit(limit)
      .offset(offset);

    if (checkInStatus) {
      query = query.where('checkInStatus', '==', checkInStatus);
    }

    if (ticketType) {
      query = query.where('ticketType', '==', ticketType);
    }

    const snapshot = await query.get();
    
    let participants = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        eventId: id,
        userId: data.userId,
        name: data.attendeeName || data.userName || 'Unknown',
        email: data.attendeeEmail || data.userEmail,
        phone: data.attendeePhone,
        ticketType: data.ticketType,
        ticketId: data.ticketId || doc.id,
        checkInStatus: data.checkInStatus || 'not_checked_in',
        checkInTime: data.checkInTime?.toDate?.()?.toISOString() || null,
        checkOutTime: data.checkOutTime?.toDate?.()?.toISOString() || null,
        gate: data.gate,
        purchaseDate: data.purchaseDate?.toDate?.()?.toISOString() || null,
      };
    });

    // Client-side search filter (Firestore doesn't support full-text search)
    if (search) {
      participants = participants.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.email?.toLowerCase().includes(search) ||
        p.ticketId.toLowerCase().includes(search)
      );
    }

    // Get stats
    const [totalCount, checkedInCount] = await Promise.all([
      adminDb.collection('tickets').where('eventId', '==', id).count().get(),
      adminDb.collection('tickets')
        .where('eventId', '==', id)
        .where('checkInStatus', '==', 'checked_in')
        .count()
        .get(),
    ]);

    return NextResponse.json({
      participants,
      total: totalCount.data().count,
      checkedIn: checkedInCount.data().count,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching participants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch participants' },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/organizer/events/[id]/participants/bulk-check-in
// ============================================================================

export async function POST(
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
    const body = await request.json();
    const { participantIds, gate } = body;

    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      return NextResponse.json(
        { error: 'participantIds array is required' },
        { status: 400 }
      );
    }

    const batch = adminDb.batch();
    const now = new Date();

    for (const participantId of participantIds) {
      const ticketRef = adminDb.collection('tickets').doc(participantId);
      batch.update(ticketRef, {
        checkInStatus: 'checked_in',
        checkInTime: now,
        gate: gate || 'Manual',
        updatedAt: now,
      });

      // Create access log
      const logRef = adminDb.collection('accessLogs').doc();
      batch.set(logRef, {
        eventId: id,
        participantId,
        timestamp: now,
        action: 'check_in',
        gate: gate || 'Manual',
        result: 'success',
        source: 'bulk_checkin',
        performedBy: auth.userId,
      });
    }

    await batch.commit();

    return NextResponse.json({
      success: true,
      checkedIn: participantIds.length,
    });
  } catch (error) {
    console.error('Error bulk check-in:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk check-in' },
      { status: 500 }
    );
  }
}
