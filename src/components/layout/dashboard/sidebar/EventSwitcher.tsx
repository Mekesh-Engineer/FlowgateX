// =============================================================================
// EVENT SWITCHER — Organizer-only dropdown to switch between managed events
// =============================================================================

import { useState, useRef, useEffect } from 'react';

interface ManagedEvent {
  id: string;
  title: string;
  date: string;
  status: 'draft' | 'published' | 'completed';
}

interface EventSwitcherProps {
  isCollapsed: boolean;
}

// Mock data — will be replaced by real API data
const MOCK_EVENTS: ManagedEvent[] = [
  { id: '1', title: 'Tech Summit 2026', date: 'Mar 15', status: 'published' },
  { id: '2', title: 'Music Festival', date: 'Apr 22', status: 'draft' },
  { id: '3', title: 'Dev Conference', date: 'May 10', status: 'published' },
];

const STATUS_DOT: Record<ManagedEvent['status'], string> = {
  published: 'bg-green-500',
  draft: 'bg-amber-500',
  completed: 'bg-gray-400',
};

export default function EventSwitcher({ isCollapsed }: EventSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ManagedEvent>(MOCK_EVENTS[0]);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (isCollapsed) {
    return (
      <div className="flex justify-center py-1.5">
        <div className="size-7 rounded-md bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <svg className="size-3.5 text-primary-600 dark:text-primary-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative mb-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-x-2 py-2 px-2.5 text-sm rounded-lg bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-750 focus:outline-hidden transition-colors"
      >
        <svg className="shrink-0 size-4 text-primary-600 dark:text-primary-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
        <span className="truncate flex-1 text-start">{selected.title}</span>
        <svg className={`shrink-0 size-3.5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </button>

      {/* Dropdown */}
      <div className={`absolute top-full left-0 mt-1 w-full z-20 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-xl transition-all duration-200 origin-top ${open ? 'opacity-100 visible scale-100 pointer-events-auto' : 'opacity-0 invisible scale-95 pointer-events-none'}`}>
        <div className="p-1 max-h-48 overflow-y-auto">
          <span className="block pt-1 pb-1.5 ps-2.5 text-[11px] font-medium uppercase text-gray-500 dark:text-neutral-400">
            My Events ({MOCK_EVENTS.length})
          </span>
          {MOCK_EVENTS.map((evt) => (
            <button
              key={evt.id}
              type="button"
              className={`w-full flex items-center gap-x-2.5 py-2 px-2.5 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-neutral-800 focus:outline-hidden ${selected.id === evt.id ? 'bg-gray-100 dark:bg-neutral-800 font-medium' : ''}`}
              onClick={() => { setSelected(evt); setOpen(false); }}
            >
              <span className={`shrink-0 size-2 rounded-full ${STATUS_DOT[evt.status]}`} />
              <span className="truncate flex-1 text-start text-gray-800 dark:text-neutral-200">{evt.title}</span>
              <span className="text-[11px] text-gray-400 dark:text-neutral-500">{evt.date}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
