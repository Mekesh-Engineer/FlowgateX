'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Event } from '@/features/events/event.types';

interface EventCardProps {
  event: Partial<Event> & { id: string; title: string };
  className?: string;
}

export function EventCard({ event, className }: EventCardProps) {
  const { id, title, date, location, image, price, category, isFeatured } = event;
  
  // Format date if it exists
  const formattedDate = date 
    ? typeof date === 'string' 
      ? date 
      : new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  // Format location string
  const locationStr = typeof location === 'string' 
    ? location 
    : location?.city 
      ? `${location.venue ? location.venue + ', ' : ''}${location.city}` 
      : '';

  return (
    <Link 
      href={`/events/${id}`}
      className={cn(
        "group relative block bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[var(--brand-primary)]/10 hover:border-[var(--brand-primary)]/30",
        className
      )}
    >
      {/* Image Section */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--bg-secondary)]">
        {image ? (
          <Image 
            src={image} 
            alt={title} 
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110" 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-icons-outlined text-4xl text-[var(--text-tertiary)]">image</span>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)]/90 via-transparent to-transparent opacity-80" />
        
        {/* Category Badge */}
        {category && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[var(--brand-primary)] text-white shadow-lg">
              {category}
            </span>
          </div>
        )}
        
        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-amber-500 text-white shadow-lg flex items-center gap-1">
              <span className="material-icons-outlined text-xs">star</span>
              Featured
            </span>
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--brand-primary)] transition-colors">
          {title}
        </h3>
        
        {formattedDate && (
          <div className="flex items-center gap-2 mt-2 text-sm text-[var(--text-secondary)]">
            <span className="material-icons-outlined text-base text-[var(--brand-primary)]">calendar_today</span>
            <span>{formattedDate}</span>
          </div>
        )}
        
        {locationStr && (
          <div className="flex items-center gap-2 mt-1 text-sm text-[var(--text-secondary)]">
            <span className="material-icons-outlined text-base text-[var(--brand-primary)]">location_on</span>
            <span className="line-clamp-1">{locationStr}</span>
          </div>
        )}
        
        {/* Price & CTA */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-secondary)]">
          <div>
            {price !== undefined && (
              <span className="text-lg font-bold text-[var(--text-primary)]">
                {price === 0 ? (
                  <span className="text-emerald-500">Free</span>
                ) : (
                  <>₹{price}</>
                )}
              </span>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--brand-primary)] group-hover:gap-2 transition-all">
            View Details
            <span className="material-icons-outlined text-base">arrow_forward</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
