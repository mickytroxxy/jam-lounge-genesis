import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import accountSlice from './slices/accountInfo';
import musicPlayerSlice from './slices/musicPlayerSlice';

// Music player persist config - exclude loading and playback states
const musicPlayerPersistConfig = {
  key: 'musicPlayer',
  storage,
  blacklist: ['isLoadingSongs', 'isRecording', 'recordingDuration'],
  transforms: [
    {
      in: (state: any) => ({
        ...state,
        deckA: {
          ...state.deckA,
          isLoading: false,
          isPlaying: false,
          position: 0,
        },
        deckB: {
          ...state.deckB,
          isLoading: false,
          isPlaying: false,
          position: 0,
        },
      }),
      out: (state: any) => state,
    }
  ],
};

const rootReducer = combineReducers({
  accountSlice,
  musicPlayer: persistReducer(musicPlayerPersistConfig, musicPlayerSlice)
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['modalData', 'modalState', 'camera', 'ConfirmDialog', 'game'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

// Define the state structure with all slices
export interface RootStateWithoutPersist {
  accountSlice: ReturnType<typeof accountSlice>;
  musicPlayer: ReturnType<typeof musicPlayerSlice>;
}

// Define the persisted state type
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);