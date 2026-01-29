'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { RealTimeEvent, RealTimeEventType } from './organizer.types';

// ============================================================================
// Real-time Service Configuration
// ============================================================================

const WS_RECONNECT_DELAY = 3000; // 3 seconds
const WS_MAX_RETRIES = 5;
const SSE_RETRY_DELAY = 5000; // 5 seconds

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface RealTimeConfig {
  type: 'websocket' | 'sse' | 'polling';
  endpoint: string;
  pollingInterval?: number;
}

// ============================================================================
// Event Emitter for Real-time Updates
// ============================================================================

type EventHandler<T = unknown> = (event: RealTimeEvent<T>) => void;

class RealTimeEventEmitter {
  private handlers = new Map<RealTimeEventType | '*', Set<EventHandler>>();

  on(eventType: RealTimeEventType | '*', handler: EventHandler): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.handlers.get(eventType)?.delete(handler);
    };
  }

  emit(event: RealTimeEvent): void {
    // Emit to specific handlers
    this.handlers.get(event.type)?.forEach(handler => handler(event));
    // Emit to wildcard handlers
    this.handlers.get('*')?.forEach(handler => handler(event));
  }

  clear(): void {
    this.handlers.clear();
  }
}

// ============================================================================
// WebSocket Real-time Service
// ============================================================================

class WebSocketRealTimeService {
  private ws: WebSocket | null = null;
  private eventEmitter = new RealTimeEventEmitter();
  private retryCount = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private eventSubscriptions = new Set<string>();
  private statusListeners = new Set<(status: ConnectionStatus) => void>();
  private currentStatus: ConnectionStatus = 'disconnected';

  connect(endpoint: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.updateStatus('connecting');

    try {
      this.ws = new WebSocket(endpoint);

      this.ws.onopen = () => {
        this.retryCount = 0;
        this.updateStatus('connected');
        
        // Re-subscribe to events after reconnection
        this.eventSubscriptions.forEach(eventId => {
          this.sendMessage({ type: 'subscribe', eventId });
        });
      };

      this.ws.onmessage = (messageEvent) => {
        try {
          const data = JSON.parse(messageEvent.data) as RealTimeEvent;
          this.eventEmitter.emit(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        this.updateStatus('disconnected');
        this.scheduleReconnect(endpoint);
      };

      this.ws.onerror = () => {
        this.updateStatus('error');
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.updateStatus('error');
      this.scheduleReconnect(endpoint);
    }
  }

  private scheduleReconnect(endpoint: string): void {
    if (this.retryCount >= WS_MAX_RETRIES) {
      console.error('Max WebSocket reconnection attempts reached');
      return;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = setTimeout(() => {
      this.retryCount++;
      this.connect(endpoint);
    }, WS_RECONNECT_DELAY * Math.pow(2, this.retryCount)); // Exponential backoff
  }

  private updateStatus(status: ConnectionStatus): void {
    this.currentStatus = status;
    this.statusListeners.forEach(listener => listener(status));
  }

  private sendMessage(message: object): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  subscribeToEvent(eventId: string): void {
    this.eventSubscriptions.add(eventId);
    this.sendMessage({ type: 'subscribe', eventId });
  }

  unsubscribeFromEvent(eventId: string): void {
    this.eventSubscriptions.delete(eventId);
    this.sendMessage({ type: 'unsubscribe', eventId });
  }

  onEvent(eventType: RealTimeEventType | '*', handler: EventHandler): () => void {
    return this.eventEmitter.on(eventType, handler);
  }

  onStatusChange(handler: (status: ConnectionStatus) => void): () => void {
    this.statusListeners.add(handler);
    // Immediately call with current status
    handler(this.currentStatus);
    return () => this.statusListeners.delete(handler);
  }

  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    this.ws?.close();
    this.ws = null;
    this.eventEmitter.clear();
    this.eventSubscriptions.clear();
    this.updateStatus('disconnected');
  }

  getStatus(): ConnectionStatus {
    return this.currentStatus;
  }
}

// ============================================================================
// SSE (Server-Sent Events) Real-time Service
// ============================================================================

class SSERealTimeService {
  private eventSource: EventSource | null = null;
  private eventEmitter = new RealTimeEventEmitter();
  private statusListeners = new Set<(status: ConnectionStatus) => void>();
  private currentStatus: ConnectionStatus = 'disconnected';
  private endpoint: string = '';

  connect(endpoint: string): void {
    if (this.eventSource?.readyState === EventSource.OPEN) {
      return;
    }

    this.endpoint = endpoint;
    this.updateStatus('connecting');

    try {
      this.eventSource = new EventSource(endpoint);

      this.eventSource.onopen = () => {
        this.updateStatus('connected');
      };

      this.eventSource.onmessage = (messageEvent) => {
        try {
          const data = JSON.parse(messageEvent.data) as RealTimeEvent;
          this.eventEmitter.emit(data);
        } catch (error) {
          console.error('Failed to parse SSE message:', error);
        }
      };

      // Handle specific event types
      const eventTypes: RealTimeEventType[] = [
        'check_in', 'check_out', 'crowd_update', 
        'device_status', 'alert', 'ticket_sale', 'scan_result'
      ];

      eventTypes.forEach(type => {
        this.eventSource!.addEventListener(type, (e: Event) => {
          const messageEvent = e as MessageEvent;
          try {
            const data = JSON.parse(messageEvent.data);
            this.eventEmitter.emit({ type, timestamp: new Date().toISOString(), data });
          } catch (error) {
            console.error(`Failed to parse SSE ${type} event:`, error);
          }
        });
      });

      this.eventSource.onerror = () => {
        this.updateStatus('error');
        this.eventSource?.close();
        
        // Auto-reconnect after delay
        setTimeout(() => this.connect(this.endpoint), SSE_RETRY_DELAY);
      };
    } catch (error) {
      console.error('SSE connection error:', error);
      this.updateStatus('error');
    }
  }

  private updateStatus(status: ConnectionStatus): void {
    this.currentStatus = status;
    this.statusListeners.forEach(listener => listener(status));
  }

  onEvent(eventType: RealTimeEventType | '*', handler: EventHandler): () => void {
    return this.eventEmitter.on(eventType, handler);
  }

  onStatusChange(handler: (status: ConnectionStatus) => void): () => void {
    this.statusListeners.add(handler);
    handler(this.currentStatus);
    return () => this.statusListeners.delete(handler);
  }

  disconnect(): void {
    this.eventSource?.close();
    this.eventSource = null;
    this.eventEmitter.clear();
    this.updateStatus('disconnected');
  }

  getStatus(): ConnectionStatus {
    return this.currentStatus;
  }
}

// ============================================================================
// Polling Real-time Service (Fallback)
// ============================================================================

class PollingRealTimeService {
  private intervalId: NodeJS.Timeout | null = null;
  private eventEmitter = new RealTimeEventEmitter();
  private statusListeners = new Set<(status: ConnectionStatus) => void>();
  private currentStatus: ConnectionStatus = 'disconnected';
  private lastTimestamp: string | null = null;

  connect(endpoint: string, interval: number = 5000): void {
    this.updateStatus('connecting');

    const poll = async () => {
      try {
        const url = new URL(endpoint, window.location.origin);
        if (this.lastTimestamp) {
          url.searchParams.set('since', this.lastTimestamp);
        }

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Polling failed');

        const events = await response.json() as RealTimeEvent[];
        
        if (this.currentStatus !== 'connected') {
          this.updateStatus('connected');
        }

        events.forEach(event => {
          this.eventEmitter.emit(event);
          this.lastTimestamp = event.timestamp;
        });
      } catch (error) {
        console.error('Polling error:', error);
        this.updateStatus('error');
      }
    };

    poll(); // Initial poll
    this.intervalId = setInterval(poll, interval);
  }

  private updateStatus(status: ConnectionStatus): void {
    this.currentStatus = status;
    this.statusListeners.forEach(listener => listener(status));
  }

  onEvent(eventType: RealTimeEventType | '*', handler: EventHandler): () => void {
    return this.eventEmitter.on(eventType, handler);
  }

  onStatusChange(handler: (status: ConnectionStatus) => void): () => void {
    this.statusListeners.add(handler);
    handler(this.currentStatus);
    return () => this.statusListeners.delete(handler);
  }

  disconnect(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.eventEmitter.clear();
    this.updateStatus('disconnected');
  }

  getStatus(): ConnectionStatus {
    return this.currentStatus;
  }
}

// ============================================================================
// Unified Real-time Service Factory
// ============================================================================

let realTimeService: WebSocketRealTimeService | SSERealTimeService | PollingRealTimeService | null = null;

export function getRealTimeService(config?: RealTimeConfig) {
  if (realTimeService) return realTimeService;

  const type = config?.type || 'sse'; // Default to SSE

  switch (type) {
    case 'websocket':
      realTimeService = new WebSocketRealTimeService();
      break;
    case 'sse':
      realTimeService = new SSERealTimeService();
      break;
    case 'polling':
      realTimeService = new PollingRealTimeService();
      break;
  }

  return realTimeService!;
}

// ============================================================================
// React Hooks for Real-time
// ============================================================================

/**
 * Hook to connect to real-time service
 */
export function useRealTimeConnection(config?: RealTimeConfig) {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const serviceRef = useRef(getRealTimeService(config));

  useEffect(() => {
    const service = serviceRef.current;
    const endpoint = config?.endpoint || '/api/organizer/realtime';
    
    service.connect(endpoint);
    const unsubscribe = service.onStatusChange(setStatus);

    return () => {
      unsubscribe();
      service.disconnect();
    };
  }, [config?.endpoint]);

  return { status, service: serviceRef.current };
}

/**
 * Hook to subscribe to specific real-time events
 */
export function useRealTimeEvent<T = unknown>(
  eventType: RealTimeEventType | '*',
  handler: (event: RealTimeEvent<T>) => void,
  deps: React.DependencyList = []
) {
  const serviceRef = useRef(getRealTimeService());
  const handlerRef = useRef(handler);
  
  // Update handler ref on each render
  handlerRef.current = handler;

  useEffect(() => {
    const unsubscribe = serviceRef.current.onEvent(
      eventType, 
      (event) => handlerRef.current(event as RealTimeEvent<T>)
    );
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventType, ...deps]);
}

/**
 * Hook for live check-in updates
 */
export function useCheckInUpdates(eventId: string, onCheckIn: (data: { 
  participantId: string; 
  gate: string; 
  timestamp: string;
}) => void) {
  useRealTimeEvent('check_in', (event) => {
    if (event.eventId === eventId) {
      onCheckIn(event.data as any);
    }
  }, [eventId, onCheckIn]);
}

/**
 * Hook for crowd density updates
 */
export function useCrowdUpdates(eventId: string, onUpdate: (zones: any[]) => void) {
  useRealTimeEvent('crowd_update', (event) => {
    if (event.eventId === eventId) {
      onUpdate(event.data as any[]);
    }
  }, [eventId, onUpdate]);
}

/**
 * Hook for device status updates
 */
export function useDeviceStatusUpdates(onStatusChange: (data: {
  deviceId: string;
  status: string;
  batteryLevel?: number;
}) => void) {
  useRealTimeEvent('device_status', (event) => {
    onStatusChange(event.data as any);
  }, [onStatusChange]);
}

/**
 * Hook for real-time alerts
 */
export function useAlertUpdates(eventId: string | null, onAlert: (alert: any) => void) {
  useRealTimeEvent('alert', (event) => {
    if (!eventId || event.eventId === eventId) {
      onAlert(event.data);
    }
  }, [eventId, onAlert]);
}

// ============================================================================
// Exports
// ============================================================================

export { WebSocketRealTimeService, SSERealTimeService, PollingRealTimeService };
export type { ConnectionStatus, RealTimeConfig };
