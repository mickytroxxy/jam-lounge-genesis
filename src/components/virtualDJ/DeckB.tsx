import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Disc, Zap, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeckBProps {
  deckB: any;
  bpmB: number;
  deckBEQ: any;
  deckBEffects: any;
  toggleDeckB: () => void;
  updateDeckBVolume: (volume: number) => void;
  updateDeckBEQ: (eq: any) => void;
  updateDeckBEffects: (effects: any) => void;
  updateDeckBDelay?: (delayTime: number) => void;
  updateDeckBReverb?: (reverbLevel: number) => void;
  toggleDeckBReverb: () => void;
  toggleDeckBEcho: () => void;
}

const DeckB: React.FC<DeckBProps> = ({
  deckB,
  bpmB,
  deckBEQ,
  deckBEffects,
  toggleDeckB,
  updateDeckBVolume,
  updateDeckBEQ,
  updateDeckBEffects,
  updateDeckBDelay,
  updateDeckBReverb,
  toggleDeckBReverb,
  toggleDeckBEcho,
}) => {
  return (
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
          <div className={`w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center p-2 ${deckB.isPlaying ? 'animate-spin' : ''}`} style={{animationDuration: '3s'}}>
            {deckB.currentTrack?.albumArt ? (
              <img src={deckB.currentTrack.albumArt} alt="Album Art" className="w-full h-full rounded-full object-cover" />
            ) : (
              <Music className="w-6 h-6 text-white" />
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
              <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
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
              onChange={(e) => updateDeckBEQ({ ...deckBEQ, high: Number(e.target.value) })}
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
              onChange={(e) => updateDeckBEQ({ ...deckBEQ, mid: Number(e.target.value) })}
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
              onChange={(e) => updateDeckBEQ({ ...deckBEQ, low: Number(e.target.value) })}
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
  );
};

export default DeckB;
