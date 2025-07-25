import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  darkMode: boolean;
  sidebarCollapsed: boolean;
  activeSection: 'feed' | 'favorites' | 'trending' | 'preferences' | 'sports' | 'news' | 'educational' | 'entertainment' | 'travel' | 'finance' | 'technology';
  searchQuery: string;
  showPreferences: boolean;
}

const initialState: UIState = {
  darkMode: false,
  sidebarCollapsed: false,
  activeSection: 'feed',
  searchQuery: '',
  showPreferences: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setActiveSection: (state, action: PayloadAction<UIState['activeSection']>) => {
      state.activeSection = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = '';
    },
    togglePreferences: (state) => {
      state.showPreferences = !state.showPreferences;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
  },
});

export const {
  toggleDarkMode,
  toggleSidebar,
  setActiveSection,
  setSearchQuery,
  clearSearchQuery,
  togglePreferences,
  setDarkMode,
} = uiSlice.actions;

export default uiSlice.reducer;