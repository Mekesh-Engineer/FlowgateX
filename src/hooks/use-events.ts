'use client';

import { useState, useEffect } from 'react';
import { 
  EventData,
  getAllEvents,
  getEventById,
  getEventsByOrganizer,
  getEventsByStatus,
  getEventsByCategory,
  subscribeToEvent,
  subscribeToOrganizerEvents,
  getUserBookmarks
} from '@/services/eventService';

/**
 * Hook to fetch and subscribe to a single event with real-time updates
 */
export function useEvent(eventId: string | null) {
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToEvent(eventId, (data) => {
      setEvent(data);
      setLoading(false);
    });

    // Cleanup subscription on unmount or eventId change
    return () => unsubscribe();
  }, [eventId]);

  return { event, loading, error };
}

/**
 * Hook to fetch organizer's events with real-time updates
 */
export function useOrganizerEventsRT(organizerId: string | null) {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!organizerId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    const unsubscribe = subscribeToOrganizerEvents(organizerId, (data) => {
      setEvents(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [organizerId]);

  return { events, loading, error };
}

/**
 * Hook to fetch all events (one-time fetch, no real-time)
 */
export function useAllEvents(limit?: number) {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    getAllEvents(limit)
      .then(setEvents)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [limit]);

  const refetch = () => {
    setLoading(true);
    getAllEvents(limit)
      .then(setEvents)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  return { events, loading, error, refetch };
}

/**
 * Hook to fetch events by organizer ID (one-time fetch)
 */
export function useOrganizerEvents(organizerId: string | null) {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!organizerId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    getEventsByOrganizer(organizerId)
      .then(setEvents)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [organizerId]);

  const refetch = () => {
    if (!organizerId) return;
    
    setLoading(true);
    getEventsByOrganizer(organizerId)
      .then(setEvents)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  return { events, loading, error, refetch };
}

/**
 * Hook to fetch events by status
 */
export function useEventsByStatus(
  status: 'draft' | 'published' | 'cancelled' | 'completed' | null
) {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!status) {
      setLoading(false);
      return;
    }

    setLoading(true);
    getEventsByStatus(status)
      .then(setEvents)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [status]);

  const refetch = () => {
    if (!status) return;
    
    setLoading(true);
    getEventsByStatus(status)
      .then(setEvents)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  return { events, loading, error, refetch };
}

/**
 * Hook to fetch events by category
 */
export function useEventsByCategory(category: string | null) {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!category) {
      setLoading(false);
      return;
    }

    setLoading(true);
    getEventsByCategory(category)
      .then(setEvents)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [category]);

  const refetch = () => {
    if (!category) return;
    
    setLoading(true);
    getEventsByCategory(category)
      .then(setEvents)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  return { events, loading, error, refetch };
}

/**
 * Hook to fetch user's bookmarked events
 */
export function useUserBookmarks(userId: string | null) {
  const [bookmarks, setBookmarks] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    getUserBookmarks(userId)
      .then(setBookmarks)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  const refetch = () => {
    if (!userId) return;
    
    setLoading(true);
    getUserBookmarks(userId)
      .then(setBookmarks)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  return { bookmarks, loading, error, refetch };
}

/**
 * Hook for event CRUD operations
 */
export function useEventActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createEvent = async (eventData: any, userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/events/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...eventData, organizerId: userId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create event');
      }
      
      return data.eventId;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (eventId: string, updates: Partial<EventData>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update event');
      }
      
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete event');
      }
      
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createEvent,
    updateEvent,
    deleteEvent,
    loading,
    error,
  };
}
