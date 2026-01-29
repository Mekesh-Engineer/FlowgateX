'use client';

import EventForm from '@/features/organizer/components/event-form';
import { useRouter } from 'next/navigation';

export default function CreateEventPage() {
  const router = useRouter();

  const handleSuccess = (eventId: string) => {
    router.push(`/dashboard/organizer/events/${eventId}`);
  };

  return <EventForm mode='create' onSuccess={handleSuccess} />;
}
