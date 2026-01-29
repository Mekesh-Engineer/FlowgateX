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

// Helper to verify event ownership
async function verifyEventOwnership(eventId: string, organizerId: string) {
  const eventDoc = await adminDb.collection('events').doc(eventId).get();
  if (!eventDoc.exists) {
    return { error: 'Event not found', status: 404 };
  }
  
  const eventData = eventDoc.data() as Record<string, any>;
  if (eventData?.organizerId !== organizerId) {
    return { error: 'Forbidden: Not your event', status: 403 };
  }

  return { event: { id: eventDoc.id, ...eventData } as Record<string, any> & { id: string } };
}

// ============================================================================
// GET /api/organizer/events/[id] - Get single event
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

  // Get additional aggregated data
  const [participantsCount, devicesCount] = await Promise.all([
    adminDb.collection('tickets')
      .where('eventId', '==', id)
      .count()
      .get(),
    adminDb.collection('devices')
      .where('eventId', '==', id)
      .count()
      .get(),
  ]);

  return NextResponse.json({
    event: {
      ...ownership.event,
      startDate: ownership.event.startDate?.toDate?.()?.toISOString() || null,
      endDate: ownership.event.endDate?.toDate?.()?.toISOString() || null,
      createdAt: ownership.event.createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: ownership.event.updatedAt?.toDate?.()?.toISOString() || null,
    },
    stats: {
      participantsCount: participantsCount.data().count,
      devicesCount: devicesCount.data().count,
    }
  });
}

// ============================================================================
// PATCH /api/organizer/events/[id] - Update event
// ============================================================================

export async function PATCH(
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

    // Fields that can be updated
    const allowedFields = [
      'name', 'description', 'startDate', 'endDate', 'venue',
      'ticketTypes', 'status', 'totalCapacity', 'coverImage',
      'iotEnabled', 'gates', 'settings'
    ];

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === 'startDate' || field === 'endDate') {
          updateData[field] = new Date(body[field]);
        } else {
          updateData[field] = body[field];
        }
      }
    }

    await adminDb.collection('events').doc(id).update(updateData);

    // Fetch updated document
    const updatedDoc = await adminDb.collection('events').doc(id).get();
    const updatedData = updatedDoc.data();

    return NextResponse.json({
      event: {
        id: updatedDoc.id,
        ...updatedData,
        startDate: updatedData?.startDate?.toDate?.()?.toISOString() || null,
        endDate: updatedData?.endDate?.toDate?.()?.toISOString() || null,
        createdAt: updatedData?.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: updatedData?.updatedAt?.toDate?.()?.toISOString() || null,
      }
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE /api/organizer/events/[id] - Delete event
// ============================================================================

export async function DELETE(
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
    // Check if event can be deleted (no sold tickets for published events)
    const event = ownership.event;
    if (event.status === 'published' && event.ticketsSold > 0) {
      return NextResponse.json(
        { error: 'Cannot delete published event with sold tickets' },
        { status: 400 }
      );
    }

    // Soft delete (mark as cancelled) or hard delete based on status
    if (event.status === 'draft') {
      await adminDb.collection('events').doc(id).delete();
    } else {
      await adminDb.collection('events').doc(id).update({
        status: 'cancelled',
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
