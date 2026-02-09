// =============================================================================
// IOT STATUS WIDGET — Organizer-only live scanner & crowd metrics
// =============================================================================

interface IoTStatusWidgetProps {
  isCollapsed: boolean;
}

// Mock data — will be replaced by real IoT WebSocket data
const IOT_METRICS = {
  scannersOnline: 8,
  scannersTotal: 10,
  crowdCapacity: 72,
  crowdMax: 500,
  crowdCurrent: 360,
};

export default function IoTStatusWidget({ isCollapsed }: IoTStatusWidgetProps) {
  const scannerHealth = Math.round((IOT_METRICS.scannersOnline / IOT_METRICS.scannersTotal) * 100);
  const scannerColor = scannerHealth >= 80 ? 'text-green-500' : scannerHealth >= 50 ? 'text-amber-500' : 'text-red-500';
  const scannerBg = scannerHealth >= 80 ? 'bg-green-500' : scannerHealth >= 50 ? 'bg-amber-500' : 'bg-red-500';
  const crowdColor = IOT_METRICS.crowdCapacity >= 90 ? 'text-red-500' : IOT_METRICS.crowdCapacity >= 70 ? 'text-amber-500' : 'text-green-500';
  const crowdBg = IOT_METRICS.crowdCapacity >= 90 ? 'bg-red-500' : IOT_METRICS.crowdCapacity >= 70 ? 'bg-amber-500' : 'bg-green-500';

  if (isCollapsed) {
    return (
      <div className="flex justify-center py-1.5">
        <div className="relative size-7 rounded-md bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <svg className="size-3.5 text-primary-600 dark:text-primary-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"/><line x1="2" x2="2.01" y1="20" y2="20"/></svg>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-auto pt-3 mb-2">
      <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-xs">
        <span className="block mb-2 text-[11px] font-medium uppercase text-gray-500 dark:text-neutral-400">IoT Status</span>

        {/* Scanner Health */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600 dark:text-neutral-300">Scanners</span>
            <span className={`text-xs font-semibold ${scannerColor}`}>{IOT_METRICS.scannersOnline}/{IOT_METRICS.scannersTotal}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-neutral-700 overflow-hidden">
            <div className={`h-full rounded-full ${scannerBg} transition-all duration-500`} style={{ width: `${scannerHealth}%` }} />
          </div>
        </div>

        {/* Crowd Capacity */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600 dark:text-neutral-300">Crowd</span>
            <span className={`text-xs font-semibold ${crowdColor}`}>{IOT_METRICS.crowdCapacity}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-neutral-700 overflow-hidden">
            <div className={`h-full rounded-full ${crowdBg} transition-all duration-500`} style={{ width: `${IOT_METRICS.crowdCapacity}%` }} />
          </div>
          <p className="mt-0.5 text-[10px] text-gray-400 dark:text-neutral-500">{IOT_METRICS.crowdCurrent}/{IOT_METRICS.crowdMax} capacity</p>
        </div>
      </div>
    </div>
  );
}
