import React, { useEffect } from 'react';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/LoginModal';

// Import VirtualDJ Components
import DJHeader from '@/components/virtualDJ/DJHeader';
import DeckA from '@/components/virtualDJ/DeckA';
import DeckB from '@/components/virtualDJ/DeckB';
import MixerPanel from '@/components/virtualDJ/MixerPanel';
import AdvancedEffects from '@/components/virtualDJ/AdvancedEffects';
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
    isRecording,
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

    // Sound Effects
    playSoundEffect,
  } = useMusicPlayer();

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
      <div className="min-h-screen bg-gradient-to-br from-[#222240] via-[#3a3a6a] to-[#222240]">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <DJHeader 
            isRecording={isRecording}
            toggleRecording={toggleRecording}
          />

          {/* Main DJ Interface */}
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-4 gap-4 mb-6">
              
              {/* Left Deck */}
              <DeckA
                deckA={deckA}
                bpmA={bpmA}
                deckAEQ={deckAEQ}
                deckAEffects={deckAEffects}
                toggleDeckA={toggleDeckA}
                updateDeckAVolume={updateDeckAVolume}
                updateDeckAEQ={updateDeckAEQ}
                toggleDeckAReverb={toggleDeckAReverb}
                toggleDeckAEcho={toggleDeckAEcho}
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
                toggleDeckB={toggleDeckB}
                updateDeckBVolume={updateDeckBVolume}
                updateDeckBEQ={updateDeckBEQ}
                updateDeckBEffects={updateDeckBEffects}
                updateDeckBDelay={updateDeckBDelay}
                updateDeckBReverb={updateDeckBReverb}
                toggleDeckBReverb={toggleDeckBReverb}
                toggleDeckBEcho={toggleDeckBEcho}
              />
            </div>

            {/* Bottom Effects Panel */}
            <div className="flex justify-center">
              {/* Advanced Effects */}
              <div className="w-full max-w-md">
                <AdvancedEffects
                  deckAEffects={deckAEffects}
                  updateDeckAEffects={updateDeckAEffects}
                  updateDeckADelay={updateDeckADelay}
                  updateDeckAReverb={updateDeckAReverb}
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
