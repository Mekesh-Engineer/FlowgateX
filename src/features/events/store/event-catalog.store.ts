// src/features/events/stores/event-catalog.store.ts
import { create } from 'zustand';

export type ViewMode = 'grid' | 'list' | 'map';

interface EventFilters {
  search: string;
  category: string | 'all';
  priceRange: [number, number];
  dateRange: { from: Date | null; to: Date | null };
  minRating: number;
  onlyAvailable: boolean;
}

interface EventCatalogState {
  viewMode: ViewMode;
  filters: EventFilters;
  setViewMode: (mode: ViewMode) => void;
  setFilter: <K extends keyof EventFilters>(key: K, value: EventFilters[K]) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: EventFilters = {
  search: '',
  category: 'all',
  priceRange: [0, 10000],
  dateRange: { from: null, to: null },
  minRating: 0,
  onlyAvailable: false,
};

export const useEventCatalogStore = create<EventCatalogState>((set) => ({
  viewMode: 'grid',
  filters: DEFAULT_FILTERS,
  setViewMode: (mode) => set({ viewMode: mode }),
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}));