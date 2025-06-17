import React from 'react';
import { Volume2, Shuffle, RotateCcw, Play, Square, Music, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface MixerPanelProps {
  crossfader: number;
  masterVolume: number;
  isSynced: boolean;
  updateCrossfader: (value: number) => void;
  updateMasterVolume: (volume: number) => void;
  syncBPM: () => void;
  unsyncBPM: () => void;
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
  unsyncBPM,
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
          <h3 className="text-lg font-montserrat-bold text-white">
            Master <span className="neon-text">Volume</span>
          </h3>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={masterVolume}
          onChange={(e) => updateMasterVolume(Number(e.target.value))}
          className="w-full h-2 bg-gradient-to-r from-purple-500 via-gray-700 to-blue-500 rounded-lg appearance-none cursor-pointer crossfader"
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
            className="w-full h-2 bg-gradient-to-r from-purple-500 via-gray-700 to-blue-500 rounded-lg appearance-none cursor-pointer crossfader"
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
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/20 via-gray-700/20 to-blue-500/20 rounded-lg border border-gray-600/30">
          <span className="text-white font-montserrat-bold">
            {isSynced ? 'BPM Synced' : 'Sync BPM'}
          </span>
          <Switch
            checked={isSynced}
            onCheckedChange={(checked) => {
              if (checked) {
                syncBPM();
              } else {
                unsyncBPM();
              }
            }}
            className="data-[state=checked]:bg-green-500"
          />
        </div>
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
          {soundEffects.map((effect) => {
            return (
              <Button
                key={effect.filename}
                size="sm"
                className={`hover:scale-105 transition-transform h-8 text-white font-montserrat-bold active:scale-95 flex items-center justify-center px-1 border border-gray-600/30 ${
                  effect.isPlaying ? 'animate-pulse bg-[#222240]/60' : 'bg-[#222240]/40 hover:bg-[#3a3a6a]/50'
                }`}
                onClick={() => toggleEffect(effect.filename)}
              >
                <span className="text-xs truncate flex-1 text-center">{effect.name}</span>
                <div className="ml-1">
                  {effect.isPlaying ? (
                    <Square className="w-1 h-1" />
                  ) : (
                    <Play className="w-1 h-1" />
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Advanced Effects */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-white" />
          <h3 className="text-lg font-montserrat-bold text-white">
            Advanced <span className="neon-text">Effects</span>
          </h3>
        </div>

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
              className="w-full h-2 bg-gradient-to-r from-purple-500 via-gray-700 to-blue-500 rounded-lg appearance-none cursor-pointer crossfader"
            />
            <div className="flex justify-between font-montserrat-light text-gray-400 mt-1">
              <span>0</span>
              <span className="text-white font-montserrat-bold">{deckAEffects?.delay || 0}%</span>
              <span>100</span>
            </div>
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
              className="w-full h-2 bg-gradient-to-r from-purple-500 via-gray-700 to-blue-500 rounded-lg appearance-none cursor-pointer crossfader"
            />
            <div className="flex justify-between font-montserrat-light text-gray-400 mt-1">
              <span>0</span>
              <span className="text-white font-montserrat-bold">{deckAEffects?.reverb || 0}%</span>
              <span>100</span>
            </div>
          </div>

          <div>
            <label className="text-white font-montserrat-light mb-1 block">Filter</label>
            <input
              type="range"
              min="0"
              max="100"
              value={deckAEffects?.filter || 50}
              onChange={(e) => updateDeckAEffects?.({ ...deckAEffects, filter: Number(e.target.value) })}
              className="w-full h-2 bg-gradient-to-r from-purple-500 via-gray-700 to-blue-500 rounded-lg appearance-none cursor-pointer crossfader"
            />
            <div className="flex justify-between font-montserrat-light text-gray-400 mt-1">
              <span>0</span>
              <span className="text-white font-montserrat-bold">{deckAEffects?.filter || 50}%</span>
              <span>100</span>
            </div>
          </div>

          <div>
            <label className="text-white font-montserrat-light mb-1 block">Distortion</label>
            <input
              type="range"
              min="0"
              max="100"
              value={deckAEffects?.distortion || 0}
              onChange={(e) => updateDeckAEffects?.({ ...deckAEffects, distortion: Number(e.target.value) })}
              className="w-full h-2 bg-gradient-to-r from-purple-500 via-gray-700 to-blue-500 rounded-lg appearance-none cursor-pointer crossfader"
            />
            <div className="flex justify-between font-montserrat-light text-gray-400 mt-1">
              <span>0</span>
              <span className="text-white font-montserrat-bold">{deckAEffects?.distortion || 0}%</span>
              <span>100</span>
            </div>
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
