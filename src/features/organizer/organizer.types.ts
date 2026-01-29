/**
 * Organizer Feature Types
 * Shared type definitions for organizer dashboard
 */

// ============================================================================
// Event Types
// ============================================================================

export type EventStatus = 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';

export interface OrganizerEvent {
  id: string;
  name: string;
  slug: string;
  description?: string;
  startDate: string;
  endDate: string;
  venue: {
    name: string;
    address: string;
    city: string;
    capacity: number;
  };
  status: EventStatus;
  ticketsSold: number;
  totalCapacity: number;
  revenue: number;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventSummary {
  id: string;
  name: string;
  status: EventStatus;
  ticketsSold: number;
  totalCapacity: number;
}

// ============================================================================
// Participant Types
// ============================================================================

export type CheckInStatus = 'not_checked_in' | 'checked_in' | 'checked_out';

export interface Participant {
  id: string;
  eventId: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  ticketType: string;
  ticketId: string;
  checkInStatus: CheckInStatus;
  checkInTime?: string;
  checkOutTime?: string;
  gate?: string;
  purchaseDate: string;
}

// ============================================================================
// IoT Device Types
// ============================================================================

export type DeviceStatus = 'online' | 'offline' | 'warning' | 'error';
export type DeviceType = 'gate_scanner' | 'crowd_sensor' | 'display' | 'access_point';

export interface IoTDevice {
  id: string;
  eventId?: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  batteryLevel?: number;
  lastPing: string;
  location?: string;
  firmware?: string;
  scansToday?: number;
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface AnalyticsMetrics {
  totalEvents: number;
  activeEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  totalParticipants: number;
  averageRating: number;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  label?: string;
}

export interface RevenueData {
  period: string;
  revenue: number;
  tickets: number;
  refunds: number;
}

// ============================================================================
// Crowd Monitoring Types
// ============================================================================

export type ZoneStatus = 'normal' | 'warning' | 'critical';

export interface CrowdZone {
  id: string;
  name: string;
  currentOccupancy: number;
  capacity: number;
  status: ZoneStatus;
  lastUpdated: string;
}

export interface CrowdAlert {
  id: string;
  eventId: string;
  zoneId?: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface LiveFlowData {
  time: string;
  entrances: number;
  exits: number;
}

// ============================================================================
// Access Log Types
// ============================================================================

export type ScanResult = 'success' | 'failed' | 'duplicate' | 'invalid';

export interface AccessLog {
  id: string;
  eventId: string;
  timestamp: string;
  participantId?: string;
  participantName: string;
  ticketId: string;
  gate: string;
  result: ScanResult;
  reason?: string;
  deviceId?: string;
}

// ============================================================================
// Marketing Types
// ============================================================================

export interface PromoCode {
  id: string;
  code: string;
  eventId?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  eventId?: string;
  type: 'email' | 'sms' | 'push';
  status: 'draft' | 'scheduled' | 'sent' | 'completed';
  sentCount: number;
  openRate: number;
  clickRate: number;
  scheduledAt?: string;
  sentAt?: string;
}

// ============================================================================
// Real-time Event Types
// ============================================================================

export type RealTimeEventType = 
  | 'check_in'
  | 'check_out'
  | 'crowd_update'
  | 'device_status'
  | 'alert'
  | 'ticket_sale'
  | 'scan_result';

export interface RealTimeEvent<T = unknown> {
  type: RealTimeEventType;
  eventId?: string;
  timestamp: string;
  data: T;
}

// ============================================================================
// Context State Types
// ============================================================================

export interface OrganizerState {
  // Current selection
  selectedEventId: string | null;
  
  // Data caches
  events: OrganizerEvent[];
  participants: Map<string, Participant[]>;
  devices: IoTDevice[];
  
  // Real-time data
  liveMetrics: {
    currentOccupancy: number;
    totalCheckIns: number;
    totalCheckOuts: number;
    activeAlerts: number;
  };
  crowdZones: CrowdZone[];
  recentAlerts: CrowdAlert[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export interface OrganizerContextType extends OrganizerState {
  // Actions
  selectEvent: (eventId: string | null) => void;
  refreshEvents: () => Promise<void>;
  refreshParticipants: (eventId: string) => Promise<void>;
  refreshDevices: () => Promise<void>;
  acknowledgeAlert: (alertId: string) => Promise<void>;
  
  // Real-time
  subscribeToEvent: (eventId: string) => void;
  unsubscribeFromEvent: (eventId: string) => void;
  
  // Computed
  getEventById: (id: string) => OrganizerEvent | undefined;
  getParticipantsForEvent: (eventId: string) => Participant[];
  getDevicesForEvent: (eventId: string) => IoTDevice[];
}
