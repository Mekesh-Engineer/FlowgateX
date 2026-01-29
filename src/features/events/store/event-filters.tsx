// src/features/events/store/event-filters.tsx
'use client';

import { useEventCatalogStore } from '@/features/events/store/event-catalog.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { EVENT_CATEGORIES } from '@/features/events/event.constants';

export function EventFilters() {
  const { filters, setFilter, resetFilters } = useEventCatalogStore();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-[var(--text-primary)]">Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetFilters}
          className="text-sm text-[var(--brand-primary)] hover:text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/10"
        >
          Reset
        </Button>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-[var(--text-secondary)]">Categories</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('category', 'all')}
            className={cn(
              "px-3 py-1.5 text-sm rounded-full transition-all border",
              filters.category === 'all'
                ? "bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]"
                : "bg-transparent text-[var(--text-secondary)] border-[var(--border-primary)] hover:border-[var(--brand-primary)]"
            )}
          >
            All
          </button>
          {EVENT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter('category', cat.id)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-full transition-all border flex items-center gap-2",
                filters.category === cat.id
                  ? "bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]"
                  : "bg-transparent text-[var(--text-secondary)] border-[var(--border-primary)] hover:border-[var(--brand-primary)]"
              )}
            >
              <span className="material-icons-outlined text-[16px]">{cat.icon}</span>
              {cat.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-[var(--text-secondary)]">Price Range</h4>
          <span className="text-xs text-[var(--text-tertiary)]">
            ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}+
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="10000"
          step="500"
          value={filters.priceRange[1]}
          onChange={(e) => setFilter('priceRange', [0, parseInt(e.target.value)])}
          className="w-full h-2 bg-[var(--bg-secondary)] rounded-lg appearance-none cursor-pointer accent-[var(--brand-primary)]"
        />
      </div>

      {/* Availability Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="availability"
          checked={filters.onlyAvailable}
          onChange={(e) => setFilter('onlyAvailable', e.target.checked)}
          className="w-4 h-4 rounded border-[var(--border-primary)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] bg-[var(--bg-card)]"
        />
        <label htmlFor="availability" className="text-sm text-[var(--text-primary)] cursor-pointer select-none">
          Show only available seats
        </label>
      </div>
    </div>
  );
}