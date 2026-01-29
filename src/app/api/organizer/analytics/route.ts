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
// GET /api/organizer/analytics - Get organizer analytics
// ============================================================================

export async function GET(request: NextRequest) {
  const auth = await verifyOrganizerAuth(request);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const period = searchParams.get('period') || '30d'; // 7d, 30d, 90d, 1y

    // Calculate date range
    let dateStart: Date;
    let dateEnd = new Date();
    
    if (startDate && endDate) {
      dateStart = new Date(startDate);
      dateEnd = new Date(endDate);
    } else {
      const periodDays: Record<string, number> = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '1y': 365,
      };
      dateStart = new Date(Date.now() - (periodDays[period] || 30) * 24 * 60 * 60 * 1000);
    }

    // Get events for this organizer
    let eventsQuery = adminDb
      .collection('events')
      .where('organizerId', '==', auth.organizerId);

    if (eventId) {
      eventsQuery = eventsQuery.where('__name__', '==', eventId);
    }

    const eventsSnapshot = await eventsQuery.get();
    const eventIds = eventsSnapshot.docs.map(doc => doc.id);

    // Aggregate metrics
    let totalEvents = eventsSnapshot.size;
    let activeEvents = 0;
    let totalTicketsSold = 0;
    let totalRevenue = 0;
    let totalParticipants = 0;

    eventsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.status === 'published' || data.status === 'ongoing') {
        activeEvents++;
      }
      totalTicketsSold += data.ticketsSold || 0;
      totalRevenue += data.revenue || 0;
    });

    // Get participant count
    if (eventIds.length > 0) {
      const participantsCount = await adminDb
        .collection('tickets')
        .where('eventId', 'in', eventIds.slice(0, 10)) // Firestore limit
        .count()
        .get();
      totalParticipants = participantsCount.data().count;
    }

    // Get revenue data by period
    const revenueData: { period: string; revenue: number; tickets: number; refunds: number }[] = [];
    
    // Generate daily/weekly/monthly buckets based on date range
    const daysDiff = Math.ceil((dateEnd.getTime() - dateStart.getTime()) / (24 * 60 * 60 * 1000));
    let bucketSize = 'day';
    if (daysDiff > 90) bucketSize = 'month';
    else if (daysDiff > 30) bucketSize = 'week';

    // Fetch orders/transactions for revenue timeline
    if (eventIds.length > 0) {
      const ordersSnapshot = await adminDb
        .collection('orders')
        .where('eventId', 'in', eventIds.slice(0, 10))
        .where('createdAt', '>=', dateStart)
        .where('createdAt', '<=', dateEnd)
        .orderBy('createdAt', 'asc')
        .get();

      // Aggregate by bucket
      const buckets = new Map<string, { revenue: number; tickets: number; refunds: number }>();

      ordersSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const orderDate = data.createdAt?.toDate?.();
        if (!orderDate) return;

        let bucketKey: string;
        if (bucketSize === 'month') {
          bucketKey = orderDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        } else if (bucketSize === 'week') {
          const weekStart = new Date(orderDate);
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          bucketKey = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else {
          bucketKey = orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }

        if (!buckets.has(bucketKey)) {
          buckets.set(bucketKey, { revenue: 0, tickets: 0, refunds: 0 });
        }

        const bucket = buckets.get(bucketKey)!;
        if (data.status === 'completed') {
          bucket.revenue += data.amount || 0;
          bucket.tickets += data.ticketCount || 1;
        } else if (data.status === 'refunded') {
          bucket.refunds += data.amount || 0;
        }
      });

      buckets.forEach((value, key) => {
        revenueData.push({ period: key, ...value });
      });
    }

    // Calculate average rating (if reviews exist)
    let averageRating = 0;
    if (eventIds.length > 0) {
      const reviewsSnapshot = await adminDb
        .collection('reviews')
        .where('eventId', 'in', eventIds.slice(0, 10))
        .get();

      if (reviewsSnapshot.size > 0) {
        const totalRating = reviewsSnapshot.docs.reduce((sum, doc) => sum + (doc.data().rating || 0), 0);
        averageRating = Math.round((totalRating / reviewsSnapshot.size) * 10) / 10;
      }
    }

    return NextResponse.json({
      metrics: {
        totalEvents,
        activeEvents,
        totalTicketsSold,
        totalRevenue,
        totalParticipants,
        averageRating,
      },
      revenueData,
      dateRange: {
        start: dateStart.toISOString(),
        end: dateEnd.toISOString(),
        period,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
