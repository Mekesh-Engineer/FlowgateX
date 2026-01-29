import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  notifications: Array<{ id: string; message: string }>;
}

const initialState: UIState = {
  sidebarOpen: false, // Mobile sidebar starts closed
  sidebarCollapsed: false, // Desktop sidebar starts expanded
  notifications: [],
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebarCollapse: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    addNotification: (state, action: PayloadAction<{ id: string; message: string }>) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
  },
});

export const { 
  toggleSidebar, 
  setSidebarOpen, 
  toggleSidebarCollapse, 
  setSidebarCollapsed,
  addNotification, 
  removeNotification 
} = uiSlice.actions;
export default uiSlice.reducer;
