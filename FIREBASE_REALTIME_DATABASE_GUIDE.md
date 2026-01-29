# Firebase Realtime Database - Event Management Guide

## 📋 Table of Contents
1. [Current Setup Overview](#current-setup-overview)
2. [Database Structure](#database-structure)
3. [Complete Event Service Implementation](#complete-event-service-implementation)
4. [API Routes](#api-routes)
5. [React Components Integration](#react-components-integration)
6. [Security Rules](#security-rules)
7. [Testing & Debugging](#testing--debugging)

---

## 1. Current Setup Overview

### ✅ Already Configured
Your project already has:
- Firebase Realtime Database initialized in `src/lib/firebase.ts`
- `rtdb` instance exported and ready to use
- Basic event creation function in `src/services/eventService.ts`
- Environment variables configured

### Firebase Configuration (`src/lib/firebase.ts`)
```typescript
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL, // ✅ Already set
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const rtdb = getDatabase(app); // ✅ Realtime Database instance
```

---

## 2. Database Structure

### Recommended JSON Schema
```json
{
  "events": {
    "{eventId}": {
      "eventId": "auto-generated-key",
      "organizerId": "user-id",
      "organizerEmail": "organizer@example.com",
      "status": "published | draft | cancelled | completed",
      "createdAt": 1706040000000,
      "updatedAt": 1706040000000,
      
      "basicInfo": {
        "title": "Event Title",
        "description": "Event description",
        "category": "music | sports | conference",
        "videoUrl": "https://youtube.com/...",
        "bannerImage": "https://storage.googleapis.com/..."
      },
      
      "schedule": {
        "startDate": "2026-02-15",
        "startTime": "18:00",
        "endDate": "2026-02-15",
        "endTime": "23:00",
        "timezone": "America/New_York",
        "recurring": false,
        "frequency": null
      },
      
      "venue": {
        "name": "Madison Square Garden",
        "address": "4 Pennsylvania Plaza",
        "city": "New York",
        "capacity": 20000,
        "coordinates": {
          "lat": 40.7505,
          "lng": -73.9934
        },
        "zones": [
          {
            "name": "VIP",
            "capacity": 500
          }
        ]
      },
      
      "tickets": [
        {
          "id": "ticket-1",
          "name": "General Admission",
          "price": 50.00,
          "quantity": 1000,
          "sold": 245,
          "earlyBird": false
        }
      ],
      
      "promoCodes": [
        {
          "code": "EARLY2026",
          "discount": "20%",
          "limit": 100,
          "used": 45
        }
      ],
      
      "iotGates": [
        {
          "id": "gate-1",
          "name": "Main Entrance",
          "type": "entry",
          "assigned": true,
          "accessRule": "all-tickets",
          "sensorConfig": true
        }
      ],
      
      "settings": {
        "amenities": {
          "wifi": true,
          "parking": true,
          "wheelchair": true
        },
        "services": {
          "merch": true,
          "food": true,
          "vipLounge": false
        },
        "ageRestriction": "18+",
        "refundPolicy": "Full refund available up to 7 days before event"
      },
      
      "analytics": {
        "views": 1234,
        "bookmarks": 56,
        "checkIns": 245,
        "revenue": 12250.00
      }
    }
  },
  
  "users": {
    "{userId}": {
      "events": {
        "{eventId}": true
      },
      "bookmarkedEvents": {
        "{eventId}": true
      },
      "tickets": {
        "{ticketId}": {
          "eventId": "event-123",
          "ticketType": "VIP",
          "purchaseDate": 1706040000000
        }
      }
    }
  },
  
  "eventMetrics": {
    "{eventId}": {
      "liveAttendance": 245,
      "currentOccupancy": 78,
      "alerts": 2,
      "deviceStatus": {
        "gate-1": "online",
        "gate-2": "offline"
      },
      "lastUpdated": 1706040000000
    }
  }
}
```

---

## 3. Complete Event Service Implementation

### Enhanced `src/services/eventService.ts`

```typescript
import { rtdb } from '@/lib/firebase';
import { 
  ref, 
  push, 
  set, 
  get,
  update,
  remove,
  query,
  orderByChild,
  equalTo,
  limitToFirst,
  onValue,
  off,
  serverTimestamp 
} from 'firebase/database';

// ===========================
// TYPE DEFINITIONS
// ===========================

export interface EventData {
  eventId?: string;
  organizerId: string;
  organizerEmail?: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  createdAt?: any;
  updatedAt?: any;
  basicInfo: {
    title: string;
    description: string;
    category: string;
    videoUrl?: string | null;
    bannerImage?: string | null;
  };
  schedule: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    timezone: string;
    recurring: boolean;
    frequency?: string | null;
  };
  venue: {
    name: string;
    address: string;
    city: string;
    capacity: number;
    coordinates?: { lat: number; lng: number };
    zones?: Array<{ name: string; capacity: number }>;
  };
  tickets: Array<{
    id?: string;
    name: string;
    price: number;
    quantity: number;
    sold?: number;
    earlyBird?: boolean;
  }>;
  promoCodes?: Array<{
    code: string;
    discount: string;
    limit: number;
    used?: number;
  }>;
  iotGates?: Array<{
    id: string;
    name: string;
    type: string;
    assigned: boolean;
    accessRule: string;
    sensorConfig: boolean;
  }>;
  settings?: {
    amenities?: {
      wifi?: boolean;
      parking?: boolean;
      wheelchair?: boolean;
    };
    services?: {
      merch?: boolean;
      food?: boolean;
      vipLounge?: boolean;
    };
    ageRestriction?: string;
    refundPolicy?: string;
  };
  analytics?: {
    views?: number;
    bookmarks?: number;
    checkIns?: number;
    revenue?: number;
  };
}

// ===========================
// CREATE EVENT
// ===========================

/**
 * Create a new event in Firebase Realtime Database
 */
export const createEvent = async (
  eventData: Omit<EventData, 'eventId' | 'createdAt' | 'updatedAt'>,
  userId: string
): Promise<string> => {
  try {
    const eventsRef = ref(rtdb, 'events');
    const newEventRef = push(eventsRef);
    
    const payload: EventData = {
      ...eventData,
      eventId: newEventRef.key || '',
      organizerId: userId,
      status: eventData.status || 'draft',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await set(newEventRef, payload);
    
    // Also add to user's events list
    const userEventRef = ref(rtdb, `users/${userId}/events/${newEventRef.key}`);
    await set(userEventRef, true);
    
    console.log('✅ Event created:', newEventRef.key);
    return newEventRef.key!;
  } catch (error) {
    console.error('❌ Error creating event:', error);
    throw error;
  }
};

// ===========================
// READ EVENTS
// ===========================

/**
 * Get a single event by ID
 */
export const getEventById = async (eventId: string): Promise<EventData | null> => {
  try {
    const eventRef = ref(rtdb, `events/${eventId}`);
    const snapshot = await get(eventRef);
    
    if (snapshot.exists()) {
      return snapshot.val() as EventData;
    }
    return null;
  } catch (error) {
    console.error('❌ Error fetching event:', error);
    throw error;
  }
};

/**
 * Get all events (with optional limit)
 */
export const getAllEvents = async (limit?: number): Promise<EventData[]> => {
  try {
    const eventsRef = ref(rtdb, 'events');
    const eventsQuery = limit 
      ? query(eventsRef, limitToFirst(limit))
      : eventsRef;
    
    const snapshot = await get(eventsQuery);
    
    if (snapshot.exists()) {
      const eventsObj = snapshot.val();
      return Object.values(eventsObj) as EventData[];
    }
    return [];
  } catch (error) {
    console.error('❌ Error fetching events:', error);
    throw error;
  }
};

/**
 * Get events by organizer ID
 */
export const getEventsByOrganizer = async (organizerId: string): Promise<EventData[]> => {
  try {
    const eventsRef = ref(rtdb, 'events');
    const eventsQuery = query(
      eventsRef,
      orderByChild('organizerId'),
      equalTo(organizerId)
    );
    
    const snapshot = await get(eventsQuery);
    
    if (snapshot.exists()) {
      const eventsObj = snapshot.val();
      return Object.values(eventsObj) as EventData[];
    }
    return [];
  } catch (error) {
    console.error('❌ Error fetching organizer events:', error);
    throw error;
  }
};

/**
 * Get events by status
 */
export const getEventsByStatus = async (
  status: 'draft' | 'published' | 'cancelled' | 'completed'
): Promise<EventData[]> => {
  try {
    const eventsRef = ref(rtdb, 'events');
    const eventsQuery = query(
      eventsRef,
      orderByChild('status'),
      equalTo(status)
    );
    
    const snapshot = await get(eventsQuery);
    
    if (snapshot.exists()) {
      const eventsObj = snapshot.val();
      return Object.values(eventsObj) as EventData[];
    }
    return [];
  } catch (error) {
    console.error('❌ Error fetching events by status:', error);
    throw error;
  }
};

/**
 * Get events by category
 */
export const getEventsByCategory = async (category: string): Promise<EventData[]> => {
  try {
    const eventsRef = ref(rtdb, 'events');
    const eventsQuery = query(
      eventsRef,
      orderByChild('basicInfo/category'),
      equalTo(category)
    );
    
    const snapshot = await get(eventsQuery);
    
    if (snapshot.exists()) {
      const eventsObj = snapshot.val();
      return Object.values(eventsObj) as EventData[];
    }
    return [];
  } catch (error) {
    console.error('❌ Error fetching events by category:', error);
    throw error;
  }
};

// ===========================
// UPDATE EVENT
// ===========================

/**
 * Update an existing event
 */
export const updateEvent = async (
  eventId: string,
  updates: Partial<EventData>
): Promise<void> => {
  try {
    const eventRef = ref(rtdb, `events/${eventId}`);
    
    // Add updatedAt timestamp
    const payload = {
      ...updates,
      updatedAt: serverTimestamp(),
    };
    
    await update(eventRef, payload);
    console.log('✅ Event updated:', eventId);
  } catch (error) {
    console.error('❌ Error updating event:', error);
    throw error;
  }
};

/**
 * Update event status
 */
export const updateEventStatus = async (
  eventId: string,
  status: 'draft' | 'published' | 'cancelled' | 'completed'
): Promise<void> => {
  try {
    const eventRef = ref(rtdb, `events/${eventId}`);
    await update(eventRef, {
      status,
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Event status updated:', eventId, status);
  } catch (error) {
    console.error('❌ Error updating event status:', error);
    throw error;
  }
};

/**
 * Increment event views
 */
export const incrementEventViews = async (eventId: string): Promise<void> => {
  try {
    const eventRef = ref(rtdb, `events/${eventId}/analytics/views`);
    const snapshot = await get(eventRef);
    const currentViews = snapshot.exists() ? snapshot.val() : 0;
    
    await set(eventRef, currentViews + 1);
  } catch (error) {
    console.error('❌ Error incrementing views:', error);
    throw error;
  }
};

// ===========================
// DELETE EVENT
// ===========================

/**
 * Delete an event
 */
export const deleteEvent = async (eventId: string, userId: string): Promise<void> => {
  try {
    // Delete from events collection
    const eventRef = ref(rtdb, `events/${eventId}`);
    await remove(eventRef);
    
    // Delete from user's events list
    const userEventRef = ref(rtdb, `users/${userId}/events/${eventId}`);
    await remove(userEventRef);
    
    console.log('✅ Event deleted:', eventId);
  } catch (error) {
    console.error('❌ Error deleting event:', error);
    throw error;
  }
};

// ===========================
// REAL-TIME LISTENERS
// ===========================

/**
 * Listen to event changes in real-time
 */
export const subscribeToEvent = (
  eventId: string,
  callback: (event: EventData | null) => void
): (() => void) => {
  const eventRef = ref(rtdb, `events/${eventId}`);
  
  const unsubscribe = onValue(eventRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() as EventData);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('❌ Error in event listener:', error);
  });
  
  // Return cleanup function
  return () => off(eventRef, 'value', unsubscribe);
};

/**
 * Listen to all events for an organizer
 */
export const subscribeToOrganizerEvents = (
  organizerId: string,
  callback: (events: EventData[]) => void
): (() => void) => {
  const eventsRef = ref(rtdb, 'events');
  const eventsQuery = query(
    eventsRef,
    orderByChild('organizerId'),
    equalTo(organizerId)
  );
  
  const unsubscribe = onValue(eventsQuery, (snapshot) => {
    if (snapshot.exists()) {
      const eventsObj = snapshot.val();
      callback(Object.values(eventsObj) as EventData[]);
    } else {
      callback([]);
    }
  }, (error) => {
    console.error('❌ Error in events listener:', error);
  });
  
  return () => off(eventsRef, 'value', unsubscribe);
};

// ===========================
// BOOKMARKS
// ===========================

/**
 * Bookmark an event
 */
export const bookmarkEvent = async (userId: string, eventId: string): Promise<void> => {
  try {
    const bookmarkRef = ref(rtdb, `users/${userId}/bookmarkedEvents/${eventId}`);
    await set(bookmarkRef, true);
    
    // Increment bookmark count
    const eventRef = ref(rtdb, `events/${eventId}/analytics/bookmarks`);
    const snapshot = await get(eventRef);
    const currentBookmarks = snapshot.exists() ? snapshot.val() : 0;
    await set(eventRef, currentBookmarks + 1);
    
    console.log('✅ Event bookmarked');
  } catch (error) {
    console.error('❌ Error bookmarking event:', error);
    throw error;
  }
};

/**
 * Remove bookmark
 */
export const unbookmarkEvent = async (userId: string, eventId: string): Promise<void> => {
  try {
    const bookmarkRef = ref(rtdb, `users/${userId}/bookmarkedEvents/${eventId}`);
    await remove(bookmarkRef);
    
    // Decrement bookmark count
    const eventRef = ref(rtdb, `events/${eventId}/analytics/bookmarks`);
    const snapshot = await get(eventRef);
    const currentBookmarks = snapshot.exists() ? snapshot.val() : 0;
    if (currentBookmarks > 0) {
      await set(eventRef, currentBookmarks - 1);
    }
    
    console.log('✅ Bookmark removed');
  } catch (error) {
    console.error('❌ Error removing bookmark:', error);
    throw error;
  }
};

/**
 * Get user's bookmarked events
 */
export const getUserBookmarks = async (userId: string): Promise<EventData[]> => {
  try {
    const bookmarksRef = ref(rtdb, `users/${userId}/bookmarkedEvents`);
    const snapshot = await get(bookmarksRef);
    
    if (snapshot.exists()) {
      const bookmarkedIds = Object.keys(snapshot.val());
      
      // Fetch all bookmarked events
      const eventPromises = bookmarkedIds.map(id => getEventById(id));
      const events = await Promise.all(eventPromises);
      
      return events.filter(e => e !== null) as EventData[];
    }
    return [];
  } catch (error) {
    console.error('❌ Error fetching bookmarks:', error);
    throw error;
  }
};
```

---

## 4. API Routes

### Create API Route: `src/app/api/events/create/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createEvent } from '@/services/eventService';
import { getServerSession } from 'next-auth';

export async function POST(req: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const eventData = await req.json();
    
    // Validate required fields
    if (!eventData.basicInfo?.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    // Create event
    const eventId = await createEvent(eventData, session.user.id);
    
    return NextResponse.json({
      success: true,
      eventId,
      message: 'Event created successfully'
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
```

### Read API Route: `src/app/api/events/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getEventById, updateEvent, deleteEvent } from '@/services/eventService';
import { getServerSession } from 'next-auth';

// GET single event
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await getEventById(params.id);
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ event });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

// PATCH update event
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const updates = await req.json();
    await updateEvent(params.id, updates);
    
    return NextResponse.json({
      success: true,
      message: 'Event updated successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE event
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await deleteEvent(params.id, session.user.id);
    
    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
```

### List API Route: `src/app/api/events/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllEvents, 
  getEventsByOrganizer, 
  getEventsByStatus,
  getEventsByCategory 
} from '@/services/eventService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const organizerId = searchParams.get('organizerId');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    
    let events;
    
    if (organizerId) {
      events = await getEventsByOrganizer(organizerId);
    } else if (status) {
      events = await getEventsByStatus(status as any);
    } else if (category) {
      events = await getEventsByCategory(category);
    } else {
      events = await getAllEvents(limit ? parseInt(limit) : undefined);
    }
    
    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
```

---

## 5. React Components Integration

### Custom Hook: `src/hooks/useEvents.ts`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { 
  EventData,
  getAllEvents,
  getEventById,
  subscribeToEvent,
  subscribeToOrganizerEvents
} from '@/services/eventService';

/**
 * Hook to fetch and subscribe to event updates
 */
export function useEvent(eventId: string) {
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!eventId) return;

    setLoading(true);
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToEvent(eventId, (data) => {
      setEvent(data);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [eventId]);

  return { event, loading, error };
}

/**
 * Hook to fetch organizer's events with real-time updates
 */
export function useOrganizerEvents(organizerId: string) {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!organizerId) return;

    setLoading(true);
    
    const unsubscribe = subscribeToOrganizerEvents(organizerId, (data) => {
      setEvents(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [organizerId]);

  return { events, loading };
}

/**
 * Hook to fetch all events
 */
export function useAllEvents(limit?: number) {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getAllEvents(limit)
      .then(setEvents)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [limit]);

  return { events, loading, error };
}
```

### Event Creation Component: `src/components/events/create-event-form.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';

export function CreateEventForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    basicInfo: {
      title: '',
      description: '',
      category: 'conference',
      bannerImage: null,
    },
    schedule: {
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      timezone: 'America/New_York',
      recurring: false,
    },
    venue: {
      name: '',
      address: '',
      city: '',
      capacity: 0,
    },
    tickets: [{
      name: 'General Admission',
      price: 0,
      quantity: 0,
    }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/events/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          organizerId: user?.id,
          organizerEmail: user?.email,
          status: 'draft',
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Event created successfully!');
        router.push(`/dashboard/organizer/events/${data.eventId}`);
      } else {
        alert('Failed to create event: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('An error occurred while creating the event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          Event Title *
        </label>
        <input
          type="text"
          required
          value={formData.basicInfo.title}
          onChange={(e) => setFormData({
            ...formData,
            basicInfo: { ...formData.basicInfo, title: e.target.value }
          })}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Enter event title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Description *
        </label>
        <textarea
          required
          value={formData.basicInfo.description}
          onChange={(e) => setFormData({
            ...formData,
            basicInfo: { ...formData.basicInfo, description: e.target.value }
          })}
          className="w-full px-4 py-2 border rounded-lg"
          rows={4}
          placeholder="Describe your event"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Start Date *
          </label>
          <input
            type="date"
            required
            value={formData.schedule.startDate}
            onChange={(e) => setFormData({
              ...formData,
              schedule: { ...formData.schedule, startDate: e.target.value }
            })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Start Time *
          </label>
          <input
            type="time"
            required
            value={formData.schedule.startTime}
            onChange={(e) => setFormData({
              ...formData,
              schedule: { ...formData.schedule, startTime: e.target.value }
            })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Venue Name *
        </label>
        <input
          type="text"
          required
          value={formData.venue.name}
          onChange={(e) => setFormData({
            ...formData,
            venue: { ...formData.venue, name: e.target.value }
          })}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Enter venue name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          City *
        </label>
        <input
          type="text"
          required
          value={formData.venue.city}
          onChange={(e) => setFormData({
            ...formData,
            venue: { ...formData.venue, city: e.target.value }
          })}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Enter city"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating Event...' : 'Create Event'}
      </button>
    </form>
  );
}
```

### Event List Component: `src/components/events/event-list.tsx`

```typescript
'use client';

import { useAllEvents } from '@/hooks/useEvents';
import { EventData } from '@/services/eventService';

export function EventList() {
  const { events, loading, error } = useAllEvents();

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div>Error loading events: {error.message}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.eventId} event={event} />
      ))}
    </div>
  );
}

function EventCard({ event }: { event: EventData }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition">
      {event.basicInfo.bannerImage && (
        <img 
          src={event.basicInfo.bannerImage} 
          alt={event.basicInfo.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      <h3 className="text-xl font-bold mb-2">{event.basicInfo.title}</h3>
      <p className="text-gray-600 text-sm mb-2">{event.basicInfo.description}</p>
      <div className="text-sm text-gray-500">
        <p>📅 {event.schedule.startDate} at {event.schedule.startTime}</p>
        <p>📍 {event.venue.name}, {event.venue.city}</p>
        <p>🎫 Starting at ${event.tickets[0]?.price}</p>
      </div>
      <div className="mt-4">
        <span className={`px-3 py-1 rounded-full text-xs ${
          event.status === 'published' ? 'bg-green-100 text-green-800' :
          event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {event.status}
        </span>
      </div>
    </div>
  );
}
```

---

## 6. Security Rules

### Firebase Console → Realtime Database → Rules

```json
{
  "rules": {
    "events": {
      "$eventId": {
        // Anyone can read published events
        ".read": "data.child('status').val() === 'published' || auth != null",
        
        // Only the organizer can write to their events
        ".write": "auth != null && (
          !data.exists() || 
          data.child('organizerId').val() === auth.uid
        )",
        
        // Validate event structure
        ".validate": "newData.hasChildren(['eventId', 'organizerId', 'basicInfo', 'schedule', 'venue'])"
      }
    },
    
    "users": {
      "$userId": {
        // Users can only read/write their own data
        ".read": "auth != null && auth.uid === $userId",
        ".write": "auth != null && auth.uid === $userId"
      }
    },
    
    "eventMetrics": {
      "$eventId": {
        // Anyone can read metrics
        ".read": true,
        
        // Only authenticated users can update metrics
        ".write": "auth != null"
      }
    }
  }
}
```

---

## 7. Testing & Debugging

### Test Script: `scripts/test-event-crud.js`

```javascript
// Run with: node scripts/test-event-crud.js

const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-project-id-default-rtdb.firebaseio.com'
});

const db = admin.database();

async function testCRUD() {
  console.log('🧪 Testing Event CRUD Operations...\n');
  
  try {
    // CREATE
    console.log('1️⃣ Creating test event...');
    const newEventRef = db.ref('events').push();
    const testEvent = {
      eventId: newEventRef.key,
      organizerId: 'test-user-123',
      status: 'draft',
      createdAt: admin.database.ServerValue.TIMESTAMP,
      basicInfo: {
        title: 'Test Event',
        description: 'This is a test event',
        category: 'conference'
      },
      schedule: {
        startDate: '2026-03-01',
        startTime: '10:00',
        endDate: '2026-03-01',
        endTime: '18:00',
        timezone: 'America/New_York',
        recurring: false
      },
      venue: {
        name: 'Test Venue',
        address: '123 Test St',
        city: 'New York',
        capacity: 100
      },
      tickets: [
        {
          name: 'General Admission',
          price: 50,
          quantity: 100
        }
      ]
    };
    
    await newEventRef.set(testEvent);
    console.log('✅ Event created with ID:', newEventRef.key);
    
    // READ
    console.log('\n2️⃣ Reading event...');
    const snapshot = await newEventRef.once('value');
    const event = snapshot.val();
    console.log('✅ Event retrieved:', event.basicInfo.title);
    
    // UPDATE
    console.log('\n3️⃣ Updating event...');
    await newEventRef.update({
      'basicInfo/title': 'Updated Test Event',
      'status': 'published',
      updatedAt: admin.database.ServerValue.TIMESTAMP
    });
    console.log('✅ Event updated');
    
    // QUERY
    console.log('\n4️⃣ Querying events by status...');
    const querySnapshot = await db.ref('events')
      .orderByChild('status')
      .equalTo('published')
      .once('value');
    console.log('✅ Found', querySnapshot.numChildren(), 'published events');
    
    // DELETE
    console.log('\n5️⃣ Deleting event...');
    await newEventRef.remove();
    console.log('✅ Event deleted');
    
    console.log('\n🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
}

testCRUD();
```

### Debug Console Logs

Add to your components for debugging:

```typescript
// Enable Firebase debug logging (client-side)
if (typeof window !== 'undefined') {
  window.localStorage.setItem('debug', 'firebase:*');
}

// Log all database operations
import { enableLogging } from 'firebase/database';
enableLogging(true);
```

---

## 📚 Quick Reference

### Most Common Operations

```typescript
// Create
const eventId = await createEvent(eventData, userId);

// Read
const event = await getEventById(eventId);
const allEvents = await getAllEvents();
const myEvents = await getEventsByOrganizer(userId);

// Update
await updateEvent(eventId, { status: 'published' });
await updateEventStatus(eventId, 'cancelled');

// Delete
await deleteEvent(eventId, userId);

// Real-time
const unsubscribe = subscribeToEvent(eventId, (event) => {
  console.log('Event updated:', event);
});

// Cleanup
unsubscribe();
```

### Environment Variables Checklist

Ensure these are set in `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## 🎯 Next Steps

1. **Update `eventService.ts`** with the enhanced CRUD functions
2. **Create API routes** in `src/app/api/events/`
3. **Set up security rules** in Firebase Console
4. **Create React hooks** in `src/hooks/useEvents.ts`
5. **Build UI components** for event creation and listing
6. **Test thoroughly** with the provided test script

Your Firebase Realtime Database is now fully configured for event management! 🚀
