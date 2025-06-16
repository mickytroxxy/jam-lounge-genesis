import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useAuth } from '@/contexts/AuthContext';
import { getDJSongs } from '@/api';
import { Song } from '@/Types';
import {
  setDeckATrack,
  setDeckAPlaying,
  setDeckAVolume,
  setDeckAPosition,
  setDeckADuration,
  setDeckALoading,
  setDeckBTrack,
  setDeckBPlaying,
  setDeckBVolume,
  setDeckBPosition,
  setDeckBDuration,
  setDeckBLoading,
  setCrossfader,
  setMasterVolume,
  setDeckAEQ,
  setDeckBEQ,
  setDeckAEffects,
  setDeckBEffects,
  setDJSongs,
  setLoadingSongs,
  setRecording,
  setRecordingDuration,
  setBPMA,
  setBPMB,
  setSynced,
  resetDeckA,
  resetDeckB,
  resetMixer,
} from '@/store/slices/musicPlayerSlice';

export const useMusicPlayer = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAuth();
  const musicPlayerState = useAppSelector((state) => {
    console.log('Full Redux state:', state);
    console.log('Music player state:', state.musicPlayer);
    return state.musicPlayer;
  });

  // Audio element refs for both decks
  const deckAAudioRef = useRef<HTMLAudioElement | null>(null);
  const deckBAudioRef = useRef<HTMLAudioElement | null>(null);

  // Web Audio API refs for effects
  const audioContextRef = useRef<AudioContext | null>(null);
  const deckASourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const deckBSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const deckAGainRef = useRef<GainNode | null>(null);
  const deckBGainRef = useRef<GainNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // EQ nodes for Deck A
  const deckAHighRef = useRef<BiquadFilterNode | null>(null);
  const deckAMidRef = useRef<BiquadFilterNode | null>(null);
  const deckALowRef = useRef<BiquadFilterNode | null>(null);

  // EQ nodes for Deck B
  const deckBHighRef = useRef<BiquadFilterNode | null>(null);
  const deckBMidRef = useRef<BiquadFilterNode | null>(null);
  const deckBLowRef = useRef<BiquadFilterNode | null>(null);

  // Effect nodes
  const deckADelayRef = useRef<DelayNode | null>(null);
  const deckBDelayRef = useRef<DelayNode | null>(null);
  const deckAConvolverRef = useRef<ConvolverNode | null>(null);
  const deckBConvolverRef = useRef<ConvolverNode | null>(null);

  // Load DJ songs when user is authenticated
  const loadDJSongs = useCallback(() => {
    if (!isAuthenticated || !user?.userId) {
      dispatch(setDJSongs([]));
      return;
    }

    dispatch(setLoadingSongs(true));

    try {
      getDJSongs(user.userId, 'ACTIVE', (result: any) => {
        console.log('getDJSongs result:', result);

        // Handle different response formats
        let songs: Song[] = [];

        if (Array.isArray(result)) {
          songs = result;
        } else if (result && typeof result === 'object') {
          // If result is an object, try to extract songs array
          if (Array.isArray(result.songs)) {
            songs = result.songs;
          } else if (Array.isArray(result.data)) {
            songs = result.data;
          } else {
            console.warn('Unexpected getDJSongs response format:', result);
            songs = [];
          }
        } else {
          console.error('Invalid getDJSongs response:', result);
          songs = [];
        }

        dispatch(setDJSongs(songs));
        dispatch(setLoadingSongs(false));
        console.log('Loaded', songs.length, 'DJ songs');
      });
    } catch (error) {
      console.error('Error calling getDJSongs:', error);
      dispatch(setDJSongs([]));
      dispatch(setLoadingSongs(false));
    }
  }, [dispatch, isAuthenticated, user?.userId]);

  // Initialize Web Audio API and HTML5 audio elements
  useEffect(() => {
    // Reset loading states on mount (in case they were persisted)
    dispatch(setDeckALoading(false));
    dispatch(setDeckBLoading(false));
    dispatch(setLoadingSongs(false));

    // Initialize Audio Context for effects
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        console.log('Web Audio API initialized for effects');
      } catch (error) {
        console.warn('Web Audio API not available:', error);
      }
    }

    // Initialize audio elements
    if (!deckAAudioRef.current) {
      deckAAudioRef.current = new Audio();
      deckAAudioRef.current.preload = 'metadata';
      console.log('Deck A audio element created');
    }
    if (!deckBAudioRef.current) {
      deckBAudioRef.current = new Audio();
      deckBAudioRef.current.preload = 'metadata';
      console.log('Deck B audio element created');
    }

    // Initialize master gain for Web Audio API
    const initializeMasterGain = () => {
      if (!audioContextRef.current || masterGainRef.current) return;

      try {
        masterGainRef.current = audioContextRef.current.createGain();
        masterGainRef.current.connect(audioContextRef.current.destination);
        console.log('Master gain node created');
      } catch (error) {
        console.warn('Failed to create master gain node:', error);
      }
    };

    // Initialize Web Audio when user interacts
    const handleUserInteraction = () => {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      initializeMasterGain();
      document.removeEventListener('click', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      if (deckAAudioRef.current) {
        deckAAudioRef.current.pause();
        deckAAudioRef.current = null;
      }
      if (deckBAudioRef.current) {
        deckBAudioRef.current.pause();
        deckBAudioRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  // Load songs when authenticated
  useEffect(() => {
    loadDJSongs();
  }, [loadDJSongs]);



  // Initialize Web Audio nodes for Deck A with CORS fallback
  const initializeWebAudioForDeckA = useCallback(() => {
    if (!audioContextRef.current || !deckAAudioRef.current || deckASourceRef.current) return;

    try {
      console.log('Attempting to initialize Web Audio for Deck A...');

      // Test if we can create MediaElementAudioSourceNode without breaking audio
      const testSource = audioContextRef.current.createMediaElementSource(deckAAudioRef.current);

      // If we get here, CORS is working, continue with full setup
      deckASourceRef.current = testSource;

      // Create EQ filters
      deckAHighRef.current = audioContextRef.current.createBiquadFilter();
      deckAHighRef.current.type = 'highshelf';
      deckAHighRef.current.frequency.value = 8000;
      deckAHighRef.current.gain.value = 0;

      deckAMidRef.current = audioContextRef.current.createBiquadFilter();
      deckAMidRef.current.type = 'peaking';
      deckAMidRef.current.frequency.value = 1000;
      deckAMidRef.current.Q.value = 1;
      deckAMidRef.current.gain.value = 0;

      deckALowRef.current = audioContextRef.current.createBiquadFilter();
      deckALowRef.current.type = 'lowshelf';
      deckALowRef.current.frequency.value = 200;
      deckALowRef.current.gain.value = 0;

      // Create delay for echo
      deckADelayRef.current = audioContextRef.current.createDelay(1.0);
      deckADelayRef.current.delayTime.value = 0;

      // Create convolver for reverb
      deckAConvolverRef.current = audioContextRef.current.createConvolver();

      // Create gain node
      deckAGainRef.current = audioContextRef.current.createGain();

      // Connect audio chain: source -> EQ -> effects -> gain -> master
      deckASourceRef.current
        .connect(deckAHighRef.current)
        .connect(deckAMidRef.current)
        .connect(deckALowRef.current)
        .connect(deckADelayRef.current)
        .connect(deckAConvolverRef.current)
        .connect(deckAGainRef.current)
        .connect(masterGainRef.current!);

      console.log('Web Audio initialized successfully for Deck A');
      return true; // Success
    } catch (error) {
      console.warn('Web Audio initialization failed for Deck A (likely CORS issue):', error);

      // IMPORTANT: Don't clean up the source if it was created, as it disconnects audio
      // Instead, just mark that Web Audio is not available
      deckASourceRef.current = null;
      deckAHighRef.current = null;
      deckAMidRef.current = null;
      deckALowRef.current = null;
      deckADelayRef.current = null;
      deckAConvolverRef.current = null;
      deckAGainRef.current = null;

      console.log('Deck A will use HTML5 audio fallback (no effects available)');
      return false; // Failed
    }
  }, []);

  // Deck A controls
  const loadTrackToDeckA = useCallback(async (song: Song) => {
    if (!deckAAudioRef.current) return;

    console.log('Loading track to Deck A:', song.title);
    dispatch(setDeckALoading(true));
    dispatch(setDeckATrack(song));

    try {
      // Set the audio source
      const audioUrl = song.audioUrl || song.url;
      console.log('Deck A audio URL:', audioUrl);

      if (!audioUrl) {
        console.error('No audio URL found for track:', song);
        dispatch(setDeckALoading(false));
        return;
      }

      // Use the original audio URL (no CORS needed for HTML5 audio)
      console.log('Setting audio source for Deck A:', audioUrl);
      deckAAudioRef.current.src = audioUrl;

      // Don't initialize Web Audio during loading - let HTML5 audio work normally
      // Web Audio will be initialized only when user tries to use EQ/effects
      console.log('Track loaded successfully, Web Audio will be initialized on first EQ/effect use');

      const handleLoadedMetadata = () => {
        if (deckAAudioRef.current) {
          console.log('Deck A metadata loaded, duration:', deckAAudioRef.current.duration);
          console.log('Deck A audio element ready state:', deckAAudioRef.current.readyState);
          console.log('Deck A audio element can play:', deckAAudioRef.current.readyState >= 2);
          dispatch(setDeckADuration(deckAAudioRef.current.duration));
          dispatch(setDeckALoading(false));
        }
      };

      const handleError = (event: any) => {
        console.error('Error loading audio for Deck A:', event);
        console.error('Audio element error:', deckAAudioRef.current?.error);
        console.error('Audio element networkState:', deckAAudioRef.current?.networkState);
        console.error('Audio element readyState:', deckAAudioRef.current?.readyState);
        dispatch(setDeckALoading(false));
      };

      const handleTimeUpdate = () => {
        if (deckAAudioRef.current) {
          dispatch(setDeckAPosition(deckAAudioRef.current.currentTime));
        }
      };

      const handleCanPlayThrough = () => {
        console.log('Deck A can play through - audio is ready');
        if (deckAAudioRef.current) {
          console.log('Deck A final readyState:', deckAAudioRef.current.readyState);
        }
      };

      // Remove existing listeners
      deckAAudioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      deckAAudioRef.current.removeEventListener('error', handleError);
      deckAAudioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      deckAAudioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);

      // Add new listeners
      deckAAudioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
      deckAAudioRef.current.addEventListener('error', handleError, { once: true });
      deckAAudioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      deckAAudioRef.current.addEventListener('canplaythrough', handleCanPlayThrough, { once: true });

      // Add timeout fallback to prevent infinite loading
      const loadingTimeout = setTimeout(() => {
        console.warn('Loading timeout for Deck A, stopping loading state');
        dispatch(setDeckALoading(false));
      }, 10000); // 10 second timeout

      // Clear timeout when metadata loads
      const originalHandleLoadedMetadata = handleLoadedMetadata;
      const handleLoadedMetadataWithTimeout = () => {
        clearTimeout(loadingTimeout);
        originalHandleLoadedMetadata();
      };

      deckAAudioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      deckAAudioRef.current.addEventListener('loadedmetadata', handleLoadedMetadataWithTimeout, { once: true });

      // Load the audio
      deckAAudioRef.current.load();

      // Test if we can play without Web Audio (for debugging)
      console.log('Audio element after load - src:', deckAAudioRef.current.src);
      console.log('Audio element after load - readyState:', deckAAudioRef.current.readyState);

    } catch (error) {
      console.error('Error loading track to Deck A:', error);
      dispatch(setDeckALoading(false));
    }
  }, [dispatch, initializeWebAudioForDeckA]);

  const playDeckA = useCallback(async () => {
    console.log('playDeckA called');
    console.log('deckAAudioRef.current:', deckAAudioRef.current);
    console.log('musicPlayerState.deckA.currentTrack:', musicPlayerState.deckA.currentTrack);
    console.log('deckAAudioRef.current?.src:', deckAAudioRef.current?.src);
    console.log('deckAAudioRef.current?.readyState:', deckAAudioRef.current?.readyState);

    if (!deckAAudioRef.current || !musicPlayerState.deckA.currentTrack) {
      console.warn('Cannot play Deck A - missing audio ref or track');
      return;
    }

    // Check if audio source is valid
    if (!deckAAudioRef.current.src || deckAAudioRef.current.src === '') {
      console.error('Cannot play Deck A - no audio source set');
      return;
    }

    // If audio is not ready, try to load it first
    if (deckAAudioRef.current.readyState < 2) {
      console.warn('Deck A audio not ready (readyState:', deckAAudioRef.current.readyState, '), trying to load...');
      try {
        deckAAudioRef.current.load();
        console.log('Called load() on Deck A audio element');
      } catch (error) {
        console.error('Error calling load() on Deck A:', error);
      }

      // For now, try to play anyway (some browsers allow this)
      console.log('Attempting to play Deck A even though not fully ready...');
    }

    try {
      // Make sure we're not already playing
      if (!deckAAudioRef.current.paused) {
        console.log('Deck A already playing, pausing first');
        deckAAudioRef.current.pause();
      }

      console.log('Attempting to play Deck A audio...');
      const playPromise = deckAAudioRef.current.play();

      if (playPromise !== undefined) {
        await playPromise;
        dispatch(setDeckAPlaying(true));
        console.log('Deck A playing successfully');
      }
    } catch (error) {
      console.error('Error playing Deck A:', error);
      dispatch(setDeckAPlaying(false));
    }
  }, [dispatch, musicPlayerState.deckA.currentTrack]);

  const pauseDeckA = useCallback(() => {
    if (deckAAudioRef.current) {
      deckAAudioRef.current.pause();
      dispatch(setDeckAPlaying(false));
    }
  }, [dispatch]);

  const toggleDeckA = useCallback(() => {
    if (musicPlayerState.deckA.isPlaying) {
      pauseDeckA();
    } else {
      playDeckA();
    }
  }, [musicPlayerState.deckA.isPlaying, playDeckA, pauseDeckA]);

  // Initialize Web Audio nodes for Deck B with CORS fallback
  const initializeWebAudioForDeckB = useCallback(() => {
    if (!audioContextRef.current || !deckBAudioRef.current || deckBSourceRef.current) return;

    try {
      console.log('Attempting to initialize Web Audio for Deck B...');

      // Try to create MediaElementAudioSourceNode (requires CORS)
      deckBSourceRef.current = audioContextRef.current.createMediaElementSource(deckBAudioRef.current);

      // Create EQ filters
      deckBHighRef.current = audioContextRef.current.createBiquadFilter();
      deckBHighRef.current.type = 'highshelf';
      deckBHighRef.current.frequency.value = 8000;
      deckBHighRef.current.gain.value = 0;

      deckBMidRef.current = audioContextRef.current.createBiquadFilter();
      deckBMidRef.current.type = 'peaking';
      deckBMidRef.current.frequency.value = 1000;
      deckBMidRef.current.Q.value = 1;
      deckBMidRef.current.gain.value = 0;

      deckBLowRef.current = audioContextRef.current.createBiquadFilter();
      deckBLowRef.current.type = 'lowshelf';
      deckBLowRef.current.frequency.value = 200;
      deckBLowRef.current.gain.value = 0;

      // Create delay for echo
      deckBDelayRef.current = audioContextRef.current.createDelay(1.0);
      deckBDelayRef.current.delayTime.value = 0;

      // Create convolver for reverb
      deckBConvolverRef.current = audioContextRef.current.createConvolver();

      // Create gain node
      deckBGainRef.current = audioContextRef.current.createGain();

      // Connect audio chain: source -> EQ -> effects -> gain -> master
      deckBSourceRef.current
        .connect(deckBHighRef.current)
        .connect(deckBMidRef.current)
        .connect(deckBLowRef.current)
        .connect(deckBDelayRef.current)
        .connect(deckBConvolverRef.current)
        .connect(deckBGainRef.current)
        .connect(masterGainRef.current!);

      console.log('Web Audio initialized successfully for Deck B');
    } catch (error) {
      console.warn('Web Audio initialization failed for Deck B (likely CORS issue):', error);
      // Clean up partial initialization
      deckBSourceRef.current = null;
      deckBHighRef.current = null;
      deckBMidRef.current = null;
      deckBLowRef.current = null;
      deckBDelayRef.current = null;
      deckBConvolverRef.current = null;
      deckBGainRef.current = null;

      // Audio will continue to work via HTML5 audio element
      console.log('Deck B will use HTML5 audio fallback (no effects available)');
    }
  }, []);

  // Deck B controls
  const loadTrackToDeckB = useCallback(async (song: Song) => {
    if (!deckBAudioRef.current) return;

    console.log('Loading track to Deck B:', song.title);
    dispatch(setDeckBLoading(true));
    dispatch(setDeckBTrack(song));

    try {
      // Set the audio source
      const audioUrl = song.audioUrl || song.url;
      console.log('Deck B audio URL:', audioUrl);
      deckBAudioRef.current.src = audioUrl;

      // Don't initialize Web Audio during loading - let HTML5 audio work normally
      // Web Audio will be initialized only when user tries to use EQ/effects
      console.log('Track loaded successfully, Web Audio will be initialized on first EQ/effect use');

      const handleLoadedMetadata = () => {
        if (deckBAudioRef.current) {
          console.log('Deck B metadata loaded, duration:', deckBAudioRef.current.duration);
          dispatch(setDeckBDuration(deckBAudioRef.current.duration));
          dispatch(setDeckBLoading(false));
        }
      };

      const handleError = () => {
        console.error('Error loading audio for Deck B');
        dispatch(setDeckBLoading(false));
      };

      const handleTimeUpdate = () => {
        if (deckBAudioRef.current) {
          dispatch(setDeckBPosition(deckBAudioRef.current.currentTime));
        }
      };

      // Remove existing listeners
      deckBAudioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      deckBAudioRef.current.removeEventListener('error', handleError);
      deckBAudioRef.current.removeEventListener('timeupdate', handleTimeUpdate);

      // Add new listeners
      deckBAudioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
      deckBAudioRef.current.addEventListener('error', handleError, { once: true });
      deckBAudioRef.current.addEventListener('timeupdate', handleTimeUpdate);

      // Add timeout fallback to prevent infinite loading
      const loadingTimeout = setTimeout(() => {
        console.warn('Loading timeout for Deck B, stopping loading state');
        dispatch(setDeckBLoading(false));
      }, 10000); // 10 second timeout

      // Clear timeout when metadata loads
      const originalHandleLoadedMetadata = handleLoadedMetadata;
      const handleLoadedMetadataWithTimeout = () => {
        clearTimeout(loadingTimeout);
        originalHandleLoadedMetadata();
      };

      deckBAudioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      deckBAudioRef.current.addEventListener('loadedmetadata', handleLoadedMetadataWithTimeout, { once: true });

      // Load the audio
      deckBAudioRef.current.load();

    } catch (error) {
      console.error('Error loading track to Deck B:', error);
      dispatch(setDeckBLoading(false));
    }
  }, [dispatch, initializeWebAudioForDeckB]);

  const playDeckB = useCallback(async () => {
    console.log('playDeckB called');
    console.log('deckBAudioRef.current:', deckBAudioRef.current);
    console.log('musicPlayerState.deckB.currentTrack:', musicPlayerState.deckB.currentTrack);
    console.log('deckBAudioRef.current?.src:', deckBAudioRef.current?.src);
    console.log('deckBAudioRef.current?.readyState:', deckBAudioRef.current?.readyState);

    if (!deckBAudioRef.current || !musicPlayerState.deckB.currentTrack) {
      console.warn('Cannot play Deck B - missing audio ref or track');
      return;
    }

    // Check if audio source is valid
    if (!deckBAudioRef.current.src || deckBAudioRef.current.src === '') {
      console.error('Cannot play Deck B - no audio source set');
      return;
    }

    // If audio is not ready, try to load it first
    if (deckBAudioRef.current.readyState < 2) {
      console.warn('Deck B audio not ready (readyState:', deckBAudioRef.current.readyState, '), trying to load...');
      try {
        deckBAudioRef.current.load();
        console.log('Called load() on Deck B audio element');
      } catch (error) {
        console.error('Error calling load() on Deck B:', error);
      }

      // For now, try to play anyway (some browsers allow this)
      console.log('Attempting to play Deck B even though not fully ready...');
    }

    try {
      // Make sure we're not already playing
      if (!deckBAudioRef.current.paused) {
        console.log('Deck B already playing, pausing first');
        deckBAudioRef.current.pause();
      }

      console.log('Attempting to play Deck B audio...');
      const playPromise = deckBAudioRef.current.play();

      if (playPromise !== undefined) {
        await playPromise;
        dispatch(setDeckBPlaying(true));
        console.log('Deck B playing successfully');
      }
    } catch (error) {
      console.error('Error playing Deck B:', error);
      dispatch(setDeckBPlaying(false));
    }
  }, [dispatch, musicPlayerState.deckB.currentTrack]);

  const pauseDeckB = useCallback(() => {
    if (deckBAudioRef.current) {
      deckBAudioRef.current.pause();
      dispatch(setDeckBPlaying(false));
    }
  }, [dispatch]);

  const toggleDeckB = useCallback(() => {
    if (musicPlayerState.deckB.isPlaying) {
      pauseDeckB();
    } else {
      playDeckB();
    }
  }, [musicPlayerState.deckB.isPlaying, playDeckB, pauseDeckB]);

  // Volume controls (HTML5 primary, Web Audio secondary)
  const updateDeckAVolume = useCallback((volume: number) => {
    // Validate volume value
    const safeVolume = isFinite(volume) ? Math.max(0, Math.min(100, volume)) : 75;
    dispatch(setDeckAVolume(safeVolume));

    // Always update HTML5 volume for basic functionality and crossfading
    if (deckAAudioRef.current) {
      const htmlVolume = safeVolume / 100;
      deckAAudioRef.current.volume = htmlVolume;
      console.log('Deck A volume set via HTML5:', safeVolume, 'html volume:', htmlVolume);
    }

    // Also update Web Audio gain if available (for effects processing)
    if (deckAGainRef.current && audioContextRef.current) {
      const gainValue = safeVolume / 100;
      deckAGainRef.current.gain.setValueAtTime(gainValue, audioContextRef.current.currentTime);
      console.log('Deck A Web Audio gain also updated:', safeVolume);
    }
  }, [dispatch]);

  const updateDeckBVolume = useCallback((volume: number) => {
    // Validate volume value
    const safeVolume = isFinite(volume) ? Math.max(0, Math.min(100, volume)) : 75;
    dispatch(setDeckBVolume(safeVolume));

    // Always update HTML5 volume for basic functionality and crossfading
    if (deckBAudioRef.current) {
      const htmlVolume = safeVolume / 100;
      deckBAudioRef.current.volume = htmlVolume;
      console.log('Deck B volume set via HTML5:', safeVolume, 'html volume:', htmlVolume);
    }

    // Also update Web Audio gain if available (for effects processing)
    if (deckBGainRef.current && audioContextRef.current) {
      const gainValue = safeVolume / 100;
      deckBGainRef.current.gain.setValueAtTime(gainValue, audioContextRef.current.currentTime);
      console.log('Deck B Web Audio gain also updated:', safeVolume);
    }
  }, [dispatch]);

  const updateMasterVolume = useCallback((volume: number) => {
    // Validate volume value
    const safeVolume = isFinite(volume) ? Math.max(0, Math.min(100, volume)) : 75;
    dispatch(setMasterVolume(safeVolume));

    // Use Web Audio master gain if available
    if (masterGainRef.current && audioContextRef.current) {
      const gainValue = safeVolume / 100;
      masterGainRef.current.gain.setValueAtTime(gainValue, audioContextRef.current.currentTime);
      console.log('Master volume set via Web Audio:', safeVolume);
    } else {
      // Fallback: apply master volume to both HTML5 audio elements
      const deckAVolume = isFinite(musicPlayerState.deckA.volume) ? musicPlayerState.deckA.volume : 75;
      const deckBVolume = isFinite(musicPlayerState.deckB.volume) ? musicPlayerState.deckB.volume : 75;

      if (deckAAudioRef.current) {
        const finalVolume = (deckAVolume / 100) * (safeVolume / 100);
        const htmlVolume = isFinite(finalVolume) ? Math.max(0, Math.min(1, finalVolume)) : 0;
        deckAAudioRef.current.volume = htmlVolume;
      }
      if (deckBAudioRef.current) {
        const finalVolume = (deckBVolume / 100) * (safeVolume / 100);
        const htmlVolume = isFinite(finalVolume) ? Math.max(0, Math.min(1, finalVolume)) : 0;
        deckBAudioRef.current.volume = htmlVolume;
      }
      console.log('Master volume set via HTML5:', safeVolume);
    }
  }, [dispatch, musicPlayerState.deckA.volume, musicPlayerState.deckB.volume]);



  // Crossfader control (always works with HTML5 audio)
  const updateCrossfader = useCallback((value: number) => {
    dispatch(setCrossfader(value));

    // Validate input value
    const safeValue = isFinite(value) ? Math.max(0, Math.min(100, value)) : 50;

    // Apply crossfader to audio volumes using HTML5 audio (always works)
    const leftGain = Math.cos((safeValue / 100) * (Math.PI / 2));
    const rightGain = Math.sin((safeValue / 100) * (Math.PI / 2));

    // Get safe volume values
    const deckAVolume = isFinite(musicPlayerState.deckA.volume) ? musicPlayerState.deckA.volume : 75;
    const deckBVolume = isFinite(musicPlayerState.deckB.volume) ? musicPlayerState.deckB.volume : 75;
    const masterVolume = isFinite(musicPlayerState.masterVolume) ? musicPlayerState.masterVolume : 75;

    // Always use HTML5 audio for crossfading to ensure it works
    if (deckAAudioRef.current) {
      const finalVolume = leftGain * (deckAVolume / 100) * (masterVolume / 100);
      const safeVolume = isFinite(finalVolume) ? Math.max(0, Math.min(1, finalVolume)) : 0;
      deckAAudioRef.current.volume = safeVolume;
      console.log('Crossfader - Deck A volume:', safeVolume);
    }
    if (deckBAudioRef.current) {
      const finalVolume = rightGain * (deckBVolume / 100) * (masterVolume / 100);
      const safeVolume = isFinite(finalVolume) ? Math.max(0, Math.min(1, finalVolume)) : 0;
      deckBAudioRef.current.volume = safeVolume;
      console.log('Crossfader - Deck B volume:', safeVolume);
    }
  }, [dispatch, musicPlayerState.deckA.volume, musicPlayerState.deckB.volume, musicPlayerState.masterVolume]);

  // EQ controls with real audio processing
  const updateDeckAEQ = useCallback((eq: { high?: number; mid?: number; low?: number }) => {
    dispatch(setDeckAEQ(eq));

    // Try to initialize Web Audio if not already done
    if (!deckASourceRef.current && deckAAudioRef.current && audioContextRef.current && masterGainRef.current) {
      console.log('Initializing Web Audio for Deck A (triggered by EQ use)...');
      const success = initializeWebAudioForDeckA();
      if (!success) {
        console.warn('Web Audio not available for Deck A - EQ will not work');
        return;
      }
    }

    // Apply EQ to Web Audio API nodes
    if (eq.high !== undefined && deckAHighRef.current && audioContextRef.current) {
      // Convert 0-100 range to -12dB to +12dB with validation
      const safeHigh = isFinite(eq.high) ? Math.max(0, Math.min(100, eq.high)) : 50;
      const gainValue = ((safeHigh - 50) / 50) * 12;
      deckAHighRef.current.gain.setValueAtTime(gainValue, audioContextRef.current.currentTime);
      console.log('Deck A High EQ:', safeHigh, 'gain:', gainValue);
    }

    if (eq.mid !== undefined && deckAMidRef.current && audioContextRef.current) {
      const safeMid = isFinite(eq.mid) ? Math.max(0, Math.min(100, eq.mid)) : 50;
      const gainValue = ((safeMid - 50) / 50) * 12;
      deckAMidRef.current.gain.setValueAtTime(gainValue, audioContextRef.current.currentTime);
      console.log('Deck A Mid EQ:', safeMid, 'gain:', gainValue);
    }

    if (eq.low !== undefined && deckALowRef.current && audioContextRef.current) {
      const safeLow = isFinite(eq.low) ? Math.max(0, Math.min(100, eq.low)) : 50;
      const gainValue = ((safeLow - 50) / 50) * 12;
      deckALowRef.current.gain.setValueAtTime(gainValue, audioContextRef.current.currentTime);
      console.log('Deck A Low EQ:', safeLow, 'gain:', gainValue);
    }
  }, [dispatch, initializeWebAudioForDeckA]);

  const updateDeckBEQ = useCallback((eq: { high?: number; mid?: number; low?: number }) => {
    dispatch(setDeckBEQ(eq));

    // Apply EQ to Web Audio API nodes
    if (eq.high !== undefined && deckBHighRef.current && audioContextRef.current) {
      // Convert 0-100 range to -12dB to +12dB with validation
      const safeHigh = isFinite(eq.high) ? Math.max(0, Math.min(100, eq.high)) : 50;
      const gainValue = ((safeHigh - 50) / 50) * 12;
      deckBHighRef.current.gain.setValueAtTime(gainValue, audioContextRef.current.currentTime);
      console.log('Deck B High EQ:', safeHigh, 'gain:', gainValue);
    }

    if (eq.mid !== undefined && deckBMidRef.current && audioContextRef.current) {
      const safeMid = isFinite(eq.mid) ? Math.max(0, Math.min(100, eq.mid)) : 50;
      const gainValue = ((safeMid - 50) / 50) * 12;
      deckBMidRef.current.gain.setValueAtTime(gainValue, audioContextRef.current.currentTime);
      console.log('Deck B Mid EQ:', safeMid, 'gain:', gainValue);
    }

    if (eq.low !== undefined && deckBLowRef.current && audioContextRef.current) {
      const safeLow = isFinite(eq.low) ? Math.max(0, Math.min(100, eq.low)) : 50;
      const gainValue = ((safeLow - 50) / 50) * 12;
      deckBLowRef.current.gain.setValueAtTime(gainValue, audioContextRef.current.currentTime);
      console.log('Deck B Low EQ:', safeLow, 'gain:', gainValue);
    }
  }, [dispatch]);

  // Effects controls with real audio processing
  const updateDeckAEffects = useCallback((effects: { delay?: number; reverb?: number; filter?: number }) => {
    dispatch(setDeckAEffects(effects));

    // Apply delay/echo effect
    if (effects.delay !== undefined && deckADelayRef.current) {
      // Convert 0-100 range to 0-1 second delay
      const delayTime = (effects.delay / 100) * 1.0;
      deckADelayRef.current.delayTime.setValueAtTime(delayTime, audioContextRef.current?.currentTime || 0);
    }

    // Apply reverb effect (simplified - in production you'd load impulse responses)
    if (effects.reverb !== undefined && deckAConvolverRef.current && audioContextRef.current) {
      // Create a simple reverb impulse response
      const reverbTime = (effects.reverb / 100) * 3; // 0-3 seconds
      const sampleRate = audioContextRef.current.sampleRate;
      const length = sampleRate * reverbTime;
      const impulse = audioContextRef.current.createBuffer(2, length, sampleRate);

      for (let channel = 0; channel < 2; channel++) {
        const channelData = impulse.getChannelData(channel);
        for (let i = 0; i < length; i++) {
          channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
        }
      }

      deckAConvolverRef.current.buffer = impulse;
    }
  }, [dispatch]);

  const updateDeckBEffects = useCallback((effects: { delay?: number; reverb?: number; filter?: number }) => {
    dispatch(setDeckBEffects(effects));

    // Apply delay/echo effect
    if (effects.delay !== undefined && deckBDelayRef.current) {
      const delayTime = (effects.delay / 100) * 1.0;
      deckBDelayRef.current.delayTime.setValueAtTime(delayTime, audioContextRef.current?.currentTime || 0);
    }

    // Apply reverb effect
    if (effects.reverb !== undefined && deckBConvolverRef.current && audioContextRef.current) {
      const reverbTime = (effects.reverb / 100) * 3;
      const sampleRate = audioContextRef.current.sampleRate;
      const length = sampleRate * reverbTime;
      const impulse = audioContextRef.current.createBuffer(2, length, sampleRate);

      for (let channel = 0; channel < 2; channel++) {
        const channelData = impulse.getChannelData(channel);
        for (let i = 0; i < length; i++) {
          channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
        }
      }

      deckBConvolverRef.current.buffer = impulse;
    }
  }, [dispatch]);

  // Recording controls
  const toggleRecording = useCallback(() => {
    dispatch(setRecording(!musicPlayerState.isRecording));
  }, [dispatch, musicPlayerState.isRecording]);

  // BPM and sync
  const syncBPM = useCallback(() => {
    const avgBPM = (musicPlayerState.bpmA + musicPlayerState.bpmB) / 2;
    dispatch(setBPMA(avgBPM));
    dispatch(setBPMB(avgBPM));
    dispatch(setSynced(true));
  }, [dispatch, musicPlayerState.bpmA, musicPlayerState.bpmB]);

  // Reset functions
  const resetDeckAState = useCallback(() => {
    pauseDeckA();
    dispatch(resetDeckA());
  }, [dispatch, pauseDeckA]);

  const resetDeckBState = useCallback(() => {
    pauseDeckB();
    dispatch(resetDeckB());
  }, [dispatch, pauseDeckB]);

  const resetMixerState = useCallback(() => {
    dispatch(resetMixer());
  }, [dispatch]);

  // Reset all loading states (useful for debugging)
  const resetLoadingStates = useCallback(() => {
    dispatch(setDeckALoading(false));
    dispatch(setDeckBLoading(false));
    dispatch(setLoadingSongs(false));
  }, [dispatch]);

  // Test audio playback directly (for debugging)
  const testAudioPlayback = useCallback(async () => {
    console.log('Testing direct audio playback...');
    const testAudio = new Audio('https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3');
    testAudio.crossOrigin = 'anonymous';

    testAudio.addEventListener('loadedmetadata', () => {
      console.log('Test audio metadata loaded, duration:', testAudio.duration);
    });

    testAudio.addEventListener('canplay', () => {
      console.log('Test audio can play, readyState:', testAudio.readyState);
    });

    testAudio.addEventListener('error', (e) => {
      console.error('Test audio error:', e, testAudio.error);
    });

    try {
      console.log('Loading test audio...');
      testAudio.load();

      console.log('Attempting to play test audio...');
      await testAudio.play();
      console.log('Test audio playing successfully!');

      // Stop after 2 seconds
      setTimeout(() => {
        testAudio.pause();
        console.log('Test audio stopped');
      }, 2000);
    } catch (error) {
      console.error('Test audio playback failed:', error);
    }
  }, []);

  // Quick effect toggles
  const toggleDeckAEcho = useCallback(() => {
    const currentDelay = musicPlayerState.deckAEffects.delay;
    const newDelay = currentDelay > 0 ? 0 : 30; // Toggle between 0 and 30%
    updateDeckAEffects({ delay: newDelay });
  }, [musicPlayerState.deckAEffects.delay, updateDeckAEffects]);

  const toggleDeckBEcho = useCallback(() => {
    const currentDelay = musicPlayerState.deckBEffects.delay;
    const newDelay = currentDelay > 0 ? 0 : 30;
    updateDeckBEffects({ delay: newDelay });
  }, [musicPlayerState.deckBEffects.delay, updateDeckBEffects]);

  const toggleDeckAReverb = useCallback(() => {
    const currentReverb = musicPlayerState.deckAEffects.reverb;
    const newReverb = currentReverb > 0 ? 0 : 50; // Toggle between 0 and 50%
    updateDeckAEffects({ reverb: newReverb });
  }, [musicPlayerState.deckAEffects.reverb, updateDeckAEffects]);

  const toggleDeckBReverb = useCallback(() => {
    const currentReverb = musicPlayerState.deckBEffects.reverb;
    const newReverb = currentReverb > 0 ? 0 : 50;
    updateDeckBEffects({ reverb: newReverb });
  }, [musicPlayerState.deckBEffects.reverb, updateDeckBEffects]);

  // Log the final state before returning
  console.log('Final musicPlayerState before return:', musicPlayerState);

  // Ensure we have a valid state object
  if (!musicPlayerState || typeof musicPlayerState !== 'object') {
    console.error('Invalid musicPlayerState:', musicPlayerState);
    // Return a completely safe default state
    return {
      deckA: { currentTrack: null, isPlaying: false, volume: 75, position: 0, duration: 0, isLoading: false },
      deckB: { currentTrack: null, isPlaying: false, volume: 75, position: 0, duration: 0, isLoading: false },
      crossfader: 50,
      masterVolume: 75,
      deckAEQ: { high: 50, mid: 50, low: 50 },
      deckBEQ: { high: 50, mid: 50, low: 50 },
      deckAEffects: { reverb: 0, delay: 0, filter: 50, distortion: 0, chorus: 0, flanger: 0 },
      deckBEffects: { reverb: 0, delay: 0, filter: 50, distortion: 0, chorus: 0, flanger: 0 },
      djSongs: [],
      isLoadingSongs: false,
      isRecording: false,
      recordingDuration: 0,
      bpmA: 128,
      bpmB: 128,
      isSynced: false,
      loadDJSongs: () => {},
      loadTrackToDeckA: () => {},
      playDeckA: () => {},
      pauseDeckA: () => {},
      toggleDeckA: () => {},
      updateDeckAVolume: () => {},
      updateDeckAEQ: () => {},
      updateDeckAEffects: () => {},
      resetDeckAState: () => {},
      loadTrackToDeckB: () => {},
      playDeckB: () => {},
      pauseDeckB: () => {},
      toggleDeckB: () => {},
      updateDeckBVolume: () => {},
      updateDeckBEQ: () => {},
      updateDeckBEffects: () => {},
      resetDeckBState: () => {},
      updateMasterVolume: () => {},
      updateCrossfader: () => {},
      resetMixerState: () => {},
      toggleRecording: () => {},
      syncBPM: () => {},
      toggleDeckAEcho: () => {},
      toggleDeckBEcho: () => {},
      toggleDeckAReverb: () => {},
      toggleDeckBReverb: () => {},
      resetLoadingStates: () => {},
    };
  }

  return {
    // State - explicitly return individual properties with fallbacks
    deckA: musicPlayerState?.deckA || { currentTrack: null, isPlaying: false, volume: 75, position: 0, duration: 0, isLoading: false },
    deckB: musicPlayerState?.deckB || { currentTrack: null, isPlaying: false, volume: 75, position: 0, duration: 0, isLoading: false },
    crossfader: musicPlayerState?.crossfader ?? 50,
    masterVolume: musicPlayerState?.masterVolume ?? 75,
    deckAEQ: musicPlayerState?.deckAEQ || { high: 50, mid: 50, low: 50 },
    deckBEQ: musicPlayerState?.deckBEQ || { high: 50, mid: 50, low: 50 },
    deckAEffects: musicPlayerState?.deckAEffects || { reverb: 0, delay: 0, filter: 50, distortion: 0, chorus: 0, flanger: 0 },
    deckBEffects: musicPlayerState?.deckBEffects || { reverb: 0, delay: 0, filter: 50, distortion: 0, chorus: 0, flanger: 0 },
    djSongs: Array.isArray(musicPlayerState?.djSongs) ? musicPlayerState.djSongs : [],
    isLoadingSongs: musicPlayerState?.isLoadingSongs ?? false,
    isRecording: musicPlayerState?.isRecording ?? false,
    recordingDuration: musicPlayerState?.recordingDuration ?? 0,
    bpmA: musicPlayerState?.bpmA ?? 128,
    bpmB: musicPlayerState?.bpmB ?? 128,
    isSynced: musicPlayerState?.isSynced ?? false,

    // DJ Songs
    loadDJSongs,
    
    // Deck A controls
    loadTrackToDeckA,
    playDeckA,
    pauseDeckA,
    toggleDeckA,
    updateDeckAVolume,
    updateDeckAEQ,
    updateDeckAEffects,
    resetDeckAState,
    
    // Deck B controls
    loadTrackToDeckB,
    playDeckB,
    pauseDeckB,
    toggleDeckB,
    updateDeckBVolume,
    updateDeckBEQ,
    updateDeckBEffects,
    resetDeckBState,
    
    // Mixer controls
    updateMasterVolume,
    updateCrossfader,
    resetMixerState,
    
    // Recording
    toggleRecording,
    
    // BPM and sync
    syncBPM,

    // Quick effect toggles
    toggleDeckAEcho,
    toggleDeckBEcho,
    toggleDeckAReverb,
    toggleDeckBReverb,

    // Debug/utility functions
    resetLoadingStates,
    testAudioPlayback,
  };
};
