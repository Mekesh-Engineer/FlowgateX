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
  
  const eventData = eventDoc.data() as Record<string, any>;
  if (eventData?.organizerId !== organizerId) {
    return { error: 'Forbidden: Not your event', status: 403 };
  }

  return { event: { id: eventDoc.id, ...eventData } as Record<string, any> & { id: string } };
}

// ============================================================================
// GET /api/organizer/events/[id]/crowd - Get crowd monitoring data
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
    const event = ownership.event;

    // Get zones data
    const zonesSnapshot = await adminDb
      .collection('events')
      .doc(id)
      .collection('zones')
      .get();

    const zones = zonesSnapshot.docs.map(doc => {
      const data = doc.data();
      const occupancyRate = data.capacity > 0 
        ? (data.currentOccupancy / data.capacity) * 100 
        : 0;

      let status: 'normal' | 'warning' | 'critical' = 'normal';
      if (occupancyRate >= 90) status = 'critical';
      else if (occupancyRate >= 75) status = 'warning';

      return {
        id: doc.id,
        name: data.name,
        currentOccupancy: data.currentOccupancy || 0,
        capacity: data.capacity || 0,
        status,
        lastUpdated: data.lastUpdated?.toDate?.()?.toISOString() || null,
      };
    });

    // Get live metrics
    const liveMetrics = event.liveMetrics || {};
    
    // Calculate total occupancy
    const currentOccupancy = zones.reduce((sum, z) => sum + z.currentOccupancy, 0) || liveMetrics.currentOccupancy || 0;
    const maxCapacity = zones.reduce((sum, z) => sum + z.capacity, 0) || event.totalCapacity || 0;

    // Get recent alerts
    const alertsSnapshot = await adminDb
      .collection('alerts')
      .where('eventId', '==', id)
      .where('acknowledged', '==', false)
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get();

    const alerts = alertsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        type: data.type,
        message: data.message,
        zoneId: data.zoneId,
        timestamp: data.timestamp?.toDate?.()?.toISOString() || null,
        acknowledged: data.acknowledged,
      };
    });

    // Get entry/exit flow data (last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const flowSnapshot = await adminDb
      .collection('accessLogs')
      .where('eventId', '==', id)
      .where('timestamp', '>=', oneHourAgo)
      .orderBy('timestamp', 'asc')
      .get();

    // Aggregate flow data into 15-minute intervals
    const flowData: { time: string; entrances: number; exits: number }[] = [];
    const intervals = new Map<string, { entrances: number; exits: number }>();

    flowSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const timestamp = data.timestamp?.toDate?.();
      if (!timestamp) return;

      // Round to 15-minute interval
      const intervalTime = new Date(timestamp);
      intervalTime.setMinutes(Math.floor(intervalTime.getMinutes() / 15) * 15, 0, 0);
      const key = intervalTime.toISOString();

      if (!intervals.has(key)) {
        intervals.set(key, { entrances: 0, exits: 0 });
      }

      const interval = intervals.get(key)!;
      if (data.action === 'check_in') {
        interval.entrances++;
      } else if (data.action === 'check_out') {
        interval.exits++;
      }
    });

    intervals.forEach((value, key) => {
      flowData.push({
        time: new Date(key).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        ...value,
      });
    });

    return NextResponse.json({
      currentOccupancy,
      maxCapacity,
      occupancyRate: maxCapacity > 0 ? Math.round((currentOccupancy / maxCapacity) * 100) : 0,
      zones,
      alerts,
      flowData,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching crowd data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crowd data' },
      { status: 500 }
    );
  }
}
