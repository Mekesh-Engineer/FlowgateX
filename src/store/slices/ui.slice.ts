import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  notifications: Array<{ id: string; message: string }>;
}

const initialState: UIState = {
  sidebarOpen: true,
  notifications: [],
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    addNotification: (state, action: PayloadAction<{ id: string; message: string }>) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
  },
});

export const { toggleSidebar, addNotification, removeNotification } = uiSlice.actions;
export default uiSlice.reducer;
