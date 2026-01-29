'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  OrganizerEvent, 
  Participant, 
  IoTDevice, 
  AccessLog, 
  CrowdZone,
  AnalyticsMetrics,
  RevenueData,
  PromoCode,
  Campaign
} from '../organizer.types';

// ============================================================================
// Cache Configuration
// ============================================================================

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class DataCache {
  private cache = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

const dataCache = new DataCache();

// ============================================================================
// Generic Fetch Hook
// ============================================================================

interface UseFetchOptions {
  cacheKey?: string;
  skipCache?: boolean;
  revalidateOnFocus?: boolean;
}

function useFetch<T>(
  url: string | null,
  options: UseFetchOptions = {}
) {
  const { cacheKey, skipCache = false, revalidateOnFocus = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!url) {
      setIsLoading(false);
      return;
    }

    // Check cache first
    if (!skipCache && !forceRefresh && cacheKey) {
      const cached = dataCache.get<T>(cacheKey);
      if (cached) {
        setData(cached);
        setIsLoading(false);
        return;
      }
    }

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
      
      if (cacheKey) {
        dataCache.set(cacheKey, result);
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError((err as Error).message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [url, cacheKey, skipCache]);

  // Initial fetch
  useEffect(() => {
    fetchData();
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchData]);

  // Revalidate on focus
  useEffect(() => {
    if (!revalidateOnFocus) return;

    const handleFocus = () => fetchData(true);
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchData, revalidateOnFocus]);

  const refetch = useCallback(() => fetchData(true), [fetchData]);

  return { data, isLoading, error, refetch };
}

// ============================================================================
// Organizer Events Hook
// ============================================================================

interface UseEventsResult {
  events: OrganizerEvent[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  createEvent: (data: Partial<OrganizerEvent>) => Promise<OrganizerEvent>;
  updateEvent: (id: string, data: Partial<OrganizerEvent>) => Promise<OrganizerEvent>;
  deleteEvent: (id: string) => Promise<void>;
}

export function useOrganizerEventsData(): UseEventsResult {
  const { data, isLoading, error, refetch } = useFetch<{ events: OrganizerEvent[] }>(
    '/api/organizer/events',
    { cacheKey: 'organizer-events' }
  );

  const createEvent = useCallback(async (eventData: Partial<OrganizerEvent>) => {
    const response = await fetch('/api/organizer/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) throw new Error('Failed to create event');
    
    const result = await response.json();
    dataCache.invalidate('organizer-events');
    refetch();
    return result.event;
  }, [refetch]);

  const updateEvent = useCallback(async (id: string, eventData: Partial<OrganizerEvent>) => {
    const response = await fetch(`/api/organizer/events/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) throw new Error('Failed to update event');
    
    const result = await response.json();
    dataCache.invalidate('organizer-events');
    dataCache.invalidate(`event-${id}`);
    refetch();
    return result.event;
  }, [refetch]);

  const deleteEvent = useCallback(async (id: string) => {
    const response = await fetch(`/api/organizer/events/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Failed to delete event');
    
    dataCache.invalidate('organizer-events');
    dataCache.invalidate(`event-${id}`);
    refetch();
  }, [refetch]);

  return {
    events: data?.events || [],
    isLoading,
    error,
    refetch,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}

// ============================================================================
// Single Event Hook
// ============================================================================

interface UseEventResult {
  event: OrganizerEvent | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useEventData(eventId: string | null): UseEventResult {
  const { data, isLoading, error, refetch } = useFetch<{ event: OrganizerEvent }>(
    eventId ? `/api/organizer/events/${eventId}` : null,
    { cacheKey: eventId ? `event-${eventId}` : undefined }
  );

  return {
    event: data?.event || null,
    isLoading,
    error,
    refetch,
  };
}

// ============================================================================
// Participants Hook
// ============================================================================

interface UseParticipantsResult {
  participants: Participant[];
  total: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  checkIn: (participantId: string, gate: string) => Promise<void>;
  checkOut: (participantId: string) => Promise<void>;
  bulkCheckIn: (participantIds: string[], gate: string) => Promise<void>;
}

export function useParticipantsData(eventId: string | null): UseParticipantsResult {
  const { data, isLoading, error, refetch } = useFetch<{ 
    participants: Participant[]; 
    total: number;
  }>(
    eventId ? `/api/organizer/events/${eventId}/participants` : null,
    { cacheKey: eventId ? `participants-${eventId}` : undefined }
  );

  const checkIn = useCallback(async (participantId: string, gate: string) => {
    if (!eventId) return;
    
    await fetch(`/api/organizer/events/${eventId}/participants/${participantId}/check-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gate }),
    });
    
    dataCache.invalidate(`participants-${eventId}`);
    refetch();
  }, [eventId, refetch]);

  const checkOut = useCallback(async (participantId: string) => {
    if (!eventId) return;
    
    await fetch(`/api/organizer/events/${eventId}/participants/${participantId}/check-out`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    
    dataCache.invalidate(`participants-${eventId}`);
    refetch();
  }, [eventId, refetch]);

  const bulkCheckIn = useCallback(async (participantIds: string[], gate: string) => {
    if (!eventId) return;
    
    await fetch(`/api/organizer/events/${eventId}/participants/bulk-check-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participantIds, gate }),
    });
    
    dataCache.invalidate(`participants-${eventId}`);
    refetch();
  }, [eventId, refetch]);

  return {
    participants: data?.participants || [],
    total: data?.total || 0,
    isLoading,
    error,
    refetch,
    checkIn,
    checkOut,
    bulkCheckIn,
  };
}

// ============================================================================
// IoT Devices Hook
// ============================================================================

interface UseDevicesResult {
  devices: IoTDevice[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  assignToEvent: (deviceId: string, eventId: string) => Promise<void>;
  unassignFromEvent: (deviceId: string) => Promise<void>;
  sendCommand: (deviceId: string, command: string) => Promise<void>;
}

export function useDevicesData(eventId?: string): UseDevicesResult {
  const url = eventId 
    ? `/api/organizer/events/${eventId}/devices` 
    : '/api/organizer/devices';
  
  const { data, isLoading, error, refetch } = useFetch<{ devices: IoTDevice[] }>(
    url,
    { cacheKey: eventId ? `devices-${eventId}` : 'organizer-devices' }
  );

  const assignToEvent = useCallback(async (deviceId: string, targetEventId: string) => {
    await fetch(`/api/organizer/devices/${deviceId}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId: targetEventId }),
    });
    
    dataCache.invalidate('devices');
    refetch();
  }, [refetch]);

  const unassignFromEvent = useCallback(async (deviceId: string) => {
    await fetch(`/api/organizer/devices/${deviceId}/unassign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    
    dataCache.invalidate('devices');
    refetch();
  }, [refetch]);

  const sendCommand = useCallback(async (deviceId: string, command: string) => {
    await fetch(`/api/organizer/devices/${deviceId}/command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command }),
    });
  }, []);

  return {
    devices: data?.devices || [],
    isLoading,
    error,
    refetch,
    assignToEvent,
    unassignFromEvent,
    sendCommand,
  };
}

// ============================================================================
// Access Logs Hook
// ============================================================================

interface UseAccessLogsResult {
  logs: AccessLog[];
  total: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAccessLogs(eventId: string, options?: {
  gate?: string;
  status?: string;
  limit?: number;
}): UseAccessLogsResult {
  const params = new URLSearchParams();
  if (options?.gate) params.set('gate', options.gate);
  if (options?.status) params.set('status', options.status);
  if (options?.limit) params.set('limit', options.limit.toString());

  const url = `/api/organizer/events/${eventId}/access-logs?${params.toString()}`;
  
  const { data, isLoading, error, refetch } = useFetch<{ 
    logs: AccessLog[]; 
    total: number;
  }>(url, { skipCache: true }); // Always fresh for logs

  return {
    logs: data?.logs || [],
    total: data?.total || 0,
    isLoading,
    error,
    refetch,
  };
}

// ============================================================================
// Crowd Monitoring Hook
// ============================================================================

interface UseCrowdDataResult {
  zones: CrowdZone[];
  currentOccupancy: number;
  maxCapacity: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCrowdMonitoring(eventId: string): UseCrowdDataResult {
  const { data, isLoading, error, refetch } = useFetch<{
    zones: CrowdZone[];
    currentOccupancy: number;
    maxCapacity: number;
  }>(
    `/api/organizer/events/${eventId}/crowd`,
    { skipCache: true } // Real-time data
  );

  return {
    zones: data?.zones || [],
    currentOccupancy: data?.currentOccupancy || 0,
    maxCapacity: data?.maxCapacity || 0,
    isLoading,
    error,
    refetch,
  };
}

// ============================================================================
// Analytics Hook
// ============================================================================

interface UseAnalyticsResult {
  metrics: AnalyticsMetrics | null;
  revenueData: RevenueData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAnalyticsData(options?: {
  eventId?: string;
  dateRange?: { start: string; end: string };
}): UseAnalyticsResult {
  const params = new URLSearchParams();
  if (options?.eventId) params.set('eventId', options.eventId);
  if (options?.dateRange) {
    params.set('startDate', options.dateRange.start);
    params.set('endDate', options.dateRange.end);
  }

  const url = `/api/organizer/analytics?${params.toString()}`;
  
  const { data, isLoading, error, refetch } = useFetch<{
    metrics: AnalyticsMetrics;
    revenueData: RevenueData[];
  }>(url, { cacheKey: `analytics-${options?.eventId || 'all'}` });

  return {
    metrics: data?.metrics || null,
    revenueData: data?.revenueData || [],
    isLoading,
    error,
    refetch,
  };
}

// ============================================================================
// Revenue Hook
// ============================================================================

interface UseRevenueResult {
  totalRevenue: number;
  pendingPayout: number;
  revenueHistory: RevenueData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  requestPayout: (amount: number) => Promise<void>;
}

export function useRevenueData(): UseRevenueResult {
  const { data, isLoading, error, refetch } = useFetch<{
    totalRevenue: number;
    pendingPayout: number;
    revenueHistory: RevenueData[];
  }>('/api/organizer/revenue', { cacheKey: 'organizer-revenue' });

  const requestPayout = useCallback(async (amount: number) => {
    await fetch('/api/organizer/revenue/payout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    
    dataCache.invalidate('organizer-revenue');
    refetch();
  }, [refetch]);

  return {
    totalRevenue: data?.totalRevenue || 0,
    pendingPayout: data?.pendingPayout || 0,
    revenueHistory: data?.revenueHistory || [],
    isLoading,
    error,
    refetch,
    requestPayout,
  };
}

// ============================================================================
// Marketing Hook
// ============================================================================

interface UseMarketingResult {
  promoCodes: PromoCode[];
  campaigns: Campaign[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  createPromoCode: (data: Partial<PromoCode>) => Promise<PromoCode>;
  createCampaign: (data: Partial<Campaign>) => Promise<Campaign>;
  togglePromoCode: (id: string, active: boolean) => Promise<void>;
}

export function useMarketingData(): UseMarketingResult {
  const { data, isLoading, error, refetch } = useFetch<{
    promoCodes: PromoCode[];
    campaigns: Campaign[];
  }>('/api/organizer/marketing', { cacheKey: 'organizer-marketing' });

  const createPromoCode = useCallback(async (promoData: Partial<PromoCode>) => {
    const response = await fetch('/api/organizer/marketing/promo-codes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(promoData),
    });

    if (!response.ok) throw new Error('Failed to create promo code');
    
    const result = await response.json();
    dataCache.invalidate('organizer-marketing');
    refetch();
    return result.promoCode;
  }, [refetch]);

  const createCampaign = useCallback(async (campaignData: Partial<Campaign>) => {
    const response = await fetch('/api/organizer/marketing/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaignData),
    });

    if (!response.ok) throw new Error('Failed to create campaign');
    
    const result = await response.json();
    dataCache.invalidate('organizer-marketing');
    refetch();
    return result.campaign;
  }, [refetch]);

  const togglePromoCode = useCallback(async (id: string, active: boolean) => {
    await fetch(`/api/organizer/marketing/promo-codes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: active }),
    });
    
    dataCache.invalidate('organizer-marketing');
    refetch();
  }, [refetch]);

  return {
    promoCodes: data?.promoCodes || [],
    campaigns: data?.campaigns || [],
    isLoading,
    error,
    refetch,
    createPromoCode,
    createCampaign,
    togglePromoCode,
  };
}

// ============================================================================
// Cache Utilities
// ============================================================================

export function invalidateOrganizerCache(pattern?: string) {
  dataCache.invalidate(pattern);
}
