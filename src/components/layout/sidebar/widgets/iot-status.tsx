'use client';

import React from 'react';
import clsx from 'clsx';
import { WidgetProps } from '../types';

// Organizer Context - use Context directly to avoid hook rules violation
import { OrganizerContext } from '@/features/organizer/organizer-context';

/**
 * IoT Status Widget
 * Displays IoT device status and crowd capacity for organizers
 * Uses OrganizerContext for real data
 * Returns null if OrganizerProvider is not available
 */
export function IoTStatusWidget({ isCollapsed }: WidgetProps) {
  // Use context directly (not hook) to safely check availability
  const context = React.useContext(OrganizerContext);

  // If no context or collapsed, don't render
  if (!context) return null;
  if (isCollapsed) return null;

  const { devices, liveMetrics: metrics } = context;

  if (isCollapsed) return null;

  // Get status color based on device status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'offline': 
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Calculate crowd capacity percentage
  // Using liveMetrics from context if available
  const crowdCapacity = metrics.currentOccupancy > 0 
    ? Math.min(100, Math.round(metrics.currentOccupancy / 100 * 100)) // Adjust based on actual capacity
    : 0;

  // Show only the first 3 devices (gate scanners prioritized)
  const displayDevices = devices
    .filter(d => d.type === 'gate_scanner' || d.type === 'crowd_sensor')
    .slice(0, 3);

  // Use fallback data if no devices
  const hasDevices = displayDevices.length > 0;

  return (
    <div className="p-4 border-t border-[var(--border-primary)] space-y-3">
      <p className="text-xs font-semibold text-[var(--text-muted)] uppercase">
        IoT Status
      </p>

      <div className="space-y-2">
        {hasDevices ? (
          displayDevices.map((device) => (
            <div key={device.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className={clsx('w-2 h-2 rounded-full', getStatusColor(device.status))} />
                <span className="text-[var(--text-primary)] truncate">{device.name}</span>
              </div>
              <span className="text-xs text-[var(--text-muted)] capitalize">{device.status}</span>
            </div>
          ))
        ) : (
          // Fallback placeholder
          <div className="text-xs text-[var(--text-muted)] text-center py-2">
            No devices configured
          </div>
        )}
      </div>

      {/* Crowd Capacity */}
      <div className="pt-3 border-t border-[var(--border-primary)]">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-[var(--text-muted)]">Crowd Capacity</span>
          <span className="font-bold text-[var(--primary)]">{crowdCapacity}%</span>
        </div>
        <div className="w-full h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
          <div
            className={clsx(
              'h-full rounded-full transition-all duration-500',
              crowdCapacity > 90 ? 'bg-red-500' : crowdCapacity > 75 ? 'bg-yellow-500' : 'bg-green-500'
            )}
            style={{ width: `${crowdCapacity}%` }}
          />
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        <div className="text-center p-2 bg-[var(--bg-tertiary)] rounded-lg">
          <p className="text-lg font-bold text-[var(--text-primary)]">{metrics.totalCheckIns}</p>
          <p className="text-[10px] text-[var(--text-muted)]">Check-ins</p>
        </div>
        <div className="text-center p-2 bg-[var(--bg-tertiary)] rounded-lg">
          <p className="text-lg font-bold text-[var(--text-primary)]">{metrics.activeAlerts}</p>
          <p className="text-[10px] text-[var(--text-muted)]">Alerts</p>
        </div>
      </div>
    </div>
  );
}

export default IoTStatusWidget;
