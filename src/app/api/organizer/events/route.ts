import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

// ============================================================================
// Authentication Helper
// ============================================================================

async function verifyOrganizerAuth(request: NextRequest) {
  try {
    // Get session token from cookie or Authorization header
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '') || sessionCookie;

    if (!token) {
      return { error: 'Unauthorized', status: 401 };
    }

    // Verify the token
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // Get user role from Firestore
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.data();

    if (!userData || userData.role !== 'organizer') {
      return { error: 'Forbidden: Organizer access required', status: 403 };
    }

    return { 
      userId: decodedToken.uid, 
      email: decodedToken.email,
      role: userData.role,
      organizerId: userData.organizerId || decodedToken.uid
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { error: 'Authentication failed', status: 401 };
  }
}

// ============================================================================
// GET /api/organizer/events - List organizer's events
// ============================================================================

export async function GET(request: NextRequest) {
  const auth = await verifyOrganizerAuth(request);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = adminDb
      .collection('events')
      .where('organizerId', '==', auth.organizerId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .offset(offset);

    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.get();
    
    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
      startDate: doc.data().startDate?.toDate?.()?.toISOString() || null,
      endDate: doc.data().endDate?.toDate?.()?.toISOString() || null,
    }));

    // Get total count
    const countSnapshot = await adminDb
      .collection('events')
      .where('organizerId', '==', auth.organizerId)
      .count()
      .get();

    return NextResponse.json({
      events,
      total: countSnapshot.data().count,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/organizer/events - Create new event
// ============================================================================

export async function POST(request: NextRequest) {
  const auth = await verifyOrganizerAuth(request);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'startDate', 'endDate'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate slug from name
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + 
      '-' + Date.now().toString(36);

    // Create event document
    const eventData = {
      organizerId: auth.organizerId,
      name: body.name,
      slug,
      description: body.description || '',
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      venue: body.venue || {},
      ticketTypes: body.ticketTypes || [],
      status: 'draft',
      ticketsSold: 0,
      totalCapacity: body.totalCapacity || 0,
      revenue: 0,
      coverImage: body.coverImage || null,
      iotEnabled: body.iotEnabled || false,
      gates: body.gates || [],
      settings: body.settings || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await adminDb.collection('events').add(eventData);

    return NextResponse.json({
      event: {
        id: docRef.id,
        ...eventData,
        startDate: eventData.startDate.toISOString(),
        endDate: eventData.endDate.toISOString(),
        createdAt: eventData.createdAt.toISOString(),
        updatedAt: eventData.updatedAt.toISOString(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
