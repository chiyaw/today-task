import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContentItem } from '../../types/content';

export interface FavoritesState {
  items: ContentItem[];
}

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<ContentItem>) => {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingIndex === -1) {
        state.items.unshift(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearFavorites: (state) => {
      state.items = [];
    },
    reorderFavorites: (state, action: PayloadAction<{ startIndex: number; endIndex: number }>) => {
      const { startIndex, endIndex } = action.payload;
      const result = Array.from(state.items);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      state.items = result;
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites, reorderFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;