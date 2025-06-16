import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, Disc, Music, Zap, Waves, Sliders } from 'lucide-react';

const DJDemo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [volume, setVolume] = useState(75);

  // Simulate beat detection
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentBeat(prev => (prev + 1) % 4);
      }, 500); // 120 BPM simulation
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="glass-card p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-playfair font-bold text-white mb-2">
          Virtual DJ <span className="neon-text">Demo</span>
        </h3>
        <p className="text-gray-300 text-sm">Experience professional mixing</p>
      </div>

      {/* Mini Vinyl */}
      <div className="relative mb-6">
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-800 to-black rounded-full border-4 border-purple-400/30 flex items-center justify-center">
          <div className={`w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`} style={{animationDuration: '3s'}}>
            <Music className="w-6 h-6 text-white" />
          </div>
        </div>
        {/* Beat indicator */}
        <div className="absolute top-2 right-2">
          <div className={`w-3 h-3 rounded-full ${currentBeat === 0 ? 'bg-red-500' : 'bg-gray-600'} transition-colors`}></div>
        </div>
      </div>

      {/* Track Info */}
      <div className="bg-gradient-to-r from-purple-500/20 to-transparent rounded-xl p-4 mb-4">
        <h4 className="text-white font-semibold text-sm">Now Playing</h4>
        <p className="text-gray-300 text-xs">Demo Track - Electronic Vibes</p>
        <div className="flex justify-between items-center mt-2">
          <Badge variant="outline" className="border-purple-400 text-purple-400 text-xs">
            128 BPM
          </Badge>
          <Badge variant="outline" className="border-green-400 text-green-400 text-xs">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
            Live
          </Badge>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Play/Pause */}
        <div className="flex justify-center">
          <Button 
            onClick={togglePlay}
            className="bg-purple-500 hover:bg-purple-600 text-white px-8"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
        </div>

        {/* Volume */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-white text-sm flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Volume
            </label>
            <span className="text-purple-400 text-sm">{volume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-purple"
          />
        </div>

        {/* Effects */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
            <Zap className="w-4 h-4 mr-1" />
            Reverb
          </Button>
          <Button variant="outline" size="sm" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
            <Waves className="w-4 h-4 mr-1" />
            Echo
          </Button>
        </div>

        {/* Mini Waveform */}
        <div className="bg-black/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            <span className="text-white text-xs">Waveform</span>
          </div>
          <div className="flex items-end gap-1 h-8">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="bg-gradient-to-t from-purple-600 to-purple-400 w-1 rounded-t transition-all duration-200"
                style={{
                  height: `${Math.random() * 100}%`,
                  opacity: isPlaying ? 1 : 0.3,
                  transform: currentBeat === i % 4 ? 'scaleY(1.5)' : 'scaleY(1)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center pt-4 border-t border-white/10">
          <p className="text-gray-400 text-xs mb-3">Experience the full Virtual DJ</p>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-6 py-2 rounded-full text-sm">
            Launch Full DJ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DJDemo;
