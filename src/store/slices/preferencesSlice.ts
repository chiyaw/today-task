import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ContentCategory {
  id: string;
  name: string;
  enabled: boolean;
  color: string;
}

export interface PreferencesState {
  categories: ContentCategory[];
  newsTopics: string[];
  movieGenres: string[];
  socialHashtags: string[];
  refreshInterval: number; // in minutes
}

const initialState: PreferencesState = {
  categories: [
    { id: 'news', name: 'News & Current Affairs', enabled: true, color: 'news' },
    { id: 'sports', name: 'Sports', enabled: true, color: 'sports' },
    { id: 'entertainment', name: 'Entertainment', enabled: true, color: 'entertainment' },
    { id: 'educational', name: 'Educational', enabled: true, color: 'educational' },
    { id: 'finance', name: 'Business & Finance', enabled: true, color: 'finance' },
    { id: 'travel', name: 'Travel & Culture', enabled: true, color: 'travel' },
    { id: 'technology', name: 'Technology & Science', enabled: true, color: 'technology' },
  ],
  newsTopics: ['technology', 'business', 'science'],
  movieGenres: ['action', 'comedy', 'drama'],
  socialHashtags: ['tech', 'innovation', 'design'],
  refreshInterval: 30,
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    toggleCategory: (state, action: PayloadAction<string>) => {
      const category = state.categories.find(cat => cat.id === action.payload);
      if (category) {
        category.enabled = !category.enabled;
      }
    },
    updateNewsTopics: (state, action: PayloadAction<string[]>) => {
      state.newsTopics = action.payload;
    },
    updateMovieGenres: (state, action: PayloadAction<string[]>) => {
      state.movieGenres = action.payload;
    },
    updateSocialHashtags: (state, action: PayloadAction<string[]>) => {
      state.socialHashtags = action.payload;
    },
    updateRefreshInterval: (state, action: PayloadAction<number>) => {
      state.refreshInterval = action.payload;
    },
    resetPreferences: () => initialState,
  },
});

export const {
  toggleCategory,
  updateNewsTopics,
  updateMovieGenres,
  updateSocialHashtags,
  updateRefreshInterval,
  resetPreferences,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;