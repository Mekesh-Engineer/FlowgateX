# Firebase Realtime Database Setup - Complete Summary

## ✅ What's Been Done

Your Firebase Realtime Database is **fully configured and ready to use** for event management!

### Files Created/Updated:

1. **Service Layer** - `src/services/eventService.ts`
   - ✅ Complete CRUD operations
   - ✅ Real-time listeners
   - ✅ Bookmark functionality
   - ✅ Query functions (by status, category, organizer)
   - ✅ TypeScript types

2. **React Hooks** - `src/hooks/use-events.ts`
   - ✅ `useEvent()` - Single event with real-time updates
   - ✅ `useAllEvents()` - Fetch all events
   - ✅ `useOrganizerEvents()` - Organizer's events
   - ✅ `useEventsByStatus()` - Filter by status
   - ✅ `useEventsByCategory()` - Filter by category
   - ✅ `useUserBookmarks()` - User's saved events
   - ✅ `useEventActions()` - Create/Update/Delete operations

3. **Documentation**
   - ✅ `FIREBASE_REALTIME_DATABASE_GUIDE.md` - Complete guide
   - ✅ `FIREBASE_QUICKSTART_EXAMPLES.md` - Ready-to-use components

---

## 🚀 How to Use

### Step 1: Verify Environment Variables

Make sure these are set in your `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
```

### Step 2: Import and Use

```typescript
// In any component
import { useAllEvents, useEventActions } from '@/hooks/use-events';

export function MyComponent() {
  const { events, loading } = useAllEvents();
  const { createEvent, updateEvent, deleteEvent } = useEventActions();
  
  // Use events...
}
```

---

## 📚 Available Functions

### Service Functions (Direct Database Access)

```typescript
import { 
  // Create
  createEvent,
  
  // Read
  getEventById,
  getAllEvents,
  getEventsByOrganizer,
  getEventsByStatus,
  getEventsByCategory,
  
  // Update
  updateEvent,
  updateEventStatus,
  incrementEventViews,
  
  // Delete
  deleteEvent,
  
  // Real-time
  subscribeToEvent,
  subscribeToOrganizerEvents,
  
  // Bookmarks
  bookmarkEvent,
  unbookmarkEvent,
  getUserBookmarks
} from '@/services/eventService';
```

### React Hooks (Recommended for Components)

```typescript
import {
  useEvent,              // Single event with real-time updates
  useAllEvents,          // All events
  useOrganizerEvents,    // Organizer's events
  useOrganizerEventsRT,  // With real-time updates
  useEventsByStatus,     // Filter by status
  useEventsByCategory,   // Filter by category
  useUserBookmarks,      // User's saved events
  useEventActions        // CRUD operations
} from '@/hooks/use-events';
```

---

## 💡 Quick Examples

### Create an Event

```typescript
import { useEventActions } from '@/hooks/use-events';
import { useAuth } from '@/providers/auth-provider';

function CreateButton() {
  const { user } = useAuth();
  const { createEvent, loading } = useEventActions();
  
  const handleCreate = async () => {
    const eventData = {
      basicInfo: {
        title: 'My Event',
        description: 'Event description',
        category: 'conference'
      },
      schedule: {
        startDate: '2026-03-15',
        startTime: '10:00',
        endDate: '2026-03-15',
        endTime: '18:00',
        timezone: 'America/New_York',
        recurring: false
      },
      venue: {
        name: 'Convention Center',
        address: '123 Main St',
        city: 'New York',
        capacity: 500
      },
      tickets: [{
        name: 'General',
        price: 50,
        quantity: 500
      }],
      status: 'draft' as const
    };
    
    try {
      const eventId = await createEvent(eventData, user!.id);
      console.log('Created event:', eventId);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <button onClick={handleCreate} disabled={loading}>
      {loading ? 'Creating...' : 'Create Event'}
    </button>
  );
}
```

### Display Events List

```typescript
import { useAllEvents } from '@/hooks/use-events';

function EventsList() {
  const { events, loading, error } = useAllEvents();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {events.map(event => (
        <div key={event.eventId}>
          <h3>{event.basicInfo.title}</h3>
          <p>{event.basicInfo.description}</p>
          <p>Status: {event.status}</p>
        </div>
      ))}
    </div>
  );
}
```

### Real-Time Event Updates

```typescript
import { useEvent } from '@/hooks/use-events';

function EventDetails({ eventId }: { eventId: string }) {
  const { event, loading } = useEvent(eventId);
  
  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found</div>;
  
  return (
    <div>
      <h1>{event.basicInfo.title}</h1>
      <p>Views: {event.analytics?.views || 0}</p>
      {/* Updates automatically when data changes! */}
    </div>
  );
}
```

### Update Event

```typescript
import { useEventActions } from '@/hooks/use-events';

function PublishButton({ eventId }: { eventId: string }) {
  const { updateEvent, loading } = useEventActions();
  
  const handlePublish = async () => {
    try {
      await updateEvent(eventId, { status: 'published' });
      alert('Event published!');
    } catch (error) {
      alert('Failed to publish');
    }
  };
  
  return (
    <button onClick={handlePublish} disabled={loading}>
      Publish Event
    </button>
  );
}
```

### Delete Event

```typescript
import { useEventActions } from '@/hooks/use-events';

function DeleteButton({ eventId }: { eventId: string }) {
  const { deleteEvent, loading } = useEventActions();
  
  const handleDelete = async () => {
    if (!confirm('Are you sure?')) return;
    
    try {
      await deleteEvent(eventId);
      alert('Event deleted!');
    } catch (error) {
      alert('Failed to delete');
    }
  };
  
  return (
    <button onClick={handleDelete} disabled={loading}>
      Delete
    </button>
  );
}
```

---

## 🎯 Database Structure

Your events are stored in this structure:

```
/events
  /{eventId}
    eventId: string
    organizerId: string
    status: "draft" | "published" | "cancelled" | "completed"
    createdAt: timestamp
    updatedAt: timestamp
    basicInfo:
      title: string
      description: string
      category: string
      bannerImage: string
    schedule:
      startDate: string
      startTime: string
      endDate: string
      endTime: string
      timezone: string
      recurring: boolean
    venue:
      name: string
      address: string
      city: string
      capacity: number
    tickets: []
    promoCodes: []
    iotGates: []
    settings: {}
    analytics:
      views: number
      bookmarks: number
      checkIns: number
      revenue: number

/users
  /{userId}
    events:
      /{eventId}: true
    bookmarkedEvents:
      /{eventId}: true
```

---

## 🔒 Security Rules (Next Step)

Add these rules in **Firebase Console → Realtime Database → Rules**:

```json
{
  "rules": {
    "events": {
      "$eventId": {
        ".read": "data.child('status').val() === 'published' || auth != null",
        ".write": "auth != null && (
          !data.exists() || 
          data.child('organizerId').val() === auth.uid
        )"
      }
    },
    "users": {
      "$userId": {
        ".read": "auth != null && auth.uid === $userId",
        ".write": "auth != null && auth.uid === $userId"
      }
    }
  }
}
```

---

## 🧪 Testing

### Manual Test in Browser Console:

```javascript
// Import functions
import { createEvent, getEventById } from '@/services/eventService';

// Create test event
const testData = {
  basicInfo: { title: 'Test', description: 'Test event', category: 'other' },
  schedule: { 
    startDate: '2026-03-01', 
    startTime: '10:00',
    endDate: '2026-03-01',
    endTime: '18:00',
    timezone: 'America/New_York',
    recurring: false
  },
  venue: { name: 'Test Venue', address: '123 St', city: 'NYC', capacity: 100 },
  tickets: [{ name: 'General', price: 10, quantity: 100 }],
  status: 'draft'
};

const eventId = await createEvent(testData, 'your-user-id');
console.log('Created:', eventId);

// Fetch it back
const event = await getEventById(eventId);
console.log('Retrieved:', event);
```

---

## 📖 Full Documentation

For complete details, see:
- **[FIREBASE_REALTIME_DATABASE_GUIDE.md](./FIREBASE_REALTIME_DATABASE_GUIDE.md)** - Complete implementation guide
- **[FIREBASE_QUICKSTART_EXAMPLES.md](./FIREBASE_QUICKSTART_EXAMPLES.md)** - Ready-to-use component examples

---

## ✨ What You Can Do Now

✅ Create events  
✅ Read/display events  
✅ Update events  
✅ Delete events  
✅ Real-time updates  
✅ Filter by status/category/organizer  
✅ Bookmark events  
✅ Track analytics (views, bookmarks, etc.)  
✅ Query events efficiently  

**Your Firebase Realtime Database integration is complete!** 🎉

Start using it in your components right away:

```typescript
import { useAllEvents } from '@/hooks/use-events';

const { events, loading } = useAllEvents();
```

Happy coding! 🚀
