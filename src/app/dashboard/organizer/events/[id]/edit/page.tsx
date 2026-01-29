'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { getEventById, EventData } from '@/services/eventService';
import { useAuth } from '@/providers/auth-provider';
import EventForm from '@/features/organizer/components/event-form';
import Link from 'next/link';

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const event = await getEventById(id);
        if (event) {
          // Check if user is the organizer
          if (user && event.organizerId !== user.id) {
            alert('You do not have permission to edit this event');
            router.push('/dashboard/organizer/events');
            return;
          }
          setEventData(event);
        } else {
          alert('Event not found');
          router.push('/dashboard/organizer/events');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        alert('Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEvent();
    }
  }, [id, user, router]);

  const handleSuccess = (eventId: string) => {
    router.push(`/dashboard/organizer/events/${eventId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
        <Link href="/dashboard/organizer/events" className="text-blue-600 hover:underline">
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/dashboard/organizer/events" 
          className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <span className="material-icons-outlined text-sm">arrow_back</span>
          Back to Events
        </Link>
      </div>
      
      <h1 className="text-3xl font-heading font-bold mb-6">Edit Event</h1>
      
      <EventForm 
        mode="edit" 
        eventData={eventData} 
        onSuccess={handleSuccess}
      />
    </div>
  );
}
