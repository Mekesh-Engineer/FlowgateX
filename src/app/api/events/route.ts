import { NextRequest, NextResponse } from 'next/server';
import { adminRtdb } from '@/lib/firebase-admin';

// Disable caching for this API route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    const debug = searchParams.get('debug');

    console.log('🔍 API: Fetching events from Firebase RTDB...');
    console.log('🔍 Database URL:', process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL);
    
    const eventsRef = adminRtdb.ref('events');
    console.log('🔍 Events ref created');
    
    const snapshot = await eventsRef.once('value');
    const exists = snapshot.exists();
    const numChildren = snapshot.numChildren();
    console.log('🔍 Snapshot exists:', exists);
    console.log('🔍 Snapshot numChildren:', numChildren);

    // Debug mode - return all info about what's in the database
    if (debug === 'true') {
      if (!exists) {
        return NextResponse.json({ 
          debug: true,
          message: 'No events collection exists in database',
          exists: false,
          events: [],
          total: 0,
          timestamp: new Date().toISOString(),
        }, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          }
        });
      }
      
      const allEvents = Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
        id,
        status: data.status,
        title: data.basicInfo?.title || data.title || 'No title',
      }));
      
      const publishedCount = allEvents.filter(e => e.status === 'published').length;
      
      return NextResponse.json({
        debug: true,
        message: 'Found events in database',
        exists: true,
        totalEventsInDb: allEvents.length,
        publishedCount: publishedCount,
        eventsSummary: allEvents,
        statuses: allEvents.map(e => e.status),
        timestamp: new Date().toISOString(),
      }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        }
      });
    }

    if (!exists) {
      return NextResponse.json({ events: [], total: 0 });
    }

    let events = Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
      id,
      eventId: data.eventId || id,
      ...data,
    }));
    
    console.log('🔍 Total events before filter:', events.length);
    console.log('🔍 Event statuses:', events.map(e => e.status));

    // Filter by status if provided, default to published for public API
    if (status && status !== 'all') {
      events = events.filter((event: any) => event.status === status);
    } else if (!status) {
      events = events.filter((event: any) => event.status === 'published');
    }
    
    console.log('🔍 Events after status filter:', events.length);

    // Filter by category if provided
    if (category && category !== 'all') {
      events = events.filter((event: any) => 
        event.basicInfo?.category === category || event.category === category
      );
    }

    // Apply limit if provided
    if (limit) {
      events = events.slice(0, parseInt(limit, 10));
    }

    // Sort by date (upcoming first)
    events.sort((a: any, b: any) => {
      const dateA = new Date(a.basicInfo?.startDate || a.date || 0);
      const dateB = new Date(b.basicInfo?.startDate || b.date || 0);
      return dateA.getTime() - dateB.getTime();
    });

    return NextResponse.json({ 
      events, 
      total: events.length,
      success: true 
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Create event logic
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
