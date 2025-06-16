import React from 'react';
import { Volume2, Shuffle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MixerPanelProps {
  crossfader: number;
  masterVolume: number;
  isSynced: boolean;
  updateCrossfader: (value: number) => void;
  updateMasterVolume: (volume: number) => void;
  syncBPM: () => void;
  playSoundEffect: (effect: 'horn' | 'siren' | 'scratch' | 'whoosh' | 'laser' | 'zap') => void;
}

const MixerPanel: React.FC<MixerPanelProps> = ({
  crossfader,
  masterVolume,
  isSynced,
  updateCrossfader,
  updateMasterVolume,
  syncBPM,
  playSoundEffect,
}) => {
  return (
    <div className="glass-card p-6 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-playfair font-bold text-white mb-2">
          <span className="neon-text">Mixer</span>
        </h2>
        <p className="text-gray-300 text-sm">Professional DJ Controls</p>
      </div>

      {/* Master Volume */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Volume2 className="w-5 h-5 text-white" />
          <label className="text-white font-semibold">Master Volume</label>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={masterVolume}
          onChange={(e) => updateMasterVolume(Number(e.target.value))}
          className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-gradient"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>0</span>
          <span className="text-white font-semibold">{typeof masterVolume === 'number' ? masterVolume : 75}%</span>
          <span>100</span>
        </div>
      </div>

      {/* Crossfader */}
      <div className="mb-6">
        <label className="text-white font-semibold mb-3 block text-center">Crossfader</label>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            value={crossfader}
            onChange={(e) => updateCrossfader(Number(e.target.value))}
            className="w-full h-4 bg-gradient-to-r from-purple-500 via-gray-700 to-blue-500 rounded-lg appearance-none cursor-pointer crossfader"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span className="text-purple-400 font-semibold">A</span>
            <span className="text-white">{typeof crossfader === 'number' ? crossfader : 50}%</span>
            <span className="text-blue-400 font-semibold">B</span>
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
          } text-white font-semibold py-3`}
        >
          <Shuffle className="w-4 h-4 mr-2" />
          {isSynced ? 'BPM Synced' : 'Sync BPM'}
        </Button>
      </div>

      {/* Sound Effects */}
      <div className="mb-6">
        <h3 className="text-white font-semibold mb-3 text-center">Sound Effects</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: "Horn", color: "from-red-500 to-red-700", effect: "horn" as const },
            { name: "Siren", color: "from-yellow-500 to-yellow-700", effect: "siren" as const },
            { name: "Scratch", color: "from-green-500 to-green-700", effect: "scratch" as const },
            { name: "Whoosh", color: "from-blue-500 to-blue-700", effect: "whoosh" as const },
            { name: "Laser", color: "from-purple-500 to-purple-700", effect: "laser" as const },
            { name: "Zap", color: "from-pink-500 to-pink-700", effect: "zap" as const },
          ].map((effect, index) => (
            <Button
              key={index}
              size="sm"
              className={`bg-gradient-to-br ${effect.color} hover:scale-105 transition-transform h-10 text-white font-semibold text-xs active:scale-95`}
              onClick={() => playSoundEffect(effect.effect)}
            >
              {effect.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <div>
        <Button
          variant="outline"
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
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
