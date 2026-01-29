// src/app/dashboard/user/events/page.tsx
import { Metadata } from 'next';
import { EventCatalog } from '@/features/events/components/event-catalog';

export const metadata: Metadata = {
  title: 'Explore Events | FlowGate',
  description: 'Discover upcoming concerts, workshops, and sports events near you.',
};

export default function UserEventsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Page Header */}
      <div className="bg-[var(--bg-card)] border-b border-[var(--border-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            Explore Events
          </h1>
          <p className="text-[var(--text-secondary)]">
            Discover the best events happening around you. Book tickets securely with FlowGate.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EventCatalog />
      </main>
    </div>
  );
}