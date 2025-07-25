import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import preferencesReducer from './slices/preferencesSlice';
import favoritesReducer from './slices/favoritesSlice';
import contentReducer from './slices/contentSlice';
import uiReducer from './slices/uiSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['preferences', 'favorites', 'ui'], // Only persist these slices
};

const rootReducer = {
  preferences: persistReducer(persistConfig, preferencesReducer),
  favorites: persistReducer(persistConfig, favoritesReducer),
  content: contentReducer,
  ui: persistReducer(persistConfig, uiReducer),
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;