import React from 'react';
import { Button } from '@/components/ui/button';

interface SoundEffectsProps {
  playSoundEffect: (effect: 'horn' | 'siren' | 'scratch' | 'whoosh' | 'laser' | 'zap') => void;
}

const SoundEffects: React.FC<SoundEffectsProps> = ({ playSoundEffect }) => {
  const effects = [
    { name: "Air Horn", color: "from-red-500 to-red-700", effect: "horn" as const },
    { name: "Siren", color: "from-yellow-500 to-yellow-700", effect: "siren" as const },
    { name: "Scratch", color: "from-green-500 to-green-700", effect: "scratch" as const },
    { name: "Whoosh", color: "from-blue-500 to-blue-700", effect: "whoosh" as const },
    { name: "Laser", color: "from-purple-500 to-purple-700", effect: "laser" as const },
    { name: "Zap", color: "from-pink-500 to-pink-700", effect: "zap" as const },
  ];

  return (
    <div className="glass-card p-4 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
      <h3 className="text-lg font-playfair font-bold text-white mb-4 text-center">
        Sound <span className="neon-text">Effects</span>
      </h3>
      
      {/* Effect Pads */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {effects.map((effect, index) => (
          <Button
            key={index}
            size="sm"
            className={`bg-gradient-to-br ${effect.color} hover:scale-105 transition-transform h-12 text-white font-semibold text-xs active:scale-95`}
            onClick={() => playSoundEffect(effect.effect)}
          >
            {effect.name}
          </Button>
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center">
        Click any pad to trigger instant sound effects
      </p>
    </div>
  );
};

export default SoundEffects;
