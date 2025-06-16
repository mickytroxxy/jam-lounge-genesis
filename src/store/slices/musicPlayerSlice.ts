import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Song } from '@/Types';

interface MusicPlayerState {
  // Current playing tracks
  deckA: {
    currentTrack: Song | null;
    isPlaying: boolean;
    volume: number;
    position: number;
    duration: number;
    isLoading: boolean;
  };
  deckB: {
    currentTrack: Song | null;
    isPlaying: boolean;
    volume: number;
    position: number;
    duration: number;
    isLoading: boolean;
  };
  
  // Mixer settings
  crossfader: number; // 0-100, 0 = full A, 100 = full B
  masterVolume: number;
  
  // EQ settings
  deckAEQ: {
    high: number;
    mid: number;
    low: number;
  };
  deckBEQ: {
    high: number;
    mid: number;
    low: number;
  };
  
  // Effects
  deckAEffects: {
    reverb: number;
    delay: number;
    filter: number;
    distortion: number;
    chorus: number;
    flanger: number;
  };
  deckBEffects: {
    reverb: number;
    delay: number;
    filter: number;
    distortion: number;
    chorus: number;
    flanger: number;
  };
  
  // Music library
  djSongs: Song[];
  isLoadingSongs: boolean;
  
  // Recording
  isRecording: boolean;
  recordingDuration: number;
  
  // BPM and sync
  bpmA: number;
  bpmB: number;
  isSynced: boolean;
}

const initialState: MusicPlayerState = {
  deckA: {
    currentTrack: null,
    isPlaying: false,
    volume: 75,
    position: 0,
    duration: 0,
    isLoading: false,
  },
  deckB: {
    currentTrack: null,
    isPlaying: false,
    volume: 75,
    position: 0,
    duration: 0,
    isLoading: false,
  },
  crossfader: 50,
  masterVolume: 75,
  deckAEQ: {
    high: 50,
    mid: 50,
    low: 50,
  },
  deckBEQ: {
    high: 50,
    mid: 50,
    low: 50,
  },
  deckAEffects: {
    reverb: 0,
    delay: 0,
    filter: 50,
    distortion: 0,
    chorus: 0,
    flanger: 0,
  },
  deckBEffects: {
    reverb: 0,
    delay: 0,
    filter: 50,
    distortion: 0,
    chorus: 0,
    flanger: 0,
  },
  djSongs: [],
  isLoadingSongs: false,
  isRecording: false,
  recordingDuration: 0,
  bpmA: 128,
  bpmB: 128,
  isSynced: false,
};

const musicPlayerSlice = createSlice({
  name: 'musicPlayer',
  initialState,
  reducers: {
    // Deck A actions
    setDeckATrack: (state, action: PayloadAction<Song | null>) => {
      state.deckA.currentTrack = action.payload;
      state.deckA.position = 0;
      state.deckA.isPlaying = false;
    },
    setDeckAPlaying: (state, action: PayloadAction<boolean>) => {
      state.deckA.isPlaying = action.payload;
    },
    setDeckAVolume: (state, action: PayloadAction<number>) => {
      state.deckA.volume = action.payload;
    },
    setDeckAPosition: (state, action: PayloadAction<number>) => {
      state.deckA.position = action.payload;
    },
    setDeckADuration: (state, action: PayloadAction<number>) => {
      state.deckA.duration = action.payload;
    },
    setDeckALoading: (state, action: PayloadAction<boolean>) => {
      state.deckA.isLoading = action.payload;
    },
    
    // Deck B actions
    setDeckBTrack: (state, action: PayloadAction<Song | null>) => {
      state.deckB.currentTrack = action.payload;
      state.deckB.position = 0;
      state.deckB.isPlaying = false;
    },
    setDeckBPlaying: (state, action: PayloadAction<boolean>) => {
      state.deckB.isPlaying = action.payload;
    },
    setDeckBVolume: (state, action: PayloadAction<number>) => {
      state.deckB.volume = action.payload;
    },
    setDeckBPosition: (state, action: PayloadAction<number>) => {
      state.deckB.position = action.payload;
    },
    setDeckBDuration: (state, action: PayloadAction<number>) => {
      state.deckB.duration = action.payload;
    },
    setDeckBLoading: (state, action: PayloadAction<boolean>) => {
      state.deckB.isLoading = action.payload;
    },
    
    // Mixer actions
    setCrossfader: (state, action: PayloadAction<number>) => {
      state.crossfader = action.payload;
    },
    setMasterVolume: (state, action: PayloadAction<number>) => {
      state.masterVolume = action.payload;
    },
    
    // EQ actions
    setDeckAEQ: (state, action: PayloadAction<{ high?: number; mid?: number; low?: number }>) => {
      state.deckAEQ = { ...state.deckAEQ, ...action.payload };
    },
    setDeckBEQ: (state, action: PayloadAction<{ high?: number; mid?: number; low?: number }>) => {
      state.deckBEQ = { ...state.deckBEQ, ...action.payload };
    },
    
    // Effects actions
    setDeckAEffects: (state, action: PayloadAction<Partial<typeof initialState.deckAEffects>>) => {
      state.deckAEffects = { ...state.deckAEffects, ...action.payload };
    },
    setDeckBEffects: (state, action: PayloadAction<Partial<typeof initialState.deckBEffects>>) => {
      state.deckBEffects = { ...state.deckBEffects, ...action.payload };
    },
    
    // Music library actions
    setDJSongs: (state, action: PayloadAction<Song[]>) => {
      // Ensure payload is always an array
      state.djSongs = Array.isArray(action.payload) ? action.payload : [];
    },
    setLoadingSongs: (state, action: PayloadAction<boolean>) => {
      state.isLoadingSongs = action.payload;
    },
    
    // Recording actions
    setRecording: (state, action: PayloadAction<boolean>) => {
      state.isRecording = action.payload;
      if (!action.payload) {
        state.recordingDuration = 0;
      }
    },
    setRecordingDuration: (state, action: PayloadAction<number>) => {
      state.recordingDuration = action.payload;
    },
    
    // BPM and sync actions
    setBPMA: (state, action: PayloadAction<number>) => {
      state.bpmA = action.payload;
    },
    setBPMB: (state, action: PayloadAction<number>) => {
      state.bpmB = action.payload;
    },
    setSynced: (state, action: PayloadAction<boolean>) => {
      state.isSynced = action.payload;
    },
    
    // Reset actions
    resetDeckA: (state) => {
      state.deckA = initialState.deckA;
      state.deckAEQ = initialState.deckAEQ;
      state.deckAEffects = initialState.deckAEffects;
    },
    resetDeckB: (state) => {
      state.deckB = initialState.deckB;
      state.deckBEQ = initialState.deckBEQ;
      state.deckBEffects = initialState.deckBEffects;
    },
    resetMixer: (state) => {
      state.crossfader = initialState.crossfader;
      state.masterVolume = initialState.masterVolume;
    },
  },
});

export const {
  // Deck A
  setDeckATrack,
  setDeckAPlaying,
  setDeckAVolume,
  setDeckAPosition,
  setDeckADuration,
  setDeckALoading,
  
  // Deck B
  setDeckBTrack,
  setDeckBPlaying,
  setDeckBVolume,
  setDeckBPosition,
  setDeckBDuration,
  setDeckBLoading,
  
  // Mixer
  setCrossfader,
  setMasterVolume,
  
  // EQ
  setDeckAEQ,
  setDeckBEQ,
  
  // Effects
  setDeckAEffects,
  setDeckBEffects,
  
  // Music library
  setDJSongs,
  setLoadingSongs,
  
  // Recording
  setRecording,
  setRecordingDuration,
  
  // BPM and sync
  setBPMA,
  setBPMB,
  setSynced,
  
  // Reset
  resetDeckA,
  resetDeckB,
  resetMixer,
} = musicPlayerSlice.actions;

export default musicPlayerSlice.reducer;
