'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { 
  OrganizerState, 
  OrganizerContextType, 
  OrganizerEvent, 
  Participant, 
  IoTDevice,
  CrowdZone,
  CrowdAlert,
  RealTimeEvent
} from './organizer.types';

// ============================================================================
// Initial State
// ============================================================================

const initialState: OrganizerState = {
  selectedEventId: null,
  events: [],
  participants: new Map(),
  devices: [],
  liveMetrics: {
    currentOccupancy: 0,
    totalCheckIns: 0,
    totalCheckOuts: 0,
    activeAlerts: 0,
  },
  crowdZones: [],
  recentAlerts: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

// ============================================================================
// Action Types
// ============================================================================

type OrganizerAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SELECT_EVENT'; payload: string | null }
  | { type: 'SET_EVENTS'; payload: OrganizerEvent[] }
  | { type: 'SET_PARTICIPANTS'; payload: { eventId: string; participants: Participant[] } }
  | { type: 'SET_DEVICES'; payload: IoTDevice[] }
  | { type: 'UPDATE_LIVE_METRICS'; payload: Partial<OrganizerState['liveMetrics']> }
  | { type: 'SET_CROWD_ZONES'; payload: CrowdZone[] }
  | { type: 'ADD_ALERT'; payload: CrowdAlert }
  | { type: 'ACKNOWLEDGE_ALERT'; payload: string }
  | { type: 'REAL_TIME_UPDATE'; payload: RealTimeEvent }
  | { type: 'SET_LAST_UPDATED'; payload: string };

// ============================================================================
// Reducer
// ============================================================================

function organizerReducer(state: OrganizerState, action: OrganizerAction): OrganizerState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SELECT_EVENT':
      return { ...state, selectedEventId: action.payload };
    
    case 'SET_EVENTS':
      return { ...state, events: action.payload, isLoading: false };
    
    case 'SET_PARTICIPANTS': {
      const newParticipants = new Map(state.participants);
      newParticipants.set(action.payload.eventId, action.payload.participants);
      return { ...state, participants: newParticipants, isLoading: false };
    }
    
    case 'SET_DEVICES':
      return { ...state, devices: action.payload, isLoading: false };
    
    case 'UPDATE_LIVE_METRICS':
      return { 
        ...state, 
        liveMetrics: { ...state.liveMetrics, ...action.payload } 
      };
    
    case 'SET_CROWD_ZONES':
      return { ...state, crowdZones: action.payload };
    
    case 'ADD_ALERT':
      return { 
        ...state, 
        recentAlerts: [action.payload, ...state.recentAlerts].slice(0, 50),
        liveMetrics: {
          ...state.liveMetrics,
          activeAlerts: state.liveMetrics.activeAlerts + 1
        }
      };
    
    case 'ACKNOWLEDGE_ALERT':
      return {
        ...state,
        recentAlerts: state.recentAlerts.map(alert =>
          alert.id === action.payload ? { ...alert, acknowledged: true } : alert
        ),
        liveMetrics: {
          ...state.liveMetrics,
          activeAlerts: Math.max(0, state.liveMetrics.activeAlerts - 1)
        }
      };
    
    case 'REAL_TIME_UPDATE': {
      const event = action.payload;
      switch (event.type) {
        case 'check_in':
          return {
            ...state,
            liveMetrics: {
              ...state.liveMetrics,
              currentOccupancy: state.liveMetrics.currentOccupancy + 1,
              totalCheckIns: state.liveMetrics.totalCheckIns + 1
            }
          };
        case 'check_out':
          return {
            ...state,
            liveMetrics: {
              ...state.liveMetrics,
              currentOccupancy: Math.max(0, state.liveMetrics.currentOccupancy - 1),
              totalCheckOuts: state.liveMetrics.totalCheckOuts + 1
            }
          };
        case 'crowd_update':
          return {
            ...state,
            crowdZones: event.data as CrowdZone[]
          };
        default:
          return state;
      }
    }
    
    case 'SET_LAST_UPDATED':
      return { ...state, lastUpdated: action.payload };
    
    default:
      return state;
  }
}

// ============================================================================
// Context
// ============================================================================

export const OrganizerContext = createContext<OrganizerContextType | undefined>(undefined);

// ============================================================================
// Provider Component
// ============================================================================

interface OrganizerProviderProps {
  children: ReactNode;
}

export function OrganizerProvider({ children }: OrganizerProviderProps) {
  const [state, dispatch] = useReducer(organizerReducer, initialState);
  const { user } = useAuth();

  // -------------------------------------------------------------------------
  // API Calls
  // -------------------------------------------------------------------------

  const refreshEvents = useCallback(async () => {
    if (!user || user.role !== 'organizer') return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('/api/organizer/events', {
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) throw new Error('Failed to fetch events');
      
      const data = await response.json();
      dispatch({ type: 'SET_EVENTS', payload: data.events });
      dispatch({ type: 'SET_LAST_UPDATED', payload: new Date().toISOString() });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  }, [user]);

  const refreshParticipants = useCallback(async (eventId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch(`/api/organizer/events/${eventId}/participants`, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) throw new Error('Failed to fetch participants');
      
      const data = await response.json();
      dispatch({ type: 'SET_PARTICIPANTS', payload: { eventId, participants: data.participants } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  }, []);

  const refreshDevices = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('/api/organizer/devices', {
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) throw new Error('Failed to fetch devices');
      
      const data = await response.json();
      dispatch({ type: 'SET_DEVICES', payload: data.devices });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  }, []);

  const acknowledgeAlert = useCallback(async (alertId: string) => {
    try {
      await fetch(`/api/organizer/alerts/${alertId}/acknowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      dispatch({ type: 'ACKNOWLEDGE_ALERT', payload: alertId });
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  }, []);

  // -------------------------------------------------------------------------
  // Event Selection
  // -------------------------------------------------------------------------

  const selectEvent = useCallback((eventId: string | null) => {
    dispatch({ type: 'SELECT_EVENT', payload: eventId });
  }, []);

  // -------------------------------------------------------------------------
  // Real-time Subscriptions (Placeholder - implement with WebSocket/SSE)
  // -------------------------------------------------------------------------

  const subscribeToEvent = useCallback((eventId: string) => {
    // Will be implemented with WebSocket connection
    console.log(`Subscribing to real-time updates for event: ${eventId}`);
  }, []);

  const unsubscribeFromEvent = useCallback((eventId: string) => {
    // Will clean up WebSocket connection
    console.log(`Unsubscribing from event: ${eventId}`);
  }, []);

  // -------------------------------------------------------------------------
  // Computed Values
  // -------------------------------------------------------------------------

  const getEventById = useCallback((id: string) => {
    return state.events.find(event => event.id === id);
  }, [state.events]);

  const getParticipantsForEvent = useCallback((eventId: string) => {
    return state.participants.get(eventId) || [];
  }, [state.participants]);

  const getDevicesForEvent = useCallback((eventId: string) => {
    return state.devices.filter(device => device.eventId === eventId || !device.eventId);
  }, [state.devices]);

  // -------------------------------------------------------------------------
  // Initial Load
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (user?.role === 'organizer') {
      refreshEvents();
      refreshDevices();
    }
  }, [user, refreshEvents, refreshDevices]);

  // -------------------------------------------------------------------------
  // Context Value
  // -------------------------------------------------------------------------

  const contextValue: OrganizerContextType = {
    ...state,
    selectEvent,
    refreshEvents,
    refreshParticipants,
    refreshDevices,
    acknowledgeAlert,
    subscribeToEvent,
    unsubscribeFromEvent,
    getEventById,
    getParticipantsForEvent,
    getDevicesForEvent,
  };

  return (
    <OrganizerContext.Provider value={contextValue}>
      {children}
    </OrganizerContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useOrganizer() {
  const context = useContext(OrganizerContext);
  if (!context) {
    throw new Error('useOrganizer must be used within OrganizerProvider');
  }
  return context;
}

// ============================================================================
// Selector Hooks (for optimized re-renders)
// ============================================================================

export function useSelectedEvent() {
  const { selectedEventId, getEventById } = useOrganizer();
  return selectedEventId ? getEventById(selectedEventId) : null;
}

export function useOrganizerEvents() {
  const { events, isLoading, refreshEvents } = useOrganizer();
  return { events, isLoading, refresh: refreshEvents };
}

export function useLiveMetrics() {
  const { liveMetrics, lastUpdated } = useOrganizer();
  return { metrics: liveMetrics, lastUpdated };
}

export function useCrowdData() {
  const { crowdZones, recentAlerts, liveMetrics } = useOrganizer();
  return { 
    zones: crowdZones, 
    alerts: recentAlerts,
    activeAlerts: liveMetrics.activeAlerts,
    currentOccupancy: liveMetrics.currentOccupancy
  };
}
