// src/features/events/components/event-catalog.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Event } from '@/features/events/event.types';
import { useEventCatalogStore } from '@/features/events/store/event-catalog.store';
import { CatalogEventCard } from './catalog-event-card';
import { EventFilters } from '@/features/events/store/event-filters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

// Helper to convert API response to Event type
const convertApiEventToEvent = (data: any): Event => {
  const tickets = data.tickets || [];
  const totalSold = tickets.reduce((sum: number, t: any) => sum + (t.sold || 0), 0);
  const totalCapacity = data.venue?.capacity || 0;
  const prices = tickets.map((t: any) => t.price) || [0];
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

  return {
    id: data.eventId || data.id || '',
    title: data.basicInfo?.title || data.title || 'Untitled Event',
    description: data.basicInfo?.description || data.description || '',
    date: new Date(`${data.schedule?.startDate || '2026-01-01'}T${data.schedule?.startTime || '00:00'}`),
    time: data.schedule?.startTime || '00:00',
    endDate: new Date(`${data.schedule?.endDate || data.schedule?.startDate || '2026-01-01'}T${data.schedule?.endTime || '23:59'}`),
    endTime: data.schedule?.endTime || '23:59',
    location: {
      venue: data.venue?.name || 'TBA',
      address: data.venue?.address || '',
      city: data.venue?.city || '',
      coordinates: data.venue?.coordinates,
    },
    price: minPrice,
    currency: 'INR',
    capacity: totalCapacity,
    attendees: totalSold,
    available: totalCapacity - totalSold,
    category: data.basicInfo?.category || data.category || 'other',
    tags: data.basicInfo?.tags || [],
    image: data.basicInfo?.bannerImage || undefined,
    video: data.basicInfo?.videoUrl || undefined,
    organizer: {
      id: data.organizerId || '',
      name: data.organizerEmail?.split('@')[0] || 'Organizer',
      email: data.organizerEmail,
    },
    status: data.status || 'published',
    isFeatured: false,
    isTrending: (data.analytics?.views || 0) > 100,
    rating: 4.5,
    reviews: 0,
    ticketTiers: tickets.map((ticket: any) => ({
      id: ticket.id || Math.random().toString(36).substr(2, 9),
      name: ticket.name,
      price: ticket.price,
      quantity: ticket.quantity,
      available: ticket.quantity - (ticket.sold || 0),
      sold: ticket.sold || 0,
    })),
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
  };
};

export function EventCatalog() {
  const { viewMode, setViewMode, filters, setFilter } = useEventCatalogStore();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Fetch events from API on mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch from API which uses Firebase Admin SDK
        const response = await fetch('/api/events');
        const data = await response.json();
        
        console.log('📊 API Response:', data);
        
        if (data.events && Array.isArray(data.events)) {
          const convertedEvents = data.events.map(convertApiEventToEvent);
          console.log('📊 Converted events:', convertedEvents.length);
          setEvents(convertedEvents);
        } else {
          setEvents([]);
        }
        
      } catch (err) {
        console.error('Error loading events:', err);
        setError('Failed to load events. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Filter Logic
  const filteredEvents = events.filter(event => {
    // 1. Search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const titleMatch = event.title.toLowerCase().includes(searchLower);
      const locationMatch = typeof event.location === 'string' 
        ? event.location.toLowerCase().includes(searchLower)
        : event.location.city?.toLowerCase().includes(searchLower);
      
      if (!titleMatch && !locationMatch) {
        return false;
      }
    }
    
    // 2. Category
    if (filters.category !== 'all' && event.category !== filters.category) {
      return false;
    }
    
    // 3. Price
    if (event.price < filters.priceRange[0] || event.price > filters.priceRange[1]) {
      return false;
    }
    
    // 4. Availability
    if (filters.onlyAvailable && (event.available ?? 0) <= 0) {
      return false;
    }

    return true;
  });

  // Voice Search Simulation
  const handleVoiceSearch = () => {
    // In a real app, use Web Speech API
    alert("Voice search listening... (Simulation)");
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--brand-primary)] mb-4"></div>
        <p className="text-[var(--text-secondary)]">Loading events...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <span className="material-icons-outlined text-4xl text-red-500">error_outline</span>
        </div>
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{error}</h3>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-100px)]">
      
      {/* Sidebar Filters - Desktop */}
      <aside className="hidden lg:block w-72 shrink-0 space-y-6">
         <div className="sticky top-6 p-6 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-sm">
            <EventFilters />
         </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between gap-4">
           <Button variant="outline" onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)} className="flex-1">
             <span className="material-icons-outlined mr-2">filter_list</span> Filters
           </Button>
           <div className="flex border rounded-md overflow-hidden bg-[var(--bg-card)]">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-2 hover:bg-[var(--bg-secondary)]", viewMode === 'grid' && "bg-[var(--bg-secondary)] text-[var(--brand-primary)]")}
            >
              <span className="material-icons-outlined">grid_view</span>
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-2 hover:bg-[var(--bg-secondary)]", viewMode === 'list' && "bg-[var(--bg-secondary)] text-[var(--brand-primary)]")}
            >
              <span className="material-icons-outlined">view_list</span>
            </button>
          </div>
        </div>

        {/* Mobile Filters Dropdown */}
        <AnimatePresence>
          {isMobileFiltersOpen && !isDesktop && (
            <motion.div 
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: 'auto', opacity: 1 }}
               exit={{ height: 0, opacity: 0 }}
               className="overflow-hidden bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-4 lg:hidden"
            >
               <EventFilters />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search & Sort Bar */}
        <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-primary)] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="relative flex-1 w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] material-icons-outlined">search</span>
              <Input 
                placeholder="Search events, venues, or locations..." 
                className="pl-10 pr-10"
                value={filters.search}
                onChange={(e) => setFilter('search', e.target.value)}
              />
              <button onClick={handleVoiceSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--brand-primary)]">
                <span className="material-icons-outlined">mic</span>
              </button>
           </div>
           
           <div className="flex items-center gap-3 w-full md:w-auto">
             <select className="h-10 px-3 rounded-md border border-[var(--border-primary)] bg-[var(--bg-card)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]">
                <option>Popularity</option>
                <option>Date: Soonest</option>
                <option>Price: Low to High</option>
                <option>Rating: High to Low</option>
             </select>
             
             {/* Desktop View Toggles */}
             <div className="hidden lg:flex border border-[var(--border-primary)] rounded-md overflow-hidden bg-[var(--bg-card)]">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={cn("p-2 hover:bg-[var(--bg-secondary)] transition-colors", viewMode === 'grid' && "bg-[var(--bg-secondary)] text-[var(--brand-primary)]")}
                  title="Grid View"
                >
                  <span className="material-icons-outlined text-xl">grid_view</span>
                </button>
                <div className="w-[1px] bg-[var(--border-primary)]"></div>
                <button 
                  onClick={() => setViewMode('list')}
                  className={cn("p-2 hover:bg-[var(--bg-secondary)] transition-colors", viewMode === 'list' && "bg-[var(--bg-secondary)] text-[var(--brand-primary)]")}
                  title="List View"
                >
                  <span className="material-icons-outlined text-xl">view_list</span>
                </button>
              </div>
           </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between px-2">
           <p className="text-sm text-[var(--text-secondary)]">
             Showing <span className="font-bold text-[var(--text-primary)]">{filteredEvents.length}</span> events
           </p>
        </div>

        {/* Events Grid/List */}
        {filteredEvents.length > 0 ? (
          <div className={cn(
            "grid gap-6",
            viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
          )}>
            {filteredEvents.map((event) => (
              <CatalogEventCard key={event.id} event={event} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <div className="w-24 h-24 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mb-4">
               <span className="material-icons-outlined text-4xl text-[var(--text-tertiary)]">event_busy</span>
             </div>
             <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No events found</h3>
             <p className="text-[var(--text-secondary)] max-w-md mx-auto mb-6">
               We couldn&apos;t find any events matching your filters. Try adjusting your search or categories.
             </p>
             <Button onClick={() => useEventCatalogStore.getState().resetFilters()}>
               Clear All Filters
             </Button>
          </div>
        )}
      </div>
    </div>
  );
}