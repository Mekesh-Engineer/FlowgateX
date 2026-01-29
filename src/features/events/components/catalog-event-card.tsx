// src/features/events/components/catalog-event-card.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Event } from '@/features/events/event.types';
import type { ViewMode } from '@/features/events/store/event-catalog.store';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface CatalogEventCardProps {
  event: Event;
  viewMode: ViewMode;
}

export function CatalogEventCard({ event, viewMode }: CatalogEventCardProps) {
  const { 
    id, title, date, location, image, price, category, 
    capacity, attendees = 0, venue 
  } = event;

  const percentageSold = Math.min(100, Math.round((attendees / capacity) * 100));
  const seatsLeft = capacity - attendees;
  
  // Urgency Color Logic
  const urgencyColor = 
    percentageSold >= 90 ? 'bg-red-500' : 
    percentageSold >= 70 ? 'bg-amber-500' : 
    'bg-emerald-500';

  const urgencyText = 
    percentageSold >= 90 ? 'text-red-500' : 
    percentageSold >= 70 ? 'text-amber-500' : 
    'text-emerald-500';

  // Google Calendar Link
  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=Booked+via+FlowGate&location=${encodeURIComponent(typeof location === 'string' ? location : location.city)}`;

  // Formatting
  const formattedDate = new Date(date).toLocaleDateString('en-US', { 
    month: 'short', day: 'numeric', weekday: 'short' 
  });
  const formattedTime = new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit'
  });

  if (viewMode === 'list') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative flex flex-col md:flex-row bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
      >
        {/* Image - Left Side */}
        <div className="md:w-64 relative h-48 md:h-auto shrink-0 overflow-hidden">
          {image ? (
            <Image src={image} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="material-icons-outlined">image</span>
            </div>
          )}
          <div className="absolute top-2 left-2">
             <span className="px-2 py-1 text-xs font-bold uppercase rounded bg-black/60 text-white backdrop-blur-sm">
                {category}
             </span>
          </div>
        </div>

        {/* Content - Right Side */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start gap-4">
            <div>
               <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1 group-hover:text-[var(--brand-primary)] transition-colors">
                 <Link href={`/dashboard/user/events/${id}`}>{title}</Link>
               </h3>
               <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mb-2">
                 <div className="flex items-center gap-1">
                   <span className="material-icons-outlined text-base">calendar_today</span>
                   {formattedDate} • {formattedTime}
                 </div>
                 <div className="flex items-center gap-1">
                   <span className="material-icons-outlined text-base">location_on</span>
                   {typeof location === 'string' ? location : location.city}
                 </div>
               </div>
            </div>
            {/* Price Tag */}
            <div className="text-right">
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {price === 0 ? <span className="text-emerald-500">Free</span> : `₹${price}`}
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between mt-4">
            {/* Capacity Bar */}
            <div className="w-1/3">
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className={urgencyText}>
                  {seatsLeft > 0 ? `${seatsLeft} seats left` : 'Sold Out'}
                </span>
                <span className="text-[var(--text-tertiary)]">{percentageSold}% full</span>
              </div>
              <div className="h-2 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all duration-500", urgencyColor)} 
                  style={{ width: `${percentageSold}%` }} 
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
               <a href={googleCalendarUrl} target="_blank" rel="noopener noreferrer" title="Add to Calendar">
                 <Button variant="outline" size="sm" className="h-9 w-9 p-0 text-[var(--text-secondary)] hover:text-[var(--brand-primary)]">
                    <span className="material-icons-outlined text-lg">event</span>
                 </Button>
               </a>
               <Button variant="outline" size="sm" className="h-9 w-9 p-0 text-rose-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200">
                  <span className="material-icons-outlined text-lg">favorite_border</span>
               </Button>
               <Link href={`/dashboard/user/events/${id}`}>
                 <Button className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/90 text-white">
                    Book Now
                 </Button>
               </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative flex flex-col bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--bg-secondary)]">
        {image && (
          <Image 
            src={image} 
            alt={title} 
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        )}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2 py-1 text-xs font-bold uppercase rounded bg-white/90 text-black shadow-sm backdrop-blur-sm">
            {category}
          </span>
        </div>
        <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-colors">
          <span className="material-icons-outlined text-lg">favorite_border</span>
        </button>
      </div>

      <div className="flex-1 p-4 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-[var(--text-primary)] line-clamp-1 flex-1 pr-2" title={title}>
            {title}
          </h3>
          <span className="font-bold text-[var(--brand-primary)] shrink-0">
             {price === 0 ? 'Free' : `₹${price}`}
          </span>
        </div>

        <div className="space-y-1 mb-4 flex-1">
           <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
             <span className="material-icons-outlined text-sm text-[var(--brand-primary)]">location_on</span>
             <span className="truncate">{typeof location === 'string' ? location : location.city}</span>
           </div>
           <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
             <span className="material-icons-outlined text-sm text-[var(--brand-primary)]">schedule</span>
             <span>{formattedDate}</span>
           </div>
        </div>

        {/* Capacity */}
        <div className="mb-4">
           <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider mb-1 text-[var(--text-tertiary)]">
             <span>Availability</span>
             <span className={urgencyText}>{Math.floor(percentageSold)}%</span>
           </div>
           <div className="h-1.5 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden">
              <div 
                className={cn("h-full rounded-full", urgencyColor)} 
                style={{ width: `${percentageSold}%` }} 
              />
           </div>
        </div>

        <Link href={`/dashboard/user/events/${id}`} className="w-full">
          <Button variant="outline" className="w-full border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white group-hover:bg-[var(--brand-primary)] group-hover:text-white transition-all">
            View Details
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}