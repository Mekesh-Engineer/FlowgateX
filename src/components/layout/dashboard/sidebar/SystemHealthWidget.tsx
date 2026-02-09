// =============================================================================
// SYSTEM HEALTH WIDGET — Admin-only real-time system metrics
// =============================================================================
// Displays uptime percentage and payment issue count at a glance.
// =============================================================================

interface SystemHealthWidgetProps {
  isCollapsed: boolean;
}

// Mock data — will be replaced by real API/WebSocket data
const SYSTEM_METRICS = {
  uptime: 99.7,
  paymentIssues: 2,
  activeUsers: 1247,
  serverLoad: 34,
};

export default function SystemHealthWidget({ isCollapsed }: SystemHealthWidgetProps) {
  const uptimeColor = SYSTEM_METRICS.uptime >= 99 ? 'text-green-500' : SYSTEM_METRICS.uptime >= 95 ? 'text-amber-500' : 'text-red-500';
  const uptimeBg = SYSTEM_METRICS.uptime >= 99 ? 'bg-green-500' : SYSTEM_METRICS.uptime >= 95 ? 'bg-amber-500' : 'bg-red-500';

  if (isCollapsed) {
    return (
      <div className="flex justify-center py-1.5">
        <div className="relative size-7 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <svg className="size-3.5 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          {SYSTEM_METRICS.paymentIssues > 0 && (
            <span className="absolute -top-0.5 -end-0.5 size-2.5 rounded-full bg-red-500 ring-2 ring-gray-100 dark:ring-neutral-900" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-2 p-2.5 rounded-lg bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-medium uppercase text-gray-500 dark:text-neutral-400">System Health</span>
        <span className={`flex items-center gap-x-1 text-[11px] font-semibold ${uptimeColor}`}>
          <span className={`size-1.5 rounded-full ${uptimeBg}`} />
          {SYSTEM_METRICS.uptime}%
        </span>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-1.5">
        {/* Uptime */}
        <div className="py-1.5 px-2 rounded-md bg-green-50 dark:bg-green-900/20">
          <p className="text-[10px] text-gray-500 dark:text-neutral-400">Uptime</p>
          <p className="text-sm font-semibold text-green-600 dark:text-green-400">{SYSTEM_METRICS.uptime}%</p>
        </div>
        {/* Payment Issues */}
        <div className="py-1.5 px-2 rounded-md bg-red-50 dark:bg-red-900/20">
          <p className="text-[10px] text-gray-500 dark:text-neutral-400">Pay Issues</p>
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">{SYSTEM_METRICS.paymentIssues}</p>
        </div>
        {/* Active Users */}
        <div className="py-1.5 px-2 rounded-md bg-primary-50 dark:bg-primary-900/20">
          <p className="text-[10px] text-gray-500 dark:text-neutral-400">Active Users</p>
          <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">{SYSTEM_METRICS.activeUsers.toLocaleString()}</p>
        </div>
        {/* Server Load */}
        <div className="py-1.5 px-2 rounded-md bg-amber-50 dark:bg-amber-900/20">
          <p className="text-[10px] text-gray-500 dark:text-neutral-400">Server Load</p>
          <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">{SYSTEM_METRICS.serverLoad}%</p>
        </div>
      </div>
    </div>
  );
}
