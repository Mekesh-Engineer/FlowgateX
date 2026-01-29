# Firebase Realtime Database - Quick Start Examples

## 🚀 Ready-to-Use Code Snippets

### 1. Create Event Form Component

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { useEventActions } from '@/hooks/use-events';

export function CreateEventForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { createEvent, loading, error } = useEventActions();
  
  const [formData, setFormData] = useState({
    basicInfo: {
      title: '',
      description: '',
      category: 'conference',
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
    status: 'draft' as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      alert('Please log in to create an event');
      return;
    }

    try {
      const eventId = await createEvent(formData, user.id);
      alert('Event created successfully!');
      router.push(`/dashboard/organizer/events/${eventId}`);
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to create event');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold">Create New Event</h2>
      
      {/* Title */}
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
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter event title"
        />
      </div>

      {/* Description */}
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
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Describe your event"
        />
      </div>

      {/* Date & Time */}
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

      {/* Venue */}
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

      {/* Capacity */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Capacity *
        </label>
        <input
          type="number"
          required
          min="1"
          value={formData.venue.capacity}
          onChange={(e) => setFormData({
            ...formData,
            venue: { ...formData.venue, capacity: parseInt(e.target.value) || 0 }
          })}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Maximum attendees"
        />
      </div>

      {/* Ticket Price */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Ticket Price *
        </label>
        <input
          type="number"
          required
          min="0"
          step="0.01"
          value={formData.tickets[0].price}
          onChange={(e) => setFormData({
            ...formData,
            tickets: [{
              ...formData.tickets[0],
              price: parseFloat(e.target.value) || 0
            }]
          })}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="0.00"
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error.message}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? 'Creating Event...' : 'Create Event'}
      </button>
    </form>
  );
}
```

---

### 2. Display Events List

```tsx
'use client';

import { useAllEvents } from '@/hooks/use-events';
import Link from 'next/link';

export function EventsList() {
  const { events, loading, error, refetch } = useAllEvents(20);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error loading events: {error.message}
        <button onClick={refetch} className="ml-4 underline">
          Retry
        </button>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No events found. Create your first event!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Link 
          key={event.eventId} 
          href={`/events/${event.eventId}`}
          className="block"
        >
          <div className="border rounded-lg overflow-hidden hover:shadow-xl transition">
            {/* Banner Image */}
            {event.basicInfo.bannerImage && (
              <img 
                src={event.basicInfo.bannerImage} 
                alt={event.basicInfo.title}
                className="w-full h-48 object-cover"
              />
            )}
            
            {/* Content */}
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2 line-clamp-2">
                {event.basicInfo.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {event.basicInfo.description}
              </p>
              
              <div className="space-y-2 text-sm text-gray-500">
                <p>📅 {event.schedule.startDate} at {event.schedule.startTime}</p>
                <p>📍 {event.venue.name}, {event.venue.city}</p>
                <p>🎫 From ${event.tickets[0]?.price || 0}</p>
              </div>
              
              {/* Status Badge */}
              <div className="mt-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  event.status === 'published' ? 'bg-green-100 text-green-800' :
                  event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                  event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {event.status.toUpperCase()}
                </span>
              </div>

              {/* Analytics */}
              {event.analytics && (
                <div className="mt-3 flex gap-4 text-xs text-gray-500">
                  <span>👁️ {event.analytics.views || 0} views</span>
                  <span>🔖 {event.analytics.bookmarks || 0} bookmarks</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
```

---

### 3. Single Event Page with Real-Time Updates

```tsx
'use client';

import { useEvent } from '@/hooks/use-events';
import { useParams } from 'next/navigation';
import { incrementEventViews } from '@/services/eventService';
import { useEffect } from 'react';

export default function EventDetailsPage() {
  const params = useParams();
  const eventId = params.id as string;
  const { event, loading, error } = useEvent(eventId);

  // Increment views when page loads
  useEffect(() => {
    if (eventId) {
      incrementEventViews(eventId).catch(console.error);
    }
  }, [eventId]);

  if (loading) {
    return <div className="flex justify-center py-12">Loading event...</div>;
  }

  if (error || !event) {
    return <div className="text-red-600">Event not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Banner */}
      {event.basicInfo.bannerImage && (
        <img 
          src={event.basicInfo.bannerImage}
          alt={event.basicInfo.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}

      {/* Title & Status */}
      <div className="flex items-start justify-between mb-4">
        <h1 className="text-3xl font-bold">{event.basicInfo.title}</h1>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
          event.status === 'published' ? 'bg-green-100 text-green-800' :
          event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {event.status.toUpperCase()}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-6">{event.basicInfo.description}</p>

      {/* Event Details */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Schedule */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">📅 Schedule</h3>
          <p>Start: {event.schedule.startDate} at {event.schedule.startTime}</p>
          <p>End: {event.schedule.endDate} at {event.schedule.endTime}</p>
          <p className="text-sm text-gray-600 mt-2">{event.schedule.timezone}</p>
        </div>

        {/* Venue */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">📍 Venue</h3>
          <p className="font-medium">{event.venue.name}</p>
          <p>{event.venue.address}</p>
          <p>{event.venue.city}</p>
          <p className="text-sm text-gray-600 mt-2">
            Capacity: {event.venue.capacity} people
          </p>
        </div>
      </div>

      {/* Tickets */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">🎫 Tickets</h3>
        <div className="space-y-3">
          {event.tickets.map((ticket, index) => (
            <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{ticket.name}</p>
                <p className="text-sm text-gray-600">
                  {ticket.sold || 0} / {ticket.quantity} sold
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">${ticket.price}</p>
                {ticket.earlyBird && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Early Bird
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities */}
      {event.settings?.amenities && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-3">✨ Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {event.settings.amenities.wifi && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                📶 WiFi
              </span>
            )}
            {event.settings.amenities.parking && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                🅿️ Parking
              </span>
            )}
            {event.settings.amenities.wheelchair && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                ♿ Wheelchair Access
              </span>
            )}
          </div>
        </div>
      )}

      {/* Analytics */}
      {event.analytics && (
        <div className="flex gap-6 text-sm text-gray-600">
          <span>👁️ {event.analytics.views || 0} views</span>
          <span>🔖 {event.analytics.bookmarks || 0} bookmarks</span>
          <span>✅ {event.analytics.checkIns || 0} check-ins</span>
          {event.analytics.revenue && (
            <span>💰 ${event.analytics.revenue.toFixed(2)} revenue</span>
          )}
        </div>
      )}
    </div>
  );
}
```

---

### 4. Organizer Dashboard - My Events

```tsx
'use client';

import { useOrganizerEventsRT } from '@/hooks/use-events';
import { useAuth } from '@/providers/auth-provider';
import { useEventActions } from '@/hooks/use-events';
import { useState } from 'react';

export function OrganizerEventsManager() {
  const { user } = useAuth();
  const { events, loading } = useOrganizerEventsRT(user?.id || null);
  const { updateEvent, deleteEvent } = useEventActions();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handlePublish = async (eventId: string) => {
    setActionLoading(eventId);
    try {
      await updateEvent(eventId, { status: 'published' });
      alert('Event published successfully!');
    } catch (error) {
      alert('Failed to publish event');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    setActionLoading(eventId);
    try {
      await deleteEvent(eventId);
      alert('Event deleted successfully!');
    } catch (error) {
      alert('Failed to delete event');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div>Loading your events...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Events ({events.length})</h2>
        <a 
          href="/dashboard/organizer/events/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Create Event
        </a>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          You haven't created any events yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <div 
              key={event.eventId} 
              className="border rounded-lg p-4 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{event.basicInfo.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      event.status === 'published' ? 'bg-green-100 text-green-800' :
                      event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2">
                    {event.basicInfo.description.slice(0, 150)}...
                  </p>
                  
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>📅 {event.schedule.startDate}</span>
                    <span>📍 {event.venue.city}</span>
                    <span>🎫 {event.tickets.reduce((sum, t) => sum + (t.sold || 0), 0)} tickets sold</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <a
                    href={`/dashboard/organizer/events/${event.eventId}/edit`}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    Edit
                  </a>
                  
                  {event.status === 'draft' && (
                    <button
                      onClick={() => handlePublish(event.eventId!)}
                      disabled={actionLoading === event.eventId}
                      className="px-3 py-1 text-sm bg-green-100 text-green-800 hover:bg-green-200 rounded disabled:opacity-50"
                    >
                      {actionLoading === event.eventId ? 'Publishing...' : 'Publish'}
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDelete(event.eventId!)}
                    disabled={actionLoading === event.eventId}
                    className="px-3 py-1 text-sm bg-red-100 text-red-800 hover:bg-red-200 rounded disabled:opacity-50"
                  >
                    {actionLoading === event.eventId ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>

              {/* Analytics */}
              {event.analytics && (
                <div className="mt-3 pt-3 border-t flex gap-4 text-xs text-gray-500">
                  <span>👁️ {event.analytics.views || 0} views</span>
                  <span>🔖 {event.analytics.bookmarks || 0} bookmarks</span>
                  <span>✅ {event.analytics.checkIns || 0} check-ins</span>
                  {event.analytics.revenue && (
                    <span>💰 ${event.analytics.revenue.toFixed(2)}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

### 5. Bookmark Functionality

```tsx
'use client';

import { useState } from 'react';
import { bookmarkEvent, unbookmarkEvent } from '@/services/eventService';
import { useAuth } from '@/providers/auth-provider';

export function BookmarkButton({ eventId }: { eventId: string }) {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggleBookmark = async () => {
    if (!user?.id) {
      alert('Please log in to bookmark events');
      return;
    }

    setLoading(true);
    try {
      if (isBookmarked) {
        await unbookmarkEvent(user.id, eventId);
        setIsBookmarked(false);
      } else {
        await bookmarkEvent(user.id, eventId);
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Bookmark error:', error);
      alert('Failed to update bookmark');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleBookmark}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
        isBookmarked 
          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } disabled:opacity-50`}
    >
      {isBookmarked ? '🔖' : '🔗'}
      {loading ? 'Saving...' : isBookmarked ? 'Bookmarked' : 'Bookmark'}
    </button>
  );
}
```

---

## 📊 Usage Summary

### Import the hooks:
```typescript
import { 
  useEvent,           // Single event with real-time updates
  useAllEvents,       // All events
  useOrganizerEvents, // Organizer's events
  useEventActions,    // Create/Update/Delete actions
} from '@/hooks/use-events';
```

### Use in your components:
```typescript
// Fetch all events
const { events, loading, error, refetch } = useAllEvents(20);

// Get single event with live updates
const { event, loading, error } = useEvent(eventId);

// CRUD operations
const { createEvent, updateEvent, deleteEvent, loading } = useEventActions();
```

That's it! Your Firebase Realtime Database is fully integrated! 🎉
