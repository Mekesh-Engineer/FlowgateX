import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventById, getPublishedEvents, convertEventDataToEvent } from '@/services/eventService';
import { Event } from '@/features/events/event.types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BookingSidebar } from '@/features/events/components/booking-sidebar';
import { EventAgenda } from '@/features/events/components/event-agenda';
import { EventReviews } from '@/features/events/components/event-reviews';
import { ShareButtons } from '@/features/events/components/share-buttons';

// --- TYPES ---
interface PageProps {
  params: Promise<{ slug: string }>;
}

// --- METADATA GENERATION ---
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const eventData = await getEventById(slug);
    
    if (!eventData) {
      return { title: 'Event Not Found' };
    }
    
    const event = convertEventDataToEvent(eventData);

    return {
      title: `${event.title} | FlowGate`,
      description: event.description.substring(0, 160),
      openGraph: {
        title: event.title,
        description: event.description,
        images: event.image ? [event.image] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return { title: 'Event Not Found' };
  }
}

// --- MAIN PAGE COMPONENT ---
export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  try {
    // Fetch event from Firebase Realtime Database
    const eventData = await getEventById(slug);
    
    if (!eventData || eventData.status !== 'published') {
      return notFound();
    }
    
    // Convert to frontend Event type
    const event = convertEventDataToEvent(eventData);
    
    // Fetch all published events for related events section
    const allEvents = await getPublishedEvents();
    const relatedEvents = allEvents
      .filter(e => e.id !== event.id && e.category === event.category)
      .slice(0, 3);

    // Calculate generic countdown target (e.g., event date)
    const eventDate = new Date(`${event.date}T${event.time || '09:00'}`);

    return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-20">
      
      {/* 1. HERO BANNER */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        {event.image && (
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-black/50 to-black/30" />
        
        <div className="absolute inset-0 flex flex-col justify-end pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-2 text-white">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-[var(--brand-primary)] text-white">
                  {event.category}
                </span>
                {event.isFeatured && (
                   <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-amber-500 text-white flex items-center gap-1">
                     <span className="material-icons-outlined text-sm">star</span> Featured
                   </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-shadow-lg">
                {event.title}
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center text-gray-200 text-sm md:text-base">
                <div className="flex items-center gap-1">
                  <span className="material-icons-outlined text-[var(--brand-primary)]">calendar_today</span>
                  {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="hidden sm:block text-gray-400">•</div>
                <div className="flex items-center gap-1">
                  <span className="material-icons-outlined text-[var(--brand-primary)]">schedule</span>
                  {event.time}
                </div>
                <div className="hidden sm:block text-gray-400">•</div>
                <div className="flex items-center gap-1">
                  <span className="material-icons-outlined text-[var(--brand-primary)]">location_on</span>
                  {typeof event.location === 'string' ? event.location : event.location.city}
                </div>
              </div>
            </div>

            {/* Countdown Timer Component would go here */}
            <EventCountdown targetDate={eventDate} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN: MAIN CONTENT --- */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* 2. EVENT SUMMARY & ORGANIZER */}
            <section className="bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-primary)] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">About this Event</h2>
                <ShareButtons title={event.title} />
              </div>
              
              <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>

              <div className="mt-8 flex items-center gap-4 p-4 bg-[var(--bg-secondary)] rounded-lg">
                <div className="h-12 w-12 rounded-full bg-[var(--brand-primary)]/10 flex items-center justify-center text-[var(--brand-primary)] font-bold text-xl">
                  {(typeof event.organizer === 'object' ? event.organizer.name : event.organizer).charAt(0)}
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)] uppercase font-semibold">Organized by</p>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-[var(--text-primary)]">
                      {typeof event.organizer === 'object' ? event.organizer.name : event.organizer}
                    </p>
                    {typeof event.organizer === 'object' && event.organizer.verified && (
                      <span className="material-icons-outlined text-blue-500 text-sm" title="Verified Organizer">verified</span>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="ml-auto">Follow</Button>
              </div>
            </section>

            {/* 3. EVENT AGENDA (Timeline) */}
            <section>
               <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Event Agenda</h2>
               <EventAgenda agenda={event.agenda} />
            </section>

            {/* 4. VENUE DETAILS */}
            <section>
               <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Venue & Location</h2>
               <div className="bg-[var(--bg-card)] rounded-xl overflow-hidden border border-[var(--border-primary)]">
                 {/* Google Maps Embed Placeholder */}
                 <div className="w-full h-64 bg-gray-200 relative">
                   <iframe 
                     width="100%" 
                     height="100%" 
                     frameBorder="0" 
                     style={{ border: 0 }}
                     src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(typeof event.location === 'string' ? event.location : `${event.location.venue}, ${event.location.city}`)}`}
                     allowFullScreen
                     className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                   ></iframe>
                   {/* Fallback visual if no API key */}
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-gray-100/10">
                      <span className="bg-white/80 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                         {typeof event.venue === 'string' ? event.venue : event.venue?.name || 'Venue Location'}
                      </span>
                   </div>
                 </div>
                 
                 <div className="p-6">
                   <h3 className="font-bold text-lg mb-2">{typeof event.venue === 'string' ? event.venue : event.venue?.name}</h3>
                   <p className="text-[var(--text-secondary)] text-sm mb-4">
                     {typeof event.venue === 'object' ? event.venue.address : 'Address available upon booking'}
                   </p>
                   
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                     <VenueFeature icon="group" label={`Capacity: ${event.capacity}`} />
                     <VenueFeature icon="local_parking" label="Parking" />
                     <VenueFeature icon="accessible" label="Accessible" />
                     <VenueFeature icon="wifi" label="Free WiFi" />
                   </div>
                 </div>
               </div>
            </section>

            {/* 5. REVIEWS */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Reviews & Feedback</h2>
              <EventReviews reviews={event.reviewsList} rating={event.rating} count={event.reviews} />
            </section>

          </div>

          {/* --- RIGHT COLUMN: STICKY SIDEBAR --- */}
          <div className="relative">
            <div className="sticky top-24 space-y-6">
               <BookingSidebar event={event} />
            </div>
          </div>

        </div>
        
        {/* 6. RELATED EVENTS (Bottom Carousel) */}
        {relatedEvents && relatedEvents.length > 0 && (
          <div className="mt-20 border-t border-[var(--border-primary)] pt-12">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-8">You May Also Like</h2>
            {/* Similar events from the same category */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {relatedEvents.map(related => (
                 <Link href={`/events/${related.id}`} key={related.id} className="group block bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] overflow-hidden hover:shadow-lg transition-all">
                    <div className="h-40 bg-[var(--bg-secondary)] relative">
                      {related.image && <Image src={related.image} alt={related.title} fill className="object-cover" />}
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold truncate group-hover:text-[var(--brand-primary)]">{related.title}</h4>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">{new Date(related.date).toLocaleDateString()}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg font-bold text-[var(--brand-primary)]">₹{related.price}</span>
                        {related.available && related.available > 0 && (
                          <span className="text-xs text-[var(--text-tertiary)]">{related.available} left</span>
                        )}
                      </div>
                    </div>
                 </Link>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
    );
  } catch (error) {
    console.error('Error loading event:', error);
    return notFound();
  }
}

// --- SUB-COMPONENTS (Can be moved to separate files) ---

function VenueFeature({ icon, label }: { icon: string, label: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-3 bg-[var(--bg-secondary)] rounded-lg text-center gap-2">
      <span className="material-icons-outlined text-[var(--brand-primary)]">{icon}</span>
      <span className="text-xs font-medium text-[var(--text-secondary)]">{label}</span>
    </div>
  );
}

// Simple Countdown Component
function EventCountdown({ targetDate }: { targetDate: Date }) {
  // Logic would normally use useEffect/setInterval to update state
  // This is a static render for server-side demo, client component needed for real tick
  return (
    <div className="hidden md:flex gap-4 p-4 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10">
       <CountdownUnit value="02" label="Days" />
       <CountdownUnit value="14" label="Hours" />
       <CountdownUnit value="45" label="Mins" />
    </div>
  );
}

function CountdownUnit({ value, label }: { value: string, label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[60px]">
      <span className="text-2xl font-bold text-white font-mono">{value}</span>
      <span className="text-[10px] uppercase tracking-wider text-gray-300">{label}</span>
    </div>
  );
}