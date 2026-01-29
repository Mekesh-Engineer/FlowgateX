// src/app/booking/[eventId]/page.tsx
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getEventById, convertEventDataToEvent } from '@/services/eventService';
import { BookingFlow } from '@/features/booking/components/booking-flow';

interface PageProps {
  params: Promise<{ eventId: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { eventId } = await params;
  
  try {
    const eventData = await getEventById(eventId);
    
    if (!eventData) {
      return { title: 'Event Not Found | FlowGate' };
    }
    
    const event = convertEventDataToEvent(eventData);

    return {
      title: `Book ${event.title} | FlowGate`,
      description: `Secure your tickets for ${event.title}. Easy booking process with instant confirmation.`,
      robots: 'noindex', // Booking pages shouldn't be indexed
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return { title: 'Booking | FlowGate' };
  }
}

// Main booking page component
export default async function BookingPage({ params }: PageProps) {
  const { eventId } = await params;
  
  try {
    // Fetch event data from Firebase RTDB
    const eventData = await getEventById(eventId);
    
    // Check if event exists
    if (!eventData) {
      return notFound();
    }
    
    // Check if event is published
    if (eventData.status !== 'published') {
      return notFound();
    }
    
    // Convert to frontend Event type
    const event = convertEventDataToEvent(eventData);
    
    // Check if event is in the past
    const eventDate = new Date(event.date);
    const now = new Date();
    
    if (eventDate < now) {
      // Event has already passed
      return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-8 text-center">
            <div className="w-20 h-20 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-icons-outlined text-4xl text-[var(--text-tertiary)]">event_busy</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Event Has Passed</h1>
            <p className="text-[var(--text-secondary)] mb-6">
              This event took place on {eventDate.toLocaleDateString()}. Bookings are no longer available.
            </p>
            <a 
              href="/dashboard/user/events"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary)]/90 transition-colors"
            >
              <span className="material-icons-outlined">search</span>
              Browse Other Events
            </a>
          </div>
        </div>
      );
    }
    
    // Check if tickets are sold out
    const isFullyBooked = event.available !== undefined && event.available <= 0;
    
    if (isFullyBooked) {
      return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-icons-outlined text-4xl text-red-600">sold_out</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Event Sold Out</h1>
            <p className="text-[var(--text-secondary)] mb-6">
              All tickets for {event.title} have been sold. Join the waitlist to be notified if tickets become available.
            </p>
            <div className="flex flex-col gap-3">
              <button className="px-6 py-3 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary)]/90 transition-colors">
                Join Waitlist
              </button>
              <a 
                href="/dashboard/user/events"
                className="text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors"
              >
                Browse Similar Events
              </a>
            </div>
          </div>
        </div>
      );
    }

    // Render booking flow
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-4">
              <a href="/" className="hover:text-[var(--brand-primary)] transition-colors">Home</a>
              <span>/</span>
              <a href="/dashboard/user/events" className="hover:text-[var(--brand-primary)] transition-colors">Events</a>
              <span>/</span>
              <a href={`/events/${event.id}`} className="hover:text-[var(--brand-primary)] transition-colors">{event.title}</a>
              <span>/</span>
              <span className="text-[var(--text-primary)] font-medium">Booking</span>
            </div>
            
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              Complete Your Booking
            </h1>
            <p className="text-[var(--text-secondary)]">
              Secure your spot for {event.title}. All bookings are protected by our buyer guarantee.
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="flex items-center gap-3 bg-[var(--bg-card)] rounded-lg border border-[var(--border-primary)] p-4">
              <span className="material-icons-outlined text-green-600">verified_user</span>
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)]">Secure Payment</div>
                <div className="text-xs text-[var(--text-secondary)]">SSL Encrypted</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-[var(--bg-card)] rounded-lg border border-[var(--border-primary)] p-4">
              <span className="material-icons-outlined text-blue-600">confirmation_number</span>
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)]">Instant Tickets</div>
                <div className="text-xs text-[var(--text-secondary)]">Via Email & SMS</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-[var(--bg-card)] rounded-lg border border-[var(--border-primary)] p-4">
              <span className="material-icons-outlined text-amber-600">schedule</span>
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)]">24/7 Support</div>
                <div className="text-xs text-[var(--text-secondary)]">Here to Help</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-[var(--bg-card)] rounded-lg border border-[var(--border-primary)] p-4">
              <span className="material-icons-outlined text-purple-600">autorenew</span>
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)]">Easy Refunds</div>
                <div className="text-xs text-[var(--text-secondary)]">Up to 24h Before</div>
              </div>
            </div>
          </div>

          {/* Booking Flow Component */}
          <BookingFlow event={event} />

          {/* Additional Info */}
          <div className="mt-12 bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="material-icons-outlined">info</span>
              Booking Information
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2 text-[var(--text-primary)]">Cancellation Policy</h4>
                <p className="text-[var(--text-secondary)]">
                  Full refund available up to 24 hours before the event. After that, tickets are non-refundable but transferable.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-[var(--text-primary)]">Entry Requirements</h4>
                <p className="text-[var(--text-secondary)]">
                  Please bring a valid photo ID and your ticket (digital or printed). Age restrictions may apply.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-[var(--text-primary)]">Contact Support</h4>
                <p className="text-[var(--text-secondary)]">
                  Questions? Email support@flowgate.com or call +91-1234-567-890 for assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    
  } catch (error) {
    console.error('Error loading booking page:', error);
    
    // Show error page
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-icons-outlined text-4xl text-red-600">error_outline</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Something Went Wrong</h1>
          <p className="text-[var(--text-secondary)] mb-6">
            We couldn&apos;t load the booking page. Please try again or contact support if the problem persists.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary)]/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
}
