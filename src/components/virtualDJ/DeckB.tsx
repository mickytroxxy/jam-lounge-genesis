import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Disc, Zap, Waves, RotateCcw, Repeat, Volume2, FastForward } from 'lucide-react';
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
  // New advanced features
  setLoopIn?: (position: number) => void;
  setLoopOut?: (position: number) => void;
  toggleLoop?: () => void;
  setCuePoint?: (position: number) => void;
  jumpToCue?: () => void;
  beatJump?: (beats: number) => void;
  toggleSlipMode?: () => void;
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
  setLoopIn,
  setLoopOut,
  toggleLoop,
  setCuePoint,
  jumpToCue,
  beatJump,
  toggleSlipMode,
}) => {
  // Local state for advanced features
  const [loopIn, setLoopInState] = useState<number | null>(null);
  const [loopOut, setLoopOutState] = useState<number | null>(null);
  const [isLooping, setIsLooping] = useState(false);
  const [cuePoint, setCuePointState] = useState<number | null>(null);
  const [isSlipMode, setIsSlipMode] = useState(false);
  const [visualizerData, setVisualizerData] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Vinyl scratching state
  const [isScratching, setIsScratching] = useState(false);
  const [lastMouseY, setLastMouseY] = useState(0);
  const [originalPlaybackRate, setOriginalPlaybackRate] = useState(1);
  const vinylRef = useRef<HTMLDivElement>(null);

  // Generate music visualizer data (simulates frequency analysis)
  useEffect(() => {
    if (deckB.isPlaying) {
      const generateVisualizerData = () => {
        const bars = 32; // Number of frequency bars around the vinyl
        const data = Array.from({ length: bars }, (_, i) => {
          // Simulate frequency data with some randomness and bass emphasis
          const bassBoost = i < 8 ? 1.5 : 1;
          const midBoost = i >= 8 && i < 16 ? 1.2 : 1;
          const trebleBoost = i >= 24 ? 1.3 : 1;

          return (Math.random() * 0.8 + 0.2) * bassBoost * midBoost * trebleBoost;
        });
        setVisualizerData(data);

        animationRef.current = requestAnimationFrame(generateVisualizerData);
      };

      generateVisualizerData();
    } else {
      // Stop animation when not playing
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Fade out visualizer
      setVisualizerData(prev => prev.map(val => val * 0.9));
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [deckB.isPlaying]);

  // Draw circular music visualizer around vinyl
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;

    ctx.clearRect(0, 0, width, height);

    if (visualizerData.length > 0) {
      const barCount = visualizerData.length;
      const angleStep = (Math.PI * 2) / barCount;

      visualizerData.forEach((amplitude, index) => {
        const angle = index * angleStep - Math.PI / 2; // Start from top
        const barHeight = amplitude * 30; // Scale the bar height

        // Calculate positions
        const innerRadius = radius - 5;
        const outerRadius = innerRadius + barHeight;

        const x1 = centerX + Math.cos(angle) * innerRadius;
        const y1 = centerY + Math.sin(angle) * innerRadius;
        const x2 = centerX + Math.cos(angle) * outerRadius;
        const y2 = centerY + Math.sin(angle) * outerRadius;

        // Create gradient for each bar (Blue theme for Deck B)
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);

        // Color based on frequency (bass = blue, mid = cyan, treble = light blue)
        if (index < 8) {
          // Bass frequencies - dark blue to blue
          gradient.addColorStop(0, '#1e40af');
          gradient.addColorStop(1, '#3b82f6');
        } else if (index < 16) {
          // Low-mid frequencies - blue
          gradient.addColorStop(0, '#3b82f6');
          gradient.addColorStop(1, '#60a5fa');
        } else if (index < 24) {
          // High-mid frequencies - blue to cyan
          gradient.addColorStop(0, '#3b82f6');
          gradient.addColorStop(1, '#06b6d4');
        } else {
          // Treble frequencies - cyan to light blue
          gradient.addColorStop(0, '#06b6d4');
          gradient.addColorStop(1, '#67e8f9');
        }

        // Draw the bar
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });
    }

    // Draw loop and cue indicators as small dots around the circle
    const indicatorRadius = radius + 35;

    if (loopIn !== null && deckB.duration > 0) {
      const progress = loopIn / deckB.duration;
      const angle = progress * Math.PI * 2 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * indicatorRadius;
      const y = centerY + Math.sin(angle) * indicatorRadius;

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    if (loopOut !== null && deckB.duration > 0) {
      const progress = loopOut / deckB.duration;
      const angle = progress * Math.PI * 2 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * indicatorRadius;
      const y = centerY + Math.sin(angle) * indicatorRadius;

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    if (cuePoint !== null && deckB.duration > 0) {
      const progress = cuePoint / deckB.duration;
      const angle = progress * Math.PI * 2 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * indicatorRadius;
      const y = centerY + Math.sin(angle) * indicatorRadius;

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Playhead indicator removed - was annoying
  }, [visualizerData, deckB.position, deckB.duration, loopIn, loopOut, cuePoint]);

  // Handler functions
  const handleSetLoopIn = () => {
    const currentPosition = deckB.position || 0;
    setLoopInState(currentPosition);
    setLoopIn?.(currentPosition);
  };

  const handleSetLoopOut = () => {
    const currentPosition = deckB.position || 0;
    setLoopOutState(currentPosition);
    setLoopOut?.(currentPosition);
  };

  const handleToggleLoop = () => {
    setIsLooping(!isLooping);
    toggleLoop?.();
  };

  const handleSetCue = () => {
    const currentPosition = deckB.position || 0;
    setCuePointState(currentPosition);
    setCuePoint?.(currentPosition);
  };

  const handleJumpToCue = () => {
    if (cuePoint !== null) {
      jumpToCue?.();
    }
  };

  const handleBeatJump = (beats: number) => {
    beatJump?.(beats);
  };

  const handleToggleSlip = () => {
    setIsSlipMode(!isSlipMode);
    toggleSlipMode?.();
  };

  // Vinyl scratching handlers
  const handleVinylMouseDown = (e: React.MouseEvent) => {
    if (!deckB.currentTrack) return;

    console.log('🎵 Deck B Vinyl scratch started');
    setIsScratching(true);
    setLastMouseY(e.clientY);

    // Pause the track using the toggle function
    if (deckB.isPlaying) {
      setOriginalPlaybackRate(1);
      toggleDeckB?.(); // This will pause the track
    }

    // Prevent text selection
    e.preventDefault();
    e.stopPropagation();
  };

  const handleVinylMouseMove = (e: React.MouseEvent) => {
    if (!isScratching || !deckB.currentTrack) return;

    const deltaY = e.clientY - lastMouseY;

    // Play scratch sound effect based on movement
    if (Math.abs(deltaY) > 5) {
      console.log('🎵 Deck B Triggering scratch sound effect');
      // Trigger scratch sound effect
      const scratchEvent = new CustomEvent('playScratchEffect');
      window.dispatchEvent(scratchEvent);
    }

    setLastMouseY(e.clientY);
    e.preventDefault();
    e.stopPropagation();
  };

  const handleVinylMouseUp = () => {
    if (!isScratching) return;

    console.log('🎵 Deck B Vinyl scratch ended');
    setIsScratching(false);

    // Resume playback if it was playing before scratching
    if (originalPlaybackRate > 0 && !deckB.isPlaying) {
      toggleDeckB?.(); // This will resume the track
    }
  };

  // Add global mouse up listener for when mouse leaves vinyl area
  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isScratching) {
        handleVinylMouseUp();
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('mouseleave', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mouseleave', handleGlobalMouseUp);
    };
  }, [isScratching, deckB.isPlaying, originalPlaybackRate]);

  return (
    <div className="glass-card p-4 animate-fade-in-up font-montserrat-light" style={{animationDelay: '0.2s'}}>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
          <Disc className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl font-montserrat-bold text-white">Deck B</h2>
      </div>

      {/* Vinyl with Music Visualizer */}
      <div className="relative mb-8 flex items-center justify-center">
        {/* Music Visualizer Canvas - positioned behind vinyl */}
        <canvas
          ref={canvasRef}
          width={180}
          height={180}
          className="absolute w-45 h-45 pointer-events-none"
          style={{ zIndex: 1 }}
        />

        {/* Vinyl Simulation - positioned on top of visualizer with scratching */}
        <div
          ref={vinylRef}
          className={`relative w-32 h-32 bg-gradient-to-br from-gray-800 to-black rounded-full border-2 ${
            isScratching ? 'border-red-500' : 'border-blue-400/30'
          } flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors`}
          style={{ zIndex: 2 }}
          onMouseDown={handleVinylMouseDown}
          onMouseMove={handleVinylMouseMove}
          onMouseUp={handleVinylMouseUp}
        >
          <div className={`w-28 h-28 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center p-2 ${
            deckB.isPlaying && !isScratching ? 'animate-spin' : ''
          }`} style={{animationDuration: '3s'}}>
            {deckB.currentTrack?.albumArt ? (
              <img src={deckB.currentTrack.albumArt} alt="Album Art" className="w-full h-full rounded-full object-cover" />
            ) : (
              <Music className="w-6 h-6 text-white" />
            )}
          </div>

          {/* Scratch indicator */}
          {isScratching && (
            <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-pulse" />
          )}
        </div>
      </div>

      {/* Track Info */}
      <div className="bg-gradient-to-r from-blue-500/20 to-transparent rounded-lg p-3 mb-4">
        <p className="text-gray-300 text-xs">
          {deckB.currentTrack ? `${deckB.currentTrack.artist} - ${deckB.currentTrack.title}` : 'Select a track to play'}
        </p>
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

        
        {/* Advanced Controls */}
        <div className="grid grid-cols-4 gap-1 mb-3">
          {/* Loop Controls */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSetLoopIn}
            className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white text-xs px-1"
          >
            IN
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSetLoopOut}
            className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white text-xs px-1"
          >
            OUT
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleLoop}
            className={`border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white text-xs px-1 ${
              isLooping ? 'bg-blue-400 text-white' : ''
            }`}
          >
            <Repeat className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSetCue}
            className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white text-xs px-1"
          >
            <Volume2 className="w-3 h-3" />
          </Button>
        </div>

        {/* Beat Jump & Slip Mode */}
        <div className="grid grid-cols-4 gap-1 mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBeatJump(-4)}
            className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white text-xs px-1"
          >
            -4
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBeatJump(-1)}
            className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white text-xs px-1"
          >
            -1
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBeatJump(1)}
            className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white text-xs px-1"
          >
            +1
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBeatJump(4)}
            className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white text-xs px-1"
          >
            +4
          </Button>
        </div>

        {/* Cue & Slip Mode */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleJumpToCue}
            className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"
            disabled={cuePoint === null}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            CUE
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleSlip}
            className={`border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white ${
              isSlipMode ? 'bg-blue-400 text-white' : ''
            }`}
          >
            <FastForward className="w-4 h-4 mr-1" />
            SLIP
          </Button>
        </div>

        
      </div>
    </div>
  );
};

export default DeckB;
