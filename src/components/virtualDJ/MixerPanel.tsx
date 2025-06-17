import React from 'react';
import { Volume2, Shuffle, RotateCcw, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface MixerPanelProps {
  crossfader: number;
  masterVolume: number;
  isSynced: boolean;
  updateCrossfader: (value: number) => void;
  updateMasterVolume: (volume: number) => void;
  syncBPM: () => void;
  playSoundEffect: (effect: 'horn' | 'siren' | 'scratch' | 'whoosh' | 'laser' | 'zap') => void;
  // Advanced effects
  deckAEffects?: any;
  updateDeckAEffects?: (effects: any) => void;
  updateDeckADelay?: (delayTime: number) => void;
  updateDeckAReverb?: (reverbLevel: number) => void;
}

const MixerPanel: React.FC<MixerPanelProps> = ({
  crossfader,
  masterVolume,
  isSynced,
  updateCrossfader,
  updateMasterVolume,
  syncBPM,
  playSoundEffect,
  deckAEffects,
  updateDeckAEffects,
  updateDeckADelay,
  updateDeckAReverb,
}) => {
  // Enhanced sound effects with play/pause
  const { soundEffects, toggleEffect, stopAllEffects } = useSoundEffects();
  return (
    <div className="glass-card p-6 animate-fade-in-up font-montserrat-light" style={{animationDelay: '0.1s'}}>

      {/* Master Volume */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Volume2 className="w-5 h-5 text-white" />
          <label className="text-white font-montserrat-bold">Master <span className="neon-text">Volume</span></label>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={masterVolume}
          onChange={(e) => updateMasterVolume(Number(e.target.value))}
          className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-gradient"
        />
        <div className="flex justify-between font-montserrat-light text-gray-400 mt-2">
          <span>0</span>
          <span className="text-white font-montserrat-bold">{typeof masterVolume === 'number' ? masterVolume : 75}%</span>
          <span>100</span>
        </div>
      </div>

      {/* Crossfader */}
      <div className="mb-6">
        <label className="text-white font-montserrat-bold mb-3 block text-center">Crossfader</label>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            value={crossfader}
            onChange={(e) => updateCrossfader(Number(e.target.value))}
            className="w-full h-4 bg-gradient-to-r from-purple-500 via-gray-700 to-blue-500 rounded-lg appearance-none cursor-pointer crossfader"
          />
          <div className="flex justify-between font-montserrat-light text-gray-400 mt-2">
            <span className="text-purple-400 font-montserrat-bold">A</span>
            <span className="text-white font-montserrat-bold">{typeof crossfader === 'number' ? crossfader : 50}%</span>
            <span className="text-blue-400 font-montserrat-bold">B</span>
          </div>
        </div>
      </div>

      {/* BPM Sync */}
      <div className="mb-6">
        <Button
          onClick={syncBPM}
          className={`w-full ${
            isSynced
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
          } text-white font-montserrat-bold py-3`}
        >
          <Shuffle className="w-4 h-4 mr-2" />
          {isSynced ? 'BPM Synced' : 'Sync BPM'}
        </Button>
      </div>

      {/* Enhanced Sound Effects with Play/Pause */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-montserrat-bold text-center">Sound Effects</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={stopAllEffects}
            className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white font-montserrat-bold"
          >
            <Square className="w-3 h-3 mr-1" />
            Stop All
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-1 max-h-48 overflow-y-auto custom-scrollbar">
          {soundEffects.map((effect, index) => {
            const colors = [
              "from-red-500 to-red-700",
              "from-yellow-500 to-yellow-700",
              "from-green-500 to-green-700",
              "from-blue-500 to-blue-700",
              "from-purple-500 to-purple-700",
              "from-pink-500 to-pink-700",
              "from-orange-500 to-orange-700",
              "from-teal-500 to-teal-700",
              "from-indigo-500 to-indigo-700",
              "from-cyan-500 to-cyan-700",
              "from-lime-500 to-lime-700",
              "from-rose-500 to-rose-700",
              "from-amber-500 to-amber-700"
            ];

            const colorClass = colors[index % colors.length];

            return (
              <Button
                key={effect.filename}
                size="sm"
                className={`bg-gradient-to-br ${colorClass} hover:scale-105 transition-transform h-8 text-white font-montserrat-bold active:scale-95 flex items-center justify-center px-1 ${
                  effect.isPlaying ? 'animate-pulse' : ''
                }`}
                onClick={() => toggleEffect(effect.filename)}
              >
                <span className="text-xs truncate flex-1 text-center">{effect.name}</span>
                <div className="ml-1">
                  {effect.isPlaying ? (
                    <Square className="w-2 h-2" />
                  ) : (
                    <Play className="w-2 h-2" />
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Advanced Effects */}
      <div className="mb-6">

        <div className="space-y-4">
          <div>
            <label className="text-white font-montserrat-light mb-1 block">Echo/Delay</label>
            <input
              type="range"
              min="0"
              max="100"
              value={deckAEffects?.delay || 0}
              onChange={(e) => {
                const value = Number(e.target.value);
                updateDeckAEffects?.({ ...deckAEffects, delay: value });
                // Convert 0-100 to 0-1 seconds for delay time
                // updateDeckADelay && updateDeckADelay(value / 100);
              }}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-purple"
            />
            <div className="font-montserrat-light text-gray-400 mt-1">{deckAEffects?.delay || 0}%</div>
          </div>

          <div>
            <label className="text-white font-montserrat-light mb-1 block">Reverb</label>
            <input
              type="range"
              min="0"
              max="100"
              value={deckAEffects?.reverb || 0}
              onChange={(e) => {
                const value = Number(e.target.value);
                updateDeckAEffects?.({ ...deckAEffects, reverb: value });
                // Apply reverb effect
                // updateDeckAReverb && updateDeckAReverb(value);
              }}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-purple"
            />
            <div className="font-montserrat-light text-gray-400 mt-1">{deckAEffects?.reverb || 0}%</div>
          </div>

          <div>
            <label className="text-white font-montserrat-light mb-1 block">Filter</label>
            <input
              type="range"
              min="0"
              max="100"
              value={deckAEffects?.filter || 50}
              onChange={(e) => updateDeckAEffects?.({ ...deckAEffects, filter: Number(e.target.value) })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-purple"
            />
            <div className="font-montserrat-light text-gray-400 mt-1">{deckAEffects?.filter || 50}%</div>
          </div>

          <div>
            <label className="text-white font-montserrat-light mb-1 block">Distortion</label>
            <input
              type="range"
              min="0"
              max="100"
              value={deckAEffects?.distortion || 0}
              onChange={(e) => updateDeckAEffects?.({ ...deckAEffects, distortion: Number(e.target.value) })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-purple"
            />
            <div className="font-montserrat-light text-gray-400 mt-1">{deckAEffects?.distortion || 0}%</div>
          </div>
        </div>

        <p className="font-montserrat-light text-gray-400 text-center mt-4">
          Real-time audio processing effects
        </p>
      </div>

      {/* Reset Button */}
      <div>
        <Button
          variant="outline"
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white font-montserrat-bold"
          onClick={() => {
            updateCrossfader(50);
            updateMasterVolume(75);
          }}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Mixer
        </Button>
      </div>
    </div>
  );
};

export default MixerPanel;
