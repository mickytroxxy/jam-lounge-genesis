import React from 'react';

interface AdvancedEffectsProps {
  deckAEffects: any;
  updateDeckAEffects: (effects: any) => void;
  updateDeckADelay?: (delayTime: number) => void;
  updateDeckAReverb?: (reverbLevel: number) => void;
}

const AdvancedEffects: React.FC<AdvancedEffectsProps> = ({
  deckAEffects,
  updateDeckAEffects,
  updateDeckADelay,
  updateDeckAReverb,
}) => {
  return (
    <div className="glass-card p-4 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
      <h3 className="text-lg font-playfair font-bold text-white mb-4 text-center">
        Advanced <span className="neon-text">Effects</span>
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-white text-xs mb-1 block">Echo/Delay</label>
          <input
            type="range"
            min="0"
            max="100"
            value={deckAEffects.delay}
            onChange={(e) => {
              const value = Number(e.target.value);
              updateDeckAEffects({ delay: value });
              // Convert 0-100 to 0-1 seconds for delay time
              updateDeckADelay && updateDeckADelay(value / 100);
            }}
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
            onChange={(e) => {
              const value = Number(e.target.value);
              updateDeckAEffects({ reverb: value });
              // Apply reverb effect
              updateDeckAReverb && updateDeckAReverb(value);
            }}
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

        <div>
          <label className="text-white text-xs mb-1 block">Distortion</label>
          <input
            type="range"
            min="0"
            max="100"
            value={deckAEffects.distortion}
            onChange={(e) => updateDeckAEffects({ distortion: Number(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-purple"
          />
          <div className="text-xs text-gray-400 mt-1">{typeof deckAEffects.distortion === 'number' ? deckAEffects.distortion : 0}%</div>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center mt-4">
        Real-time audio processing effects
      </p>
    </div>
  );
};

export default AdvancedEffects;
