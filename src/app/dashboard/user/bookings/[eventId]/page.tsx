// src/app/booking/[eventId]/page.tsx
import { notFound } from 'next/navigation';
import { EventService } from '@/services/event.service';
import { BookingFlow } from '@/features/booking/components/booking-flow';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ eventId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { eventId } = await params;
  const event = await EventService.getEventById(eventId);
  
  return {
    title: event ? `Book: ${event.title} | FlowGate` : 'Booking Not Found',
  };
}

export default async function BookingPage({ params }: PageProps) {
  const { eventId } = await params;
  const event = await EventService.getEventById(eventId);

  if (!event) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="sr-only">Checkout for {event.title}</h1>
        <BookingFlow event={event} />
      </div>
    </div>
  );
}