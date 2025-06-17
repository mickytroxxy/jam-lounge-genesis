import React, { useEffect } from 'react';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import { useAudioLogic } from '@/hooks/useAudioLogic';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/LoginModal';

// Import VirtualDJ Components
import DJHeader from '@/components/virtualDJ/DJHeader';
import DeckA from '@/components/virtualDJ/DeckA';
import DeckB from '@/components/virtualDJ/DeckB';
import MixerPanel from '@/components/virtualDJ/MixerPanel';
import MusicLibrary from '@/components/virtualDJ/MusicLibrary';

const VirtualDJ = () => {
  const { isAuthenticated, openLoginModal } = useAuth();
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
          <h1 className="text-2xl mb-4">Loading DJ Interface...</h1>
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

        <div className="relative z-10">
          {/* Header */}
          <DJHeader />

          {/* Main DJ Interface */}
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-4 gap-4 mb-6 h-[calc(100vh-12rem)]">
              
              {/* Left Deck */}
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
              />

              {/* Center Mixer */}
              <MixerPanel
                crossfader={crossfader}
                masterVolume={masterVolume}
                isSynced={isSynced || false}
                updateCrossfader={updateCrossfader}
                updateMasterVolume={updateMasterVolume}
                syncBPM={syncBPM}
                playSoundEffect={playSoundEffect}
                deckAEffects={deckAEffects}
                updateDeckAEffects={updateDeckAEffects}
                updateDeckADelay={updateDeckADelay}
                updateDeckAReverb={updateDeckAReverb}
              />

              {/* Music Library */}
              <MusicLibrary
                songs={djSongs || []}
                isLoadingSongs={isLoadingSongs}
                loadTrackToDeckA={loadTrackToDeckA}
                loadTrackToDeckB={loadTrackToDeckB}
              />

              {/* Right Deck */}
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
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VirtualDJ;
