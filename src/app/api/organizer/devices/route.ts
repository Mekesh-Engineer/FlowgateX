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

// ============================================================================
// GET /api/organizer/devices - List organizer's devices
// ============================================================================

export async function GET(request: NextRequest) {
  const auth = await verifyOrganizerAuth(request);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    // Build query
    let query = adminDb
      .collection('devices')
      .where('organizerId', '==', auth.organizerId)
      .orderBy('name', 'asc');

    if (eventId) {
      query = query.where('eventId', '==', eventId);
    }

    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }

    if (type && type !== 'all') {
      query = query.where('type', '==', type);
    }

    const snapshot = await query.get();
    
    const devices = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        type: data.type,
        status: data.status,
        batteryLevel: data.batteryLevel,
        lastPing: data.lastPing?.toDate?.()?.toISOString() || null,
        eventId: data.eventId,
        location: data.location,
        firmware: data.firmware,
        scansToday: data.scansToday || 0,
      };
    });

    // Get device stats
    const online = devices.filter(d => d.status === 'online').length;
    const offline = devices.filter(d => d.status === 'offline').length;
    const warning = devices.filter(d => d.status === 'warning').length;

    return NextResponse.json({
      devices,
      stats: {
        total: devices.length,
        online,
        offline,
        warning,
      },
    });
  } catch (error) {
    console.error('Error fetching devices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch devices' },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/organizer/devices - Register new device
// ============================================================================

export async function POST(request: NextRequest) {
  const auth = await verifyOrganizerAuth(request);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();

    const requiredFields = ['name', 'type'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const deviceData = {
      organizerId: auth.organizerId,
      name: body.name,
      type: body.type,
      status: 'offline',
      batteryLevel: null,
      lastPing: null,
      eventId: body.eventId || null,
      location: body.location || null,
      firmware: body.firmware || null,
      scansToday: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await adminDb.collection('devices').add(deviceData);

    return NextResponse.json({
      device: {
        id: docRef.id,
        ...deviceData,
        createdAt: deviceData.createdAt.toISOString(),
        updatedAt: deviceData.updatedAt.toISOString(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error registering device:', error);
    return NextResponse.json(
      { error: 'Failed to register device' },
      { status: 500 }
    );
  }
}
