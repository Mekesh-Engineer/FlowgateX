'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import { WidgetProps } from '../types';

// MUI Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Organizer Context - use Context directly to avoid hook rules violation
import { OrganizerContext } from '@/features/organizer/organizer-context';

/**
 * Event Switcher Widget
 * Allows organizers to switch between their active events
 * Uses OrganizerContext for shared state
 * Returns null if OrganizerProvider is not available
 */
export function EventSwitcher({ isCollapsed }: WidgetProps) {
  // Use context directly (not hook) to safely check availability
  const context = React.useContext(OrganizerContext);
  const [showDropdown, setShowDropdown] = useState(false);

  // If no context or collapsed, don't render
  if (!context) return null;
  if (isCollapsed) return null;

  const { selectEvent, selectedEventId, events, isLoading } = context;

  if (isCollapsed) return null;

  // Get selected event name
  const selectedEvent = events.find(e => e.id === selectedEventId);
  const displayName = selectedEvent?.name || 'Select an Event';

  // Filter to show only active/ongoing events
  const activeEvents = events.filter(e => 
    e.status === 'published' || e.status === 'ongoing'
  );

  const handleSelectEvent = (eventId: string) => {
    selectEvent(eventId);
    setShowDropdown(false);
  };

  return (
    <div className="p-4 border-b border-[var(--border-primary)]">
      <p className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">
        Active Event
      </p>
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={isLoading || activeEvents.length === 0}
          className={clsx(
            "w-full flex items-center justify-between px-3 py-2 bg-[var(--bg-tertiary)] rounded-lg transition-colors",
            isLoading || activeEvents.length === 0 
              ? "opacity-50 cursor-not-allowed" 
              : "hover:bg-[var(--bg-hover)]"
          )}
        >
          <span className="text-sm font-medium truncate">
            {isLoading ? 'Loading...' : displayName}
          </span>
          <ExpandMoreIcon 
            sx={{ fontSize: 18 }}
            className={clsx('transition-transform', showDropdown && 'rotate-180')} 
          />
        </button>

        {showDropdown && activeEvents.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
            {activeEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => handleSelectEvent(event.id)}
                className={clsx(
                  "w-full text-left px-3 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg",
                  selectedEventId === event.id 
                    ? "bg-[var(--primary)]/10 text-[var(--primary)]" 
                    : "hover:bg-[var(--bg-hover)]"
                )}
              >
                <span className="block truncate font-medium">{event.name}</span>
                <span className="text-xs text-[var(--text-muted)] capitalize">
                  {event.status} • {event.ticketsSold}/{event.totalCapacity} sold
                </span>
              </button>
            ))}
          </div>
        )}

        {activeEvents.length === 0 && !isLoading && (
          <p className="mt-2 text-xs text-[var(--text-muted)] text-center">
            No active events found
          </p>
        )}
      </div>
    </div>
  );
}

export default EventSwitcher;
