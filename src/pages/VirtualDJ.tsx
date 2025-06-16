import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, Volume2, Disc, Music, Zap, Shuffle, Repeat, Heart, Share2, Download, Upload, Mic, Sliders, RotateCcw, RotateCw, Waves, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import LoginModal from '@/components/LoginModal';

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

    // Debug functions
    resetLoadingStates,
    testAudioPlayback,
  } = useMusicPlayer();

  // Show login modal when visiting DJ page if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      openLoginModal();
    }
  }, [isAuthenticated, openLoginModal]);

  // Debug: Log djSongs state
  useEffect(() => {
    console.log('djSongs state:', djSongs, 'isArray:', Array.isArray(djSongs));
    console.log('deckA state:', deckA);
    console.log('deckB state:', deckB);
    console.log('bpmA:', bpmA, 'type:', typeof bpmA);
    console.log('bpmB:', bpmB, 'type:', typeof bpmB);
  }, [djSongs, deckA, deckB, bpmA, bpmB]);

  // Add safety checks for all state values
  if (!deckA || !deckB || !deckAEQ || !deckBEQ || !deckAEffects || !deckBEffects) {
    console.error('Missing required state values:', { deckA, deckB, deckAEQ, deckBEQ, deckAEffects, deckBEffects });
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#222240] via-[#3a3a6a] to-[#222240] flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl mb-4">Loading DJ Interface...</h1>
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
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
        {/* Compact Header */}
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link to="/" className="glass-card p-2 hover-lift">
                <ArrowLeft className="w-5 h-5 text-white" />
              </Link>
              <div>
                <h1 className="text-2xl lg:text-3xl font-playfair font-bold text-white">
                  PlayMyJam <span className="neon-text">DJ</span>
                </h1>
                <p className="text-gray-300 text-sm">Bid-to-Play DJ Experience</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-green-400 text-green-400 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Live
              </Badge>
              <Button
                onClick={toggleRecording}
                size="sm"
                className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
              >
                <Mic className="w-4 h-4 mr-1" />
                {isRecording ? 'Recording' : 'Record'}
              </Button>

              {/* Debug buttons - only in development */}
              {/* {process.env.NODE_ENV === 'development' && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetLoadingStates}
                    className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white text-xs"
                  >
                    Reset Loading
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={testAudioPlayback}
                    className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white text-xs"
                  >
                    Test Audio
                  </Button>
                </div>
              )} */}
            </div>
          </div>

          {/* Main DJ Interface */}
          <div className="grid lg:grid-cols-3 gap-4">
            
            {/* Left Deck */}
            <div className="glass-card p-4 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                  <Disc className="w-4 h-4 text-white animate-spin" style={{animationDuration: deckA.isPlaying ? '2s' : '0s'}} />
                </div>
                <h2 className="text-xl font-playfair font-bold text-white">Deck A</h2>
              </div>

              {/* Compact Vinyl Simulation */}
              <div className="relative mb-4">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-800 to-black rounded-full border-2 border-purple-400/30 flex items-center justify-center">
                  <div className={`w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center ${deckA.isPlaying ? 'animate-spin' : ''}`} style={{animationDuration: '3s'}}>
                    {deckA.currentTrack?.albumArt ? (
                      <img src={deckA.currentTrack.albumArt} alt="Album Art" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <Music className="w-5 h-5 text-white" />
                    )}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent rounded-full"></div>
              </div>

              {/* Track Info */}
              <div className="bg-gradient-to-r from-purple-500/20 to-transparent rounded-lg p-3 mb-4">
                <h3 className="text-white font-semibold text-sm mb-1">
                  {deckA.currentTrack ? 'Now Playing' : 'No Track Loaded'}
                </h3>
                <p className="text-gray-300 text-xs">
                  {deckA.currentTrack ? `${deckA.currentTrack.artist} - ${deckA.currentTrack.title}` : 'Select a track to play'}
                </p>
                <p className="text-purple-400 text-xs mt-1">BPM: {typeof bpmA === 'number' ? bpmA : 128}</p>
                {deckA.currentTrack && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div
                        className="bg-purple-400 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${deckA.duration > 0 ? (deckA.position / deckA.duration) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>{Math.floor(deckA.position / 60)}:{Math.floor(deckA.position % 60).toString().padStart(2, '0')}</span>
                      <span>{Math.floor(deckA.duration / 60)}:{Math.floor(deckA.duration % 60).toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Deck Controls */}
              <div className="space-y-3">
                <div className="flex justify-center gap-2">
                  <Button variant="outline" size="sm" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={toggleDeckA}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6"
                    disabled={!deckA.currentTrack || deckA.isLoading}
                  >
                    {deckA.isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : deckA.isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  <Button variant="outline" size="sm" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="space-y-2">
                  <label className="text-white text-sm">Volume</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={deckA.volume}
                    onChange={(e) => updateDeckAVolume(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-purple"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>0</span>
                    <span>{typeof deckA.volume === 'number' ? deckA.volume : 75}%</span>
                    <span>100</span>
                  </div>
                </div>

                {/* EQ Controls */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <label className="text-white text-xs">High</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={deckAEQ.high}
                      onChange={(e) => updateDeckAEQ({ high: Number(e.target.value) })}
                      className="w-full h-1 bg-gray-700 rounded slider-purple"
                    />
                  </div>
                  <div className="text-center">
                    <label className="text-white text-xs">Mid</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={deckAEQ.mid}
                      onChange={(e) => updateDeckAEQ({ mid: Number(e.target.value) })}
                      className="w-full h-1 bg-gray-700 rounded slider-purple"
                    />
                  </div>
                  <div className="text-center">
                    <label className="text-white text-xs">Low</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={deckAEQ.low}
                      onChange={(e) => updateDeckAEQ({ low: Number(e.target.value) })}
                      className="w-full h-1 bg-gray-700 rounded slider-purple"
                    />
                  </div>
                </div>

                {/* Effect Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white ${
                      deckAEffects.reverb > 0 ? 'bg-purple-400 text-white' : ''
                    }`}
                    onClick={toggleDeckAReverb}
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    Reverb
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white ${
                      deckAEffects.delay > 0 ? 'bg-purple-400 text-white' : ''
                    }`}
                    onClick={toggleDeckAEcho}
                  >
                    <Waves className="w-4 h-4 mr-1" />
                    Echo
                  </Button>
                </div>
              </div>
            </div>

            {/* Center - Bidding Music Library */}
            <div className="glass-card p-4 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                    <Music className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-xl font-playfair font-bold text-white">Bid Queue</h2>
                </div>
                <Button variant="outline" size="sm" className="border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-white">
                  <Upload className="w-3 h-3 mr-1" />
                  Upload
                </Button>
              </div>

              {/* Search Bar */}
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Search tracks..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* DJ Songs List */}
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {isLoadingSongs ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2 text-gray-400">Loading songs...</span>
                  </div>
                ) : !Array.isArray(djSongs) || djSongs.length === 0 ? (
                  <div className="text-center py-8">
                    <Music className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400">No songs available</p>
                    <p className="text-gray-500 text-sm">Upload some music to get started</p>
                  </div>
                ) : (
                  djSongs.map((track: any) => (
                    <div key={track.id} className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors cursor-pointer group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {track.albumArt && (
                            <img
                              src={track.albumArt}
                              alt={track.title}
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-white font-medium text-sm truncate">{track.title}</h4>
                              {track.active && (
                                <Badge variant="outline" className="border-green-400 text-green-400 text-xs">
                                  Active
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-400 text-xs truncate">{track.artist}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-gray-500 text-xs">
                                {track.duration ? `${Math.floor(track.duration / 60)}:${Math.floor(track.duration % 60).toString().padStart(2, '0')}` : 'Unknown'}
                              </span>
                              {track.playCount && (
                                <span className="text-gray-500 text-xs">{track.playCount} plays</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-2">
                          <div className="text-emerald-400 font-bold text-sm">
                            {track.currentBid ? `R${track.currentBid}` : 'No bids'}
                          </div>
                          <div className="text-gray-400 text-xs">
                            {track.currentBiders?.length || 0} bids
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 mt-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-white h-5 px-2 text-xs"
                              onClick={() => loadTrackToDeckA(track)}
                              disabled={deckA.isLoading}
                            >
                              A
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-white h-5 px-2 text-xs"
                              onClick={() => loadTrackToDeckB(track)}
                              disabled={deckB.isLoading}
                            >
                              B
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Mixer Controls at Bottom */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                  <Sliders className="w-4 h-4" />
                  Mixer Controls
                </h3>

                {/* Crossfader */}
                <div className="mb-3">
                  <label className="text-white text-xs mb-1 block">Crossfader</label>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={crossfader}
                      onChange={(e) => updateCrossfader(Number(e.target.value))}
                      className="w-full h-2 bg-gradient-to-r from-purple-500 via-gray-700 to-blue-500 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>A</span>
                      <span>MIX</span>
                      <span>B</span>
                    </div>
                  </div>
                </div>

                {/* Master Volume */}
                <div className="mb-3">
                  <label className="text-white text-xs mb-1 block">Master Volume</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={masterVolume}
                    onChange={(e) => updateMasterVolume(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-pink"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0</span>
                    <span>{typeof masterVolume === 'number' ? masterVolume : 75}%</span>
                    <span>100</span>
                  </div>
                </div>

                {/* BPM Sync */}
                <div className="bg-gradient-to-r from-pink-500/20 to-transparent rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-xs">BPM Sync</span>
                    <Badge variant="outline" className="border-pink-400 text-pink-400 text-xs">
                      A: {typeof bpmA === 'number' ? bpmA : 128} | B: {typeof bpmB === 'number' ? bpmB : 128}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-white flex-1 text-xs"
                      onClick={syncBPM}
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Sync BPM
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Deck */}
            <div className="glass-card p-4 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  <Disc className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-playfair font-bold text-white">Deck B</h2>
              </div>

              {/* Compact Vinyl Simulation */}
              <div className="relative mb-4">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-800 to-black rounded-full border-2 border-blue-400/30 flex items-center justify-center">
                  <div className={`w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center ${deckB.isPlaying ? 'animate-spin' : ''}`} style={{animationDuration: '3s'}}>
                    {deckB.currentTrack?.albumArt ? (
                      <img src={deckB.currentTrack.albumArt} alt="Album Art" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <Music className="w-5 h-5 text-white" />
                    )}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent rounded-full"></div>
              </div>

              {/* Track Info */}
              <div className="bg-gradient-to-r from-blue-500/20 to-transparent rounded-lg p-3 mb-4">
                <h3 className="text-white font-semibold text-sm mb-1">
                  {deckB.currentTrack ? 'Now Playing' : 'Ready to Load'}
                </h3>
                <p className="text-gray-300 text-xs">
                  {deckB.currentTrack ? `${deckB.currentTrack.artist} - ${deckB.currentTrack.title}` : 'Select a track to play'}
                </p>
                <p className="text-blue-400 text-xs mt-1">BPM: {typeof bpmB === 'number' ? bpmB : 128}</p>
                {deckB.currentTrack && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div
                        className="bg-blue-400 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${deckB.duration > 0 ? (deckB.position / deckB.duration) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>{Math.floor(deckB.position / 60)}:{Math.floor(deckB.position % 60).toString().padStart(2, '0')}</span>
                      <span>{Math.floor(deckB.duration / 60)}:{Math.floor(deckB.duration % 60).toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Deck Controls */}
              <div className="space-y-3">
                <div className="flex justify-center gap-2">
                  <Button variant="outline" size="sm" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white">
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={toggleDeckB}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6"
                    disabled={!deckB.currentTrack || deckB.isLoading}
                  >
                    {deckB.isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : deckB.isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  <Button variant="outline" size="sm" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white">
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="space-y-2">
                  <label className="text-white text-sm">Volume</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={deckB.volume}
                    onChange={(e) => updateDeckBVolume(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-blue"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>0</span>
                    <span>{typeof deckB.volume === 'number' ? deckB.volume : 75}%</span>
                    <span>100</span>
                  </div>
                </div>

                {/* EQ Controls */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <label className="text-white text-xs">High</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={deckBEQ.high}
                      onChange={(e) => updateDeckBEQ({ high: Number(e.target.value) })}
                      className="w-full h-1 bg-gray-700 rounded slider-blue"
                    />
                  </div>
                  <div className="text-center">
                    <label className="text-white text-xs">Mid</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={deckBEQ.mid}
                      onChange={(e) => updateDeckBEQ({ mid: Number(e.target.value) })}
                      className="w-full h-1 bg-gray-700 rounded slider-blue"
                    />
                  </div>
                  <div className="text-center">
                    <label className="text-white text-xs">Low</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={deckBEQ.low}
                      onChange={(e) => updateDeckBEQ({ low: Number(e.target.value) })}
                      className="w-full h-1 bg-gray-700 rounded slider-blue"
                    />
                  </div>
                </div>

                {/* Effect Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white ${
                      deckBEffects.reverb > 0 ? 'bg-blue-400 text-white' : ''
                    }`}
                    onClick={toggleDeckBReverb}
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    Reverb
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white ${
                      deckBEffects.delay > 0 ? 'bg-blue-400 text-white' : ''
                    }`}
                    onClick={toggleDeckBEcho}
                  >
                    <Waves className="w-4 h-4 mr-1" />
                    Echo
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Effects Panel */}
          <div className="mt-4 grid lg:grid-cols-2 gap-4">

            {/* Sound Effects Panel */}
            <div className="glass-card p-4 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-playfair font-bold text-white">Sound Effects</h2>
              </div>

              {/* Effect Pads */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { name: "Air Horn", color: "from-red-500 to-red-700" },
                  { name: "Siren", color: "from-yellow-500 to-yellow-700" },
                  { name: "Scratch", color: "from-green-500 to-green-700" },
                  { name: "Drop", color: "from-blue-500 to-blue-700" },
                  { name: "Laser", color: "from-purple-500 to-purple-700" },
                  { name: "Explosion", color: "from-pink-500 to-pink-700" },
                ].map((effect, index) => (
                  <Button
                    key={index}
                    size="sm"
                    className={`bg-gradient-to-br ${effect.color} hover:scale-105 transition-transform h-12 text-white font-semibold text-xs`}
                  >
                    {effect.name}
                  </Button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white text-xs">
                  <Shuffle className="w-3 h-3 mr-1" />
                  Auto Mix
                </Button>
                <Button variant="outline" size="sm" className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white text-xs">
                  <Heart className="w-3 h-3 mr-1" />
                  Favorites
                </Button>
                <Button variant="outline" size="sm" className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white text-xs">
                  <Share2 className="w-3 h-3 mr-1" />
                  Share Mix
                </Button>
                <Button variant="outline" size="sm" className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white text-xs">
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
              </div>
            </div>

            {/* Advanced Effects Panel */}
            <div className="glass-card p-4 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center">
                  <Sliders className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-playfair font-bold text-white">Advanced Effects</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Deck A Effects */}
                <div className="space-y-3">
                  <h4 className="text-purple-400 text-sm font-medium">Deck A Effects</h4>

                  <div>
                    <label className="text-white text-xs mb-1 block">Echo/Delay</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={deckAEffects.delay}
                      onChange={(e) => updateDeckAEffects({ delay: Number(e.target.value) })}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-purple"
                    />
                    <div className="text-xs text-gray-400 mt-1">{typeof deckAEffects.delay === 'number' ? deckAEffects.delay : 0}%</div>
                  </div>

                  <div>
                    <label className="text-white text-xs mb-1 block">Reverb</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={deckAEffects.reverb}
                      onChange={(e) => updateDeckAEffects({ reverb: Number(e.target.value) })}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-purple"
                    />
                    <div className="text-xs text-gray-400 mt-1">{typeof deckAEffects.reverb === 'number' ? deckAEffects.reverb : 0}%</div>
                  </div>

                  <div>
                    <label className="text-white text-xs mb-1 block">Filter</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={deckAEffects.filter}
                      onChange={(e) => updateDeckAEffects({ filter: Number(e.target.value) })}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-purple"
                    />
                    <div className="text-xs text-gray-400 mt-1">{typeof deckAEffects.filter === 'number' ? deckAEffects.filter : 50}%</div>
                  </div>
                </div>

                {/* Deck B Effects */}
                <div className="space-y-3">
                  <h4 className="text-blue-400 text-sm font-medium">Deck B Effects</h4>

                  <div>
                    <label className="text-white text-xs mb-1 block">Echo/Delay</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={deckBEffects.delay}
                      onChange={(e) => updateDeckBEffects({ delay: Number(e.target.value) })}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-blue"
                    />
                    <div className="text-xs text-gray-400 mt-1">{typeof deckBEffects.delay === 'number' ? deckBEffects.delay : 0}%</div>
                  </div>

                  <div>
                    <label className="text-white text-xs mb-1 block">Reverb</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={deckBEffects.reverb}
                      onChange={(e) => updateDeckBEffects({ reverb: Number(e.target.value) })}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-blue"
                    />
                    <div className="text-xs text-gray-400 mt-1">{typeof deckBEffects.reverb === 'number' ? deckBEffects.reverb : 0}%</div>
                  </div>

                  <div>
                    <label className="text-white text-xs mb-1 block">Filter</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={deckBEffects.filter}
                      onChange={(e) => updateDeckBEffects({ filter: Number(e.target.value) })}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-blue"
                    />
                    <div className="text-xs text-gray-400 mt-1">{typeof deckBEffects.filter === 'number' ? deckBEffects.filter : 50}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default VirtualDJ;
