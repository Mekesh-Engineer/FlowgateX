// =============================================================================
// STATS WIDGET — User/Attendee compact card with booking & event counts
// =============================================================================

interface StatsWidgetProps {
  isCollapsed: boolean;
}

// Mock data — will be replaced by real API data
const USER_STATS = {
  upcomingBookings: 3,
  savedEvents: 7,
};

export default function StatsWidget({ isCollapsed }: StatsWidgetProps) {
  if (isCollapsed) {
    return (
      <div className="flex justify-center py-1.5">
        <div className="relative size-7 rounded-md bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
          <svg className="size-3.5 text-purple-600 dark:text-purple-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>
          {USER_STATS.upcomingBookings > 0 && (
            <span className="absolute -top-0.5 -end-0.5 flex items-center justify-center size-3.5 rounded-full bg-purple-500 text-[8px] font-bold text-white ring-2 ring-gray-100 dark:ring-neutral-900">
              {USER_STATS.upcomingBookings}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-2 p-2.5 rounded-lg bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-xs">
      <span className="block mb-2 text-[11px] font-medium uppercase text-gray-500 dark:text-neutral-400">Quick Stats</span>

      <div className="grid grid-cols-2 gap-1.5">
        {/* Upcoming Bookings */}
        <div className="py-1.5 px-2 rounded-md bg-purple-50 dark:bg-purple-900/20">
          <p className="text-[10px] text-gray-500 dark:text-neutral-400">Upcoming</p>
          <p className="text-lg font-bold text-purple-600 dark:text-purple-400 leading-tight">{USER_STATS.upcomingBookings}</p>
          <p className="text-[10px] text-gray-400 dark:text-neutral-500">bookings</p>
        </div>
        {/* Saved Events */}
        <div className="py-1.5 px-2 rounded-md bg-pink-50 dark:bg-pink-900/20">
          <p className="text-[10px] text-gray-500 dark:text-neutral-400">Saved</p>
          <p className="text-lg font-bold text-pink-600 dark:text-pink-400 leading-tight">{USER_STATS.savedEvents}</p>
          <p className="text-[10px] text-gray-400 dark:text-neutral-500">events</p>
        </div>
      </div>
    </div>
  );
}
