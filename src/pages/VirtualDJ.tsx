import React, { useEffect, useState } from 'react';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import { useAudioLogic } from '@/hooks/useAudioLogic';
import { useAutoDJ } from '@/hooks/useAutoDJ';
import { useAuth } from '@/contexts/AuthContext';
import { useDispatch } from 'react-redux';
import { resetDeckA, resetDeckB } from '@/store/slices/musicPlayerSlice';
import LoginModal from '@/components/LoginModal';

// Import VirtualDJ Components
import DJHeader from '@/components/virtualDJ/DJHeader';
import DeckA from '@/components/virtualDJ/DeckA';
import DeckB from '@/components/virtualDJ/DeckB';
import MixerPanel from '@/components/virtualDJ/MixerPanel';
import MusicLibrary from '@/components/virtualDJ/MusicLibrary';
import { getSecretKeys } from '@/api';
import { setSecrets } from '@/store/slices/globalVariables';

const VirtualDJ = () => {
  const { isAuthenticated, openLoginModal } = useAuth();
  const dispatch = useDispatch();
  const {
    // State
    deckA,
    deckB,
    crossfader,
    masterVolume,
    deckAEQ,
    deckBEQ,
    djSongs,
    isLoadingSongs,
    bpmA,
    bpmB,
    isSynced,

    // Controls
    loadTrackToDeckA,
    loadTrackToDeckB,
    toggleDeckA,
    toggleDeckB,
    updateDeckAVolume,
    updateDeckBVolume,
    updateMasterVolume,
    updateCrossfader,
    updateDeckAEQ,
    updateDeckBEQ,
    updateDeckAEffects,
    updateDeckBEffects,
    updateDeckADelay,
    updateDeckAReverb,
    updateDeckBDelay,
    updateDeckBReverb,
    toggleRecording,
    syncBPM,
    unsyncBPM,

    // Effect toggles
    toggleDeckAEcho,
    toggleDeckBEcho,
    toggleDeckAReverb,
    toggleDeckBReverb,

    // Effect states
    deckAEffects,
    deckBEffects,

    // Loop and Cue controls for Deck A
    setDeckALoopIn,
    setDeckALoopOut,
    toggleDeckALoop,
    setDeckACuePoint,
    jumpToDeckACue,
    beatJumpDeckA,

    // Loop and Cue controls for Deck B
    setDeckBLoopIn,
    setDeckBLoopOut,
    toggleDeckBLoop,
    setDeckBCuePoint,
    jumpToDeckBCue,
    beatJumpDeckB,

    // Sound Effects
    playSoundEffect,
  } = useMusicPlayer();

  // Audio logic for song status updates
  const { handleSongUpdate } = useAudioLogic(djSongs || []);

  // Disco lights toggle state
  const [discoLightsEnabled, setDiscoLightsEnabled] = useState(true);

  // Reset decks on page load to prevent state/audio desync
  useEffect(() => {
    console.log('🎵 VirtualDJ page loaded - resetting deck states');
    dispatch(resetDeckA());
    dispatch(resetDeckB());
  }, []); // Only run once on mount
    
  useEffect(() => {
    (async() =>{
      const secrets = await getSecretKeys();
      if(secrets?.length > 0){
        dispatch(setSecrets(secrets[0]))
      }
    })()
  },[])
  // Listen for scratch sound effects from vinyl interaction
  useEffect(() => {
    const handleScratchEffect = () => {
      console.log('🎵 Scratch event received, playing scratch sound');
      playSoundEffect('scratch');
    };

    window.addEventListener('playScratchEffect', handleScratchEffect);

    return () => {
      window.removeEventListener('playScratchEffect', handleScratchEffect);
    };
  }, [playSoundEffect]);

  // Prevent scrolling when VirtualDJ is mounted
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Enhanced toggle functions that update song status
  const enhancedToggleDeckA = async () => {
    const wasPlaying = deckA?.isPlaying;
    const currentTrack = deckA?.currentTrack;

    // Call the original toggle function
    toggleDeckA();

    // Update song status if there's a current track
    if (currentTrack) {
      const action = wasPlaying ? 'pause' : 'play';
      const position = deckA?.position || 0;
      await handleSongUpdate(currentTrack, action, position);
    }
  };

  const enhancedToggleDeckB = async () => {
    const wasPlaying = deckB?.isPlaying;
    const currentTrack = deckB?.currentTrack;

    // Call the original toggle function
    toggleDeckB();

    // Update song status if there's a current track
    if (currentTrack) {
      const action = wasPlaying ? 'pause' : 'play';
      const position = deckB?.position || 0;
      await handleSongUpdate(currentTrack, action, position);
    }
  };

  // Auto DJ functionality
  const autoDJ = useAutoDJ({
    songs: djSongs || [],
    deckA,
    deckB,
    loadTrackToDeckA,
    loadTrackToDeckB,
    toggleDeckA: enhancedToggleDeckA,
    toggleDeckB: enhancedToggleDeckB,
    updateCrossfader,
    crossfader,
    handleSongUpdate
  });

  // Show login modal when visiting DJ page if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      openLoginModal();
    }
  }, [isAuthenticated, openLoginModal]);

  // Improved loading state - only show spinner if actually loading
  const isActuallyLoading = !deckA?.currentTrack && !deckB?.currentTrack && isLoadingSongs;

  if (isActuallyLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#222240] via-[#3a3a6a] to-[#222240] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <LoginModal />
      <div className="min-h-screen bg-gradient-to-br from-[#222240] via-[#3a3a6a] to-[#222240] select-none">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="relative z-10 flex flex-col h-screen">
          {/* Header */}
          <DJHeader
            discoLightsEnabled={discoLightsEnabled}
            onToggleDiscoLights={setDiscoLightsEnabled}
            autoDJState={autoDJ.autoDJState}
            currentSong={autoDJ.currentSong}
            nextSong={autoDJ.nextSong}
            timeRemaining={autoDJ.timeRemaining}
            startAutoDJ={autoDJ.startAutoDJ}
            stopAutoDJ={autoDJ.stopAutoDJ}
            skipToNext={autoDJ.skipToNext}
            updateTransitionDuration={autoDJ.updateTransitionDuration}
            updateCrossfadeSpeed={autoDJ.updateCrossfadeSpeed}
          />

          {/* Main DJ Interface */}
          <div className="flex-1 h-0 px-6">
            <div className="grid lg:grid-cols-4 gap-4 h-full">
              {/* Left Deck */}
              <div className="h-full overflow-auto hide-scrollbar rounded-[5px]">
                <DeckA
                  deckA={deckA}
                  bpmA={bpmA}
                  deckAEQ={deckAEQ}
                  deckAEffects={deckAEffects}
                  toggleDeckA={enhancedToggleDeckA}
                  updateDeckAVolume={updateDeckAVolume}
                  updateDeckAEQ={updateDeckAEQ}
                  toggleDeckAReverb={toggleDeckAReverb}
                  toggleDeckAEcho={toggleDeckAEcho}
                  setLoopIn={setDeckALoopIn}
                  setLoopOut={setDeckALoopOut}
                  toggleLoop={toggleDeckALoop}
                  setCuePoint={setDeckACuePoint}
                  jumpToCue={jumpToDeckACue}
                  beatJump={beatJumpDeckA}
                  discoLightsEnabled={discoLightsEnabled}
                />
              </div>

              {/* Center Mixer */}
              <div className="h-full overflow-auto hide-scrollbar rounded-[5px]">
                <MixerPanel
                  crossfader={crossfader}
                  masterVolume={masterVolume}
                  isSynced={isSynced || false}
                  updateCrossfader={updateCrossfader}
                  updateMasterVolume={updateMasterVolume}
                  syncBPM={syncBPM}
                  unsyncBPM={unsyncBPM}
                  playSoundEffect={playSoundEffect}
                  deckAEffects={deckAEffects}
                  updateDeckAEffects={updateDeckAEffects}
                  updateDeckADelay={updateDeckADelay}
                  updateDeckAReverb={updateDeckAReverb}
                />
              </div>

              {/* Music Library */}
              <div className="h-full overflow-auto hide-scrollbar rounded-[5px]">
                <MusicLibrary
                  songs={djSongs || []}
                  isLoadingSongs={isLoadingSongs}
                  loadTrackToDeckA={loadTrackToDeckA}
                  loadTrackToDeckB={loadTrackToDeckB}
                />
              </div>

              {/* Right Deck */}
              <div className="h-full overflow-auto hide-scrollbar rounded-[5px]">
                <DeckB
                  deckB={deckB}
                  bpmB={bpmB}
                  deckBEQ={deckBEQ}
                  deckBEffects={deckBEffects}
                  toggleDeckB={enhancedToggleDeckB}
                  updateDeckBVolume={updateDeckBVolume}
                  updateDeckBEQ={updateDeckBEQ}
                  updateDeckBEffects={updateDeckBEffects}
                  updateDeckBDelay={updateDeckBDelay}
                  updateDeckBReverb={updateDeckBReverb}
                  toggleDeckBReverb={toggleDeckBReverb}
                  toggleDeckBEcho={toggleDeckBEcho}
                  setLoopIn={setDeckBLoopIn}
                  setLoopOut={setDeckBLoopOut}
                  toggleLoop={toggleDeckBLoop}
                  setCuePoint={setDeckBCuePoint}
                  jumpToCue={jumpToDeckBCue}
                  beatJump={beatJumpDeckB}
                  discoLightsEnabled={discoLightsEnabled}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VirtualDJ;
