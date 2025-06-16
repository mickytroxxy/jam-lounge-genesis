import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Volume2, Waves, Filter, Repeat, RotateCcw, Sliders, Music, Radio, Headphones } from 'lucide-react';

interface AudioEffectsProps {
  deckId: 'A' | 'B';
  color: string;
}

const AudioEffects: React.FC<AudioEffectsProps> = ({ deckId, color }) => {
  const [effects, setEffects] = useState({
    reverb: 0,
    delay: 0,
    filter: 50,
    distortion: 0,
    chorus: 0,
    flanger: 0,
  });

  const [activeEffects, setActiveEffects] = useState<string[]>([]);

  const toggleEffect = (effectName: string) => {
    setActiveEffects(prev => 
      prev.includes(effectName) 
        ? prev.filter(e => e !== effectName)
        : [...prev, effectName]
    );
  };

  const updateEffect = (effectName: string, value: number) => {
    setEffects(prev => ({ ...prev, [effectName]: value }));
  };

  const effectButtons = [
    { name: 'reverb', label: 'Reverb', icon: Waves },
    { name: 'delay', label: 'Delay', icon: Repeat },
    { name: 'filter', label: 'Filter', icon: Filter },
    { name: 'distortion', label: 'Distort', icon: Zap },
    { name: 'chorus', label: 'Chorus', icon: Music },
    { name: 'flanger', label: 'Flanger', icon: Radio },
  ];

  return (
    <div className="space-y-4">
      {/* Effect Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {effectButtons.map(({ name, label, icon: Icon }) => (
          <Button
            key={name}
            variant="outline"
            size="sm"
            onClick={() => toggleEffect(name)}
            className={`${
              activeEffects.includes(name)
                ? `bg-${color}-500 border-${color}-500 text-white`
                : `border-${color}-400 text-${color}-400 hover:bg-${color}-400 hover:text-white`
            } transition-all duration-200`}
          >
            <Icon className="w-4 h-4 mr-1" />
            {label}
          </Button>
        ))}
      </div>

      {/* Effect Controls */}
      {activeEffects.length > 0 && (
        <div className="space-y-3 bg-black/20 rounded-lg p-3">
          <h4 className="text-white text-sm font-semibold flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            Active Effects
          </h4>
          
          {activeEffects.map(effectName => (
            <div key={effectName} className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-white text-xs capitalize">{effectName}</label>
                <Badge variant="outline" className={`border-${color}-400 text-${color}-400 text-xs`}>
                  {effects[effectName as keyof typeof effects]}%
                </Badge>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={effects[effectName as keyof typeof effects]}
                onChange={(e) => updateEffect(effectName, Number(e.target.value))}
                className={`w-full h-1 bg-gray-700 rounded slider-${color.toLowerCase()}`}
              />
            </div>
          ))}
        </div>
      )}

      {/* Quick Presets */}
      <div className="space-y-2">
        <h4 className="text-white text-sm font-semibold">Quick Presets</h4>
        <div className="grid grid-cols-2 gap-1">
          <Button
            variant="outline"
            size="sm"
            className={`border-${color}-400 text-${color}-400 hover:bg-${color}-400 hover:text-white text-xs`}
            onClick={() => {
              setEffects({ reverb: 60, delay: 30, filter: 50, distortion: 0, chorus: 0, flanger: 0 });
              setActiveEffects(['reverb', 'delay']);
            }}
          >
            Club
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`border-${color}-400 text-${color}-400 hover:bg-${color}-400 hover:text-white text-xs`}
            onClick={() => {
              setEffects({ reverb: 80, delay: 50, filter: 70, distortion: 20, chorus: 40, flanger: 0 });
              setActiveEffects(['reverb', 'delay', 'filter', 'chorus']);
            }}
          >
            Ambient
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`border-${color}-400 text-${color}-400 hover:bg-${color}-400 hover:text-white text-xs`}
            onClick={() => {
              setEffects({ reverb: 20, delay: 10, filter: 30, distortion: 70, chorus: 0, flanger: 60 });
              setActiveEffects(['distortion', 'flanger']);
            }}
          >
            Hard
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`border-${color}-400 text-${color}-400 hover:bg-${color}-400 hover:text-white text-xs`}
            onClick={() => {
              setEffects({ reverb: 0, delay: 0, filter: 50, distortion: 0, chorus: 0, flanger: 0 });
              setActiveEffects([]);
            }}
          >
            Clean
          </Button>
        </div>
      </div>

      {/* Real-time Visualizer */}
      <div className="bg-black/20 rounded-lg p-3">
        <h4 className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
          <Volume2 className="w-4 h-4" />
          Audio Spectrum
        </h4>
        <div className="flex items-end gap-1 h-12">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className={`bg-gradient-to-t from-${color.toLowerCase()}-600 to-${color.toLowerCase()}-400 w-1 rounded-t`}
              style={{
                height: `${Math.random() * 100}%`,
                opacity: activeEffects.length > 0 ? 1 : 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioEffects;
