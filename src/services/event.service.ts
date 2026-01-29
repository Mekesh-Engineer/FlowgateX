// src/services/event.service.ts
// This file is deprecated - use eventService.ts instead
// Keeping for backwards compatibility

import { getEventById, convertEventDataToEvent } from './eventService';
import type { Event } from '@/features/events/event.types';

/**
 * Legacy EventService for backwards compatibility
 * All new code should use functions from eventService.ts directly
 */
export const EventService = {
  // Fetch single event by ID
  getEventById: async (eventId: string): Promise<Event | null> => {
    try {
      const eventData = await getEventById(eventId);
      if (!eventData) return null;
      
      return convertEventDataToEvent(eventData);
    } catch (error) {
      console.error("Error fetching event:", error);
      return null;
    }
  },

  // Create a new booking - forwarded to eventService
  createBooking: async (bookingData: any) => {
    // This will be implemented in eventService.ts
    const { createBooking } = await import('./eventService');
    return createBooking(bookingData);
  }
};