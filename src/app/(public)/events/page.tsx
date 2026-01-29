'use client';

import { EventCatalog } from '@/features/events/components/event-catalog';

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Discover Events</h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Find and book tickets to the best events happening around you. 
            From concerts to conferences, we&apos;ve got you covered.
          </p>
        </div>
      </div>

      {/* Event Catalog */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <EventCatalog />
      </div>
    </div>
  );
}
