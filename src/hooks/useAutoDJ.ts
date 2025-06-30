import { useState, useEffect, useCallback, useRef } from 'react';
import { Song } from '@/Types';

interface AutoDJState {
  isEnabled: boolean;
  currentSongIndex: number;
  nextSongIndex: number;
  activeDeck: 'A' | 'B';
  isTransitioning: boolean;
  transitionProgress: number;
  transitionDuration: number; // seconds before end to start transition
  crossfadeSpeed: number; // seconds to complete crossfade
}

interface AutoDJHookProps {
  songs: Song[];
  deckA: any;
  deckB: any;
  loadTrackToDeckA: (song: Song) => void;
  loadTrackToDeckB: (song: Song) => void;
  toggleDeckA: () => void;
  toggleDeckB: () => void;
  updateCrossfader: (value: number) => void;
  crossfader: number;
  handleSongUpdate: (song: Song, action: 'play' | 'pause' | 'stop', position?: number) => void;
}

export const useAutoDJ = ({
  songs,
  deckA,
  deckB,
  loadTrackToDeckA,
  loadTrackToDeckB,
  toggleDeckA,
  toggleDeckB,
  updateCrossfader,
  crossfader,
  handleSongUpdate
}: AutoDJHookProps) => {
  const [autoDJState, setAutoDJState] = useState<AutoDJState>({
    isEnabled: false,
    currentSongIndex: 0,
    nextSongIndex: 1,
    activeDeck: 'A',
    isTransitioning: false,
    transitionProgress: 0,
    transitionDuration: 15, // Start transition 15 seconds before end (much earlier)
    crossfadeSpeed: 6 // 6 seconds to complete crossfade
  });

  const transitionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const monitorIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const bidClearingTrackerRef = useRef<Set<string>>(new Set()); // Track which songs have had bid clearing triggered

  // --- Audible Playback Time Tracking for Bid Clearing ---
  // This effect tracks the actual audible playback time for the current song on the active deck
  // and only clears the bid after 45 seconds of playback with volume > 0.05.
  const playbackTimeRef = useRef(0); // Accumulated audible playback time in seconds
  const bidClearedRef = useRef<string | null>(null); // Track which song's bid has been cleared
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Smart queue management for dynamic bid updates
  const createDynamicQueue = useCallback(() => {
    if (!autoDJState.isEnabled) {
      // If Auto DJ is not enabled, just return sorted songs
      return [...songs].sort((a, b) => {
        const bidA = a.currentBid || 0;
        const bidB = b.currentBid || 0;
        if (bidA !== bidB) {
          return bidB - bidA; // Higher bids first
        }
        return a.title.localeCompare(b.title); // Then alphabetical
      });
    }

    // Get currently playing song
    const currentPlayingSong = autoDJState.activeDeck === 'A' ? deckA.currentTrack : deckB.currentTrack;
    const nextLoadedSong = autoDJState.activeDeck === 'A' ? deckB.currentTrack : deckA.currentTrack;

    // Separate songs into categories
    const currentlyPlaying = currentPlayingSong ? [currentPlayingSong] : [];
    const nextLoaded = nextLoadedSong && nextLoadedSong.id !== currentPlayingSong?.id ? [nextLoadedSong] : [];

    // Get all other songs (not currently playing or loaded)
    const otherSongs = songs.filter(song =>
      song.id !== currentPlayingSong?.id &&
      song.id !== nextLoadedSong?.id
    );

    // Sort other songs by bid priority
    const sortedOtherSongs = otherSongs.sort((a, b) => {
      const bidA = a.currentBid || 0;
      const bidB = b.currentBid || 0;
      if (bidA !== bidB) {
        return bidB - bidA; // Higher bids first
      }
      return a.title.localeCompare(b.title); // Then alphabetical
    });

    // Check if next loaded song should be bumped by higher bids
    let finalQueue: any[] = [];

    if (currentlyPlaying.length > 0) {
      finalQueue.push(currentlyPlaying[0]);

      // Check if any other song has higher bid than next loaded song
      if (nextLoaded.length > 0) {
        const nextLoadedBid = nextLoaded[0].currentBid || 0;
        const higherBidSongs = sortedOtherSongs.filter(song => (song.currentBid || 0) > nextLoadedBid);

        if (higherBidSongs.length > 0) {
          console.log(`🚨 QUEUE UPDATE: ${higherBidSongs.length} songs with higher bids than next loaded song`);
          console.log(`📊 Next loaded: "${nextLoaded[0].title}" (${nextLoadedBid}), Highest new bid: "${higherBidSongs[0].title}" (${higherBidSongs[0].currentBid})`);

          // Add higher bid songs first, then next loaded, then remaining
          finalQueue = [
            ...currentlyPlaying,
            ...higherBidSongs,
            ...nextLoaded,
            ...sortedOtherSongs.filter(song => (song.currentBid || 0) <= nextLoadedBid)
          ];
        } else {
          // No higher bids, keep next loaded song in position
          finalQueue = [
            ...currentlyPlaying,
            ...nextLoaded,
            ...sortedOtherSongs
          ];
        }
      } else {
        // No next loaded song, just add sorted other songs
        finalQueue = [
          ...currentlyPlaying,
          ...sortedOtherSongs
        ];
      }
    } else {
      // No currently playing song, just return sorted songs
      finalQueue = [...songs].sort((a, b) => {
        const bidA = a.currentBid || 0;
        const bidB = b.currentBid || 0;
        if (bidA !== bidB) {
          return bidB - bidA;
        }
        return a.title.localeCompare(b.title);
      });
    }

    return finalQueue;
  }, [songs, autoDJState, deckA.currentTrack, deckB.currentTrack]);

  // Get dynamic queue
  const sortedSongs = createDynamicQueue();

  // Debug logging for songs and bid clearing
  console.log(`🎵 Auto DJ Hook - Raw songs: ${songs.length}, Dynamic queue: ${sortedSongs.length}`);

  // Debug bid information in Auto DJ
  const songsWithBids = songs.filter(song => song.currentBid && song.currentBid > 0);
  console.log(`💰 Auto DJ: ${songsWithBids.length} songs with active bids`);

  if (sortedSongs.length > 0) {
    console.log(`🎵 Queue #1: "${sortedSongs[0]?.title}" (Bid: ${sortedSongs[0]?.currentBid || 0})`);
    if (sortedSongs.length > 1) {
      console.log(`🎵 Queue #2: "${sortedSongs[1]?.title}" (Bid: ${sortedSongs[1]?.currentBid || 0})`);
    }
    if (sortedSongs.length > 2) {
      console.log(`🎵 Queue #3: "${sortedSongs[2]?.title}" (Bid: ${sortedSongs[2]?.currentBid || 0})`);
    }
  }

  // Helper function to safely trigger bid clearing
  const triggerBidClearing = useCallback((song: Song, context: string) => {
    if (!song || !song.id) return;

    const trackingKey = `${song.id}-${Date.now()}`;

    // Check if we've already triggered bid clearing for this song recently
    if (bidClearingTrackerRef.current.has(song.id)) {
      console.log(`⚠️ ${context}: Bid clearing already triggered for ${song.title}, skipping`);
      return;
    }

    // Only trigger if song has bids
    if (song.currentBid && song.currentBid > 0) {
      console.log(`💰 ${context}: Triggering bid clearing for: ${song.title} (Bid: ${song.currentBid})`);
      bidClearingTrackerRef.current.add(song.id);
      handleSongUpdate(song, 'play', 0);

      // Remove from tracker after 50 seconds (after bid clearing would complete)
      setTimeout(() => {
        bidClearingTrackerRef.current.delete(song.id);
        console.log(`🧹 Cleared tracking for: ${song.title}`);
      }, 50000);
    } else {
      console.log(`ℹ️ ${context}: No bid to clear for ${song.title}`);
    }
  }, [handleSongUpdate]);

  // Handle queue updates when new bids come in
  const handleQueueUpdate = useCallback(() => {
    if (!autoDJState.isEnabled || autoDJState.isTransitioning) return;

    const currentPlayingSong = autoDJState.activeDeck === 'A' ? deckA.currentTrack : deckB.currentTrack;
    const nextLoadedSong = autoDJState.activeDeck === 'A' ? deckB.currentTrack : deckA.currentTrack;

    if (!currentPlayingSong) return;

    // Find current song in new queue
    const newCurrentIndex = sortedSongs.findIndex(song => song.id === currentPlayingSong.id);
    if (newCurrentIndex === -1) return;

    // Check if next song has changed due to new bids
    const newNextIndex = newCurrentIndex + 1 < sortedSongs.length ? newCurrentIndex + 1 : 0;
    const newNextSong = sortedSongs[newNextIndex];

    // If next song changed and it's different from what's loaded
    if (newNextSong && nextLoadedSong && newNextSong.id !== nextLoadedSong.id) {
      console.log(`🔄 QUEUE UPDATE DETECTED!`);
      console.log(`📊 Old next: "${nextLoadedSong.title}" (${nextLoadedSong.currentBid || 0})`);
      console.log(`📊 New next: "${newNextSong.title}" (${newNextSong.currentBid || 0})`);

      // Load new next song to inactive deck
      const inactiveDeck = autoDJState.activeDeck === 'A' ? 'B' : 'A';
      console.log(`📀 Loading new next song "${newNextSong.title}" to Deck ${inactiveDeck}`);

      setTimeout(() => {
        if (inactiveDeck === 'A') {
          loadTrackToDeckA(newNextSong);
        } else {
          loadTrackToDeckB(newNextSong);
        }
      }, 500);

      // Update indices
      setAutoDJState(prev => ({
        ...prev,
        currentSongIndex: newCurrentIndex,
        nextSongIndex: newNextIndex
      }));
    }
  }, [autoDJState, deckA.currentTrack, deckB.currentTrack, sortedSongs, loadTrackToDeckA, loadTrackToDeckB]);

  // Monitor for queue changes (new bids)
  useEffect(() => {
    if (autoDJState.isEnabled && !autoDJState.isTransitioning) {
      handleQueueUpdate();
    }
  }, [songs, handleQueueUpdate]); // Trigger when songs array changes (new bids)

  // Get current and next songs from sorted list
  const currentSong = sortedSongs[autoDJState.currentSongIndex];
  const nextSong = sortedSongs[autoDJState.nextSongIndex];

  // Debug current/next song selection
  console.log(`🎵 Current Song Index: ${autoDJState.currentSongIndex}, Next Song Index: ${autoDJState.nextSongIndex}`);
  console.log(`🎵 Current Song: "${currentSong?.title}" (Bid: ${currentSong?.currentBid || 0})`);
  console.log(`🎵 Next Song: "${nextSong?.title}" (Bid: ${nextSong?.currentBid || 0})`);

  // Calculate time remaining in current track
  const getCurrentTrackTimeRemaining = useCallback(() => {
    const activeDeckData = autoDJState.activeDeck === 'A' ? deckA : deckB;
    if (!activeDeckData?.currentTrack || !activeDeckData?.duration || activeDeckData.duration === 0) {
      return 0;
    }

    const position = activeDeckData.position || 0;
    const duration = activeDeckData.duration;
    const remaining = duration - position;

    console.log(`⏱️ Deck ${autoDJState.activeDeck}: ${position.toFixed(1)}s / ${duration.toFixed(1)}s (${remaining.toFixed(1)}s remaining)`);

    return Math.max(0, remaining);
  }, [deckA, deckB, autoDJState.activeDeck]);

  // Start Auto DJ
  const startAutoDJ = useCallback(() => {
    console.log('🚀 AUTO DJ START FUNCTION CALLED');
    console.log(`🔍 Available songs: ${songs.length}, Sorted songs: ${sortedSongs.length}`);

    if (sortedSongs.length < 2) {
      console.warn('❌ Need at least 2 songs for Auto DJ');
      alert('Need at least 2 songs in your library to use Auto DJ');
      return;
    }

    // Check current playing state
    const deckAPlaying = deckA.isPlaying;
    const deckBPlaying = deckB.isPlaying;
    const currentTrackA = deckA.currentTrack;
    const currentTrackB = deckB.currentTrack;

    console.log(`🔍 Current state - Deck A playing: ${deckAPlaying} (${currentTrackA?.title || 'None'}), Deck B playing: ${deckBPlaying} (${currentTrackB?.title || 'None'})`);

    let activeDeck: 'A' | 'B';
    let currentSongIndex: number;
    let nextSongIndex: number;
    let currentPlayingSong: any = null;

    // Determine which deck is currently playing and find the song index
    if (deckAPlaying && currentTrackA) {
      activeDeck = 'A';
      currentPlayingSong = currentTrackA;
      console.log(`🎵 Deck A is playing: "${currentTrackA.title}"`);
    } else if (deckBPlaying && currentTrackB) {
      activeDeck = 'B';
      currentPlayingSong = currentTrackB;
      console.log(`🎵 Deck B is playing: "${currentTrackB.title}"`);
    } else {
      // No deck is playing, start from beginning
      activeDeck = 'A';
      currentSongIndex = 0;
      nextSongIndex = 1;
      console.log('🎵 No deck is playing, starting from beginning');
    }

    // Find the current song index in sorted list
    if (currentPlayingSong) {
      currentSongIndex = sortedSongs.findIndex(song => song.id === currentPlayingSong.id);
      if (currentSongIndex === -1) {
        console.log('⚠️ Current playing song not found in sorted list, starting from beginning');
        currentSongIndex = 0;
        nextSongIndex = 1;
      } else {
        nextSongIndex = (currentSongIndex + 1) % sortedSongs.length;
        console.log(`🎯 Found current song at index ${currentSongIndex}, next song will be index ${nextSongIndex}`);
        console.log(`🎵 Current: "${sortedSongs[currentSongIndex]?.title}", Next: "${sortedSongs[nextSongIndex]?.title}"`);
      }
    }

    console.log('🎵 Starting Auto DJ with', sortedSongs.length, 'songs (sorted by bid priority)');
    console.log(`🎯 Starting from index ${currentSongIndex}, next index ${nextSongIndex}`);

    // Set crossfader to the active deck
    const crossfaderPosition = activeDeck === 'A' ? 0 : 100;
    console.log(`🎚️ Setting crossfader to ${crossfaderPosition}% (full Deck ${activeDeck})`);
    updateCrossfader(crossfaderPosition);

    // Load next song to the inactive deck
    const inactiveDeck = activeDeck === 'A' ? 'B' : 'A';
    const nextSong = sortedSongs[nextSongIndex];

    if (nextSong) {
      console.log(`📀 Loading next song "${nextSong.title}" (Bid: ${nextSong.currentBid || 0}) to Deck ${inactiveDeck}`);
      setTimeout(() => {
        if (inactiveDeck === 'A') {
          loadTrackToDeckA(nextSong);
        } else {
          loadTrackToDeckB(nextSong);
        }
      }, 1000);
    }

    // Update state
    setAutoDJState(prev => ({
      ...prev,
      isEnabled: true,
      currentSongIndex,
      nextSongIndex,
      activeDeck,
      isTransitioning: false,
      transitionProgress: 0
    }));

    console.log(`🎛️ Auto DJ state updated - Active Deck: ${activeDeck}, Current Song Index: ${currentSongIndex}, Next Song Index: ${nextSongIndex}`);

    // If no deck is playing, just load the first two songs to the decks, do NOT play anything
    if (!deckAPlaying && !deckBPlaying) {
      const firstSong = sortedSongs[currentSongIndex];
      const nextSong = sortedSongs[nextSongIndex];
      if (firstSong) {
        console.log(`📀 Loading first song "${firstSong.title}" (Bid: ${firstSong.currentBid || 0}) to Deck A`);
        loadTrackToDeckA(firstSong);
      }
      if (nextSong) {
        console.log(`📀 Loading next song "${nextSong.title}" (Bid: ${nextSong.currentBid || 0}) to Deck B`);
        loadTrackToDeckB(nextSong);
      }
      // Do NOT play or toggle any deck here. User must press play manually.
      return;
    }

  }, [sortedSongs, loadTrackToDeckA, loadTrackToDeckB, updateCrossfader, toggleDeckA, deckA, deckB, triggerBidClearing]);

  // Stop Auto DJ
  const stopAutoDJ = useCallback(() => {
    console.log('🛑 Stopping Auto DJ');

    setAutoDJState(prev => ({
      ...prev,
      isEnabled: false,
      isTransitioning: false
    }));

    // Clear intervals
    if (transitionIntervalRef.current) {
      clearInterval(transitionIntervalRef.current);
      transitionIntervalRef.current = null;
    }
    if (monitorIntervalRef.current) {
      clearInterval(monitorIntervalRef.current);
      monitorIntervalRef.current = null;
    }

    // Clear bid clearing tracker
    bidClearingTrackerRef.current.clear();
    console.log('🧹 Cleared bid clearing tracker');
  }, []);

  // Start transition between decks
  const startTransition = useCallback(() => {
    if (autoDJState.isTransitioning) {
      console.log('⚠️ Transition already in progress, skipping');
      return;
    }

    const nextDeck = autoDJState.activeDeck === 'A' ? 'B' : 'A';
    console.log(`🔄 Starting transition from Deck ${autoDJState.activeDeck} to Deck ${nextDeck}`);

    // Check if next deck has a track loaded
    const nextDeckData = nextDeck === 'A' ? deckA : deckB;
    if (!nextDeckData?.currentTrack) {
      console.error(`❌ Cannot transition - Deck ${nextDeck} has no track loaded!`);
      return;
    }

    setAutoDJState(prev => ({
      ...prev,
      isTransitioning: true,
      transitionProgress: 0
    }));

    // Start playing the next deck immediately for seamless overlap
    console.log(`▶️ Starting playback on Deck ${nextDeck} for seamless transition`);

    // Get the actual next song that's loaded on the inactive deck
    const nextSongToPlay = nextDeck === 'A' ? deckA.currentTrack : deckB.currentTrack;
    console.log(`🎵 Next song to play: "${nextSongToPlay?.title}" (Bid: ${nextSongToPlay?.currentBid || 0})`);

    if (nextDeck === 'B' && !deckB.isPlaying) {
      toggleDeckB(); // Start immediately, no delay
      console.log('🎵 BOTH DECKS NOW PLAYING - Seamless overlap during crossfade');

      // Trigger bid clearing for the next song AFTER deck starts
      setTimeout(() => {
        if (nextSongToPlay && deckB.isPlaying) {
          triggerBidClearing(nextSongToPlay, 'Auto DJ Transition to B');
        }
      }, 1000); // Wait for deck to actually start

    } else if (nextDeck === 'A' && !deckA.isPlaying) {
      toggleDeckA(); // Start immediately, no delay
      console.log('🎵 BOTH DECKS NOW PLAYING - Seamless overlap during crossfade');

      // Trigger bid clearing for the next song AFTER deck starts
      setTimeout(() => {
        if (nextSongToPlay && deckA.isPlaying) {
          triggerBidClearing(nextSongToPlay, 'Auto DJ Transition to A');
        }
      }, 1000); // Wait for deck to actually start
    }

    // Animate crossfader
    const startCrossfader = crossfader;
    const targetCrossfader = autoDJState.activeDeck === 'A' ? 100 : 0;
    const crossfadeSteps = Math.max(20, autoDJState.crossfadeSpeed * 10); // Minimum 20 steps, 10 steps per second
    let currentStep = 0;

    console.log(`🎚️ Crossfading from ${startCrossfader}% to ${targetCrossfader}% over ${autoDJState.crossfadeSpeed}s`);

    transitionIntervalRef.current = setInterval(() => {
      currentStep++;
      const progress = Math.min(currentStep / crossfadeSteps, 1); // Ensure we don't exceed 1

      if (progress >= 1) {
        // Transition complete
        console.log('✅ Crossfade complete, finalizing transition...');
        updateCrossfader(targetCrossfader);

        // Stop the previous deck immediately after crossfade completes
        if (autoDJState.activeDeck === 'A') {
          console.log('⏹️ Stopping Deck A (crossfade complete)');
          toggleDeckA();
        } else {
          console.log('⏹️ Stopping Deck B (crossfade complete)');
          toggleDeckB();
        }

        // Update state - move to next song in the sorted list
        const newActiveDeck = autoDJState.activeDeck === 'A' ? 'B' : 'A';
        const newCurrentIndex = autoDJState.nextSongIndex;
        const newNextIndex = (autoDJState.nextSongIndex + 1) % sortedSongs.length;

        console.log(`🔄 Updating indices: Current ${autoDJState.currentSongIndex} → ${newCurrentIndex}, Next ${autoDJState.nextSongIndex} → ${newNextIndex}`);
        console.log(`🎵 Now Current: "${sortedSongs[newCurrentIndex]?.title}", Next Up: "${sortedSongs[newNextIndex]?.title}"`);

        setAutoDJState(prev => ({
          ...prev,
          activeDeck: newActiveDeck,
          currentSongIndex: newCurrentIndex,
          nextSongIndex: newNextIndex,
          isTransitioning: false,
          transitionProgress: 100
        }));

        // Load next song to the now-empty deck immediately
        const nextSongToLoad = sortedSongs[newNextIndex];
        if (nextSongToLoad) {
          console.log(`📀 Loading next song: "${nextSongToLoad.title}" (Bid: ${nextSongToLoad.currentBid || 0}) to Deck ${newActiveDeck === 'A' ? 'B' : 'A'}`);
          setTimeout(() => {
            if (newActiveDeck === 'A') {
              loadTrackToDeckB(nextSongToLoad);
            } else {
              loadTrackToDeckA(nextSongToLoad);
            }
          }, 500); // Reduced delay for faster loading
        }

        console.log(`✅ Transition complete. Now playing: "${sortedSongs[newCurrentIndex]?.title}" (Bid: ${sortedSongs[newCurrentIndex]?.currentBid || 0}) on Deck ${newActiveDeck}`);

        if (transitionIntervalRef.current) {
          clearInterval(transitionIntervalRef.current);
          transitionIntervalRef.current = null;
        }
      } else {
        // Smooth crossfade
        const newCrossfaderValue = startCrossfader + (targetCrossfader - startCrossfader) * progress;
        updateCrossfader(Math.round(newCrossfaderValue));

        setAutoDJState(prev => ({
          ...prev,
          transitionProgress: progress * 100
        }));

        console.log(`🎚️ Crossfader: ${Math.round(newCrossfaderValue)}% (${Math.round(progress * 100)}% complete)`);
      }
    }, 100); // Update every 100ms for smooth animation

  }, [autoDJState, crossfader, deckA.isPlaying, deckB.isPlaying, toggleDeckA, toggleDeckB, updateCrossfader, sortedSongs, loadTrackToDeckA, loadTrackToDeckB]);

  // Monitor track progress and trigger transitions
  useEffect(() => {
    if (!autoDJState.isEnabled) {
      console.log('🚫 Auto DJ monitoring stopped - not enabled');
      return;
    }

    if (autoDJState.isTransitioning) {
      console.log('🔄 Auto DJ monitoring paused - transition in progress');
      return;
    }

    // GUARD: Only monitor if a deck is actually playing
    if (!deckA.isPlaying && !deckB.isPlaying) return;

    console.log(`🎵 Auto DJ monitoring started for Deck ${autoDJState.activeDeck}`);
    console.log(`🔍 Monitoring setup - Active Deck: ${autoDJState.activeDeck}, Current Song: ${autoDJState.currentSongIndex}, Next Song: ${autoDJState.nextSongIndex}`);

    // Safety check - ensure we're monitoring the right deck
    if (autoDJState.activeDeck === 'A' && !deckA.isPlaying && deckB.isPlaying) {
      console.log('🚨 SAFETY CHECK FAILED: Should monitor Deck A but Deck B is playing!');
      console.log('🔧 Attempting to fix: stopping Deck B, starting Deck A');
      toggleDeckB(); // Stop B
      setTimeout(() => toggleDeckA(), 200); // Start A
    } else if (autoDJState.activeDeck === 'B' && !deckB.isPlaying && deckA.isPlaying) {
      console.log('🚨 SAFETY CHECK FAILED: Should monitor Deck B but Deck A is playing!');
    }

    monitorIntervalRef.current = setInterval(() => {
      const timeRemaining = getCurrentTrackTimeRemaining();
      const activeDeckData = autoDJState.activeDeck === 'A' ? deckA : deckB;

      // AGGRESSIVE DEBUGGING - Log every check
      if (activeDeckData?.currentTrack) {
        const position = activeDeckData.position || 0;
        const duration = activeDeckData.duration || 0;
        console.log(`🔍 DEBUG: Deck ${autoDJState.activeDeck} - Position: ${position.toFixed(1)}s, Duration: ${duration.toFixed(1)}s, Remaining: ${timeRemaining.toFixed(1)}s, Threshold: ${autoDJState.transitionDuration}s`);

        // Check if position is actually updating
        if (position > 0) {
          console.log(`✅ Position is updating - track is playing`);
        } else {
          console.log(`⚠️ Position is 0 - track might not be playing`);
        }
      }

      // More aggressive transition trigger - try multiple conditions
      const shouldTransition = timeRemaining > 0 && timeRemaining <= autoDJState.transitionDuration;

      if (shouldTransition) {
        console.log(`🚨 TRANSITION CONDITION MET! ${timeRemaining.toFixed(1)}s <= ${autoDJState.transitionDuration}s`);
        console.log(`⏰ STARTING TRANSITION NOW!`);
        startTransition();
      }

      // Emergency check - if track ended unexpectedly
      if (timeRemaining <= 0 && activeDeckData?.currentTrack && !autoDJState.isTransitioning) {
        console.log('🚨 EMERGENCY TRANSITION! Track ended unexpectedly');
        startTransition();
      }

      // Additional check - if we're very close to the end, force transition
      if (timeRemaining > 0 && timeRemaining <= 3 && !autoDJState.isTransitioning) {
        console.log('🚨 FORCE TRANSITION! Less than 3 seconds remaining');
        startTransition();
      }
    }, 250); // Check every 250ms for even more responsive monitoring

    return () => {
      if (monitorIntervalRef.current) {
        clearInterval(monitorIntervalRef.current);
        monitorIntervalRef.current = null;
      }
    };
  }, [autoDJState.isEnabled, autoDJState.isTransitioning, autoDJState.activeDeck, getCurrentTrackTimeRemaining, autoDJState.transitionDuration, startTransition, deckA, deckB]);

  // --- Robust 45s Play Timer for Bid Clearing ---
  useEffect(() => {
    if (!autoDJState.isEnabled) return;
    const activeDeckData = autoDJState.activeDeck === 'A' ? deckA : deckB;
    const currentSong = sortedSongs[autoDJState.currentSongIndex];
    if (!activeDeckData?.currentTrack || !currentSong) return;

    // Only run for songs with a bid
    if (!currentSong.currentBid || currentSong.currentBid <= 0) return;

    // Track play time for this song
    if (bidClearedRef.current !== currentSong.id) {
      playbackTimeRef.current = 0;
      bidClearedRef.current = null;
    }

    // Clear any previous interval
    if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current);
    }

    playbackIntervalRef.current = setInterval(() => {
      if (activeDeckData.isPlaying) {
        playbackTimeRef.current += 1;
        if (playbackTimeRef.current >= 45 && bidClearedRef.current !== currentSong.id) {
          triggerBidClearing(currentSong, '45s Play Timer');
          bidClearedRef.current = currentSong.id;
        }
      }
    }, 1000);

    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
        playbackIntervalRef.current = null;
      }
    };
  }, [autoDJState.isEnabled, autoDJState.activeDeck, deckA.currentTrack, deckB.currentTrack, sortedSongs, autoDJState.currentSongIndex, deckA.isPlaying, deckB.isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (transitionIntervalRef.current) {
        clearInterval(transitionIntervalRef.current);
      }
      if (monitorIntervalRef.current) {
        clearInterval(monitorIntervalRef.current);
      }
    };
  }, []);

  // Skip to next song manually
  const skipToNext = useCallback(() => {
    if (!autoDJState.isEnabled) return;
    
    console.log('⏭️ Manual skip to next song');
    startTransition();
  }, [autoDJState.isEnabled, startTransition]);

  // Update transition settings
  const updateTransitionDuration = useCallback((seconds: number) => {
    setAutoDJState(prev => ({
      ...prev,
      transitionDuration: Math.max(5, Math.min(30, seconds)) // Between 5-30 seconds
    }));
  }, []);

  const updateCrossfadeSpeed = useCallback((seconds: number) => {
    setAutoDJState(prev => ({
      ...prev,
      crossfadeSpeed: Math.max(2, Math.min(15, seconds)) // Between 2-15 seconds
    }));
  }, []);

  return {
    autoDJState,
    currentSong,
    nextSong,
    startAutoDJ,
    stopAutoDJ,
    skipToNext,
    updateTransitionDuration,
    updateCrossfadeSpeed,
    timeRemaining: getCurrentTrackTimeRemaining()
  };
};

// NOTE: If Deck B still plays automatically, check your Deck B component and audio element for any autoPlay attribute or .play() call on load. Deck B should only play when toggleDeckB() is called during a transition.