/**
 * Organizer Feature Module
 * 
 * This module provides all the infrastructure for the organizer dashboard:
 * - Context provider for shared state
 * - Data hooks with caching
 * - Real-time service for live updates
 * - Type definitions
 * 
 * Usage:
 * ```tsx
 * import { 
 *   useOrganizer, 
 *   useOrganizerEventsData,
 *   useRealTimeEvent 
 * } from '@/features/organizer';
 * ```
 */

// Types
export * from './organizer.types';

// Context and Provider
export { 
  OrganizerProvider,
  useOrganizer,
  useSelectedEvent,
  useOrganizerEvents,
  useLiveMetrics,
  useCrowdData,
} from './organizer-context';

// Data Hooks
export {
  useOrganizerEventsData,
  useEventData,
  useParticipantsData,
  useDevicesData,
  useAccessLogs,
  useCrowdMonitoring,
  useAnalyticsData,
  useRevenueData,
  useMarketingData,
  invalidateOrganizerCache,
} from './hooks/use-organizer-data';

// Real-time Service
export {
  getRealTimeService,
  useRealTimeConnection,
  useRealTimeEvent,
  useCheckInUpdates,
  useCrowdUpdates,
  useDeviceStatusUpdates,
  useAlertUpdates,
} from './realtime.service';

export type { ConnectionStatus, RealTimeConfig } from './realtime.service';
