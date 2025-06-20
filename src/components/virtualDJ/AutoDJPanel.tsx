import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, Settings, Music, Shuffle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface AutoDJPanelProps {
  autoDJState: any;
  currentSong: any;
  nextSong: any;
  timeRemaining: number;
  startAutoDJ: () => void;
  stopAutoDJ: () => void;
  skipToNext: () => void;
  updateTransitionDuration: (seconds: number) => void;
  updateCrossfadeSpeed: (seconds: number) => void;
}

const AutoDJPanel: React.FC<AutoDJPanelProps> = ({
  autoDJState,
  currentSong,
  nextSong,
  timeRemaining,
  startAutoDJ,
  stopAutoDJ,
  skipToNext,
  updateTransitionDuration,
  updateCrossfadeSpeed
}) => {
  const [lastNextSong, setLastNextSong] = useState<any>(null);
  const [showQueueUpdate, setShowQueueUpdate] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Detect queue changes
  useEffect(() => {
    if (autoDJState.isEnabled && nextSong && lastNextSong && nextSong.id !== lastNextSong.id) {
      console.log(`🔔 Queue updated: "${lastNextSong.title}" → "${nextSong.title}"`);
      setShowQueueUpdate(true);

      // Hide notification after 5 seconds
      setTimeout(() => {
        setShowQueueUpdate(false);
      }, 5000);
    }
    setLastNextSong(nextSong);
  }, [nextSong, lastNextSong, autoDJState.isEnabled]);

  return (
    <div className="glass-card p-4 animate-fade-in-up font-montserrat-light">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Shuffle className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-montserrat-bold text-white">
          Auto <span className="neon-text">DJ</span>
        </h2>
        <div className="ml-auto">
          <Switch
            checked={autoDJState.isEnabled}
            onCheckedChange={(checked) => {
              console.log(`🎛️ Auto DJ Switch toggled: ${checked}`);
              if (checked) {
                console.log('🚀 Calling startAutoDJ()...');
                startAutoDJ();
              } else {
                console.log('🛑 Calling stopAutoDJ()...');
                stopAutoDJ();
              }
            }}
            className="data-[state=checked]:bg-green-500"
          />
        </div>
      </div>

      {/* Queue Update Notification */}
      {showQueueUpdate && (
        <div className="mb-4 p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/50 animate-pulse">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-300 text-sm font-montserrat-bold">
              Queue Updated! Higher bid moved to next position.
            </span>
          </div>
        </div>
      )}

      {/* Status Display */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 font-montserrat-light">Status:</span>
          <span className={`font-montserrat-bold ${
            autoDJState.isEnabled ? 'text-green-400' : 'text-gray-400'
          }`}>
            {autoDJState.isEnabled ? 
              (autoDJState.isTransitioning ? 'Transitioning...' : 'Active') : 
              'Inactive'
            }
          </span>
        </div>
        
        {autoDJState.isEnabled && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 font-montserrat-light">Active Deck:</span>
            <span className="text-white font-montserrat-bold">
              Deck {autoDJState.activeDeck}
            </span>
          </div>
        )}
      </div>

      {/* Current Track Info */}
      {autoDJState.isEnabled && currentSong && (
        <div className="mb-4 p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-gray-600/30">
          <div className="flex items-center gap-2 mb-2">
            <Music className="w-4 h-4 text-purple-400" />
            <span className="text-white font-montserrat-bold">Now Playing</span>
          </div>
          <div className="text-sm text-gray-300 mb-1 truncate">
            {currentSong.title}
          </div>
          <div className="text-xs text-gray-400 truncate">
            by {currentSong.artist}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">Time Remaining:</span>
            <span className={`text-sm font-montserrat-bold ${
              timeRemaining <= autoDJState.transitionDuration ? 'text-yellow-400 animate-pulse' : 'text-white'
            }`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-400">Transition at:</span>
            <span className="text-xs text-blue-400">
              {formatTime(autoDJState.transitionDuration)}
            </span>
          </div>
          {timeRemaining <= autoDJState.transitionDuration && timeRemaining > 0 && (
            <div className="mt-2 p-2 bg-yellow-500/20 rounded border border-yellow-500/50">
              <span className="text-yellow-300 text-xs font-montserrat-bold animate-pulse">
                🚨 SHOULD BE TRANSITIONING NOW!
              </span>
            </div>
          )}
        </div>
      )}

      {/* Next Track Info */}
      {autoDJState.isEnabled && nextSong && (
        <div className="mb-4 p-3 bg-gradient-to-r from-gray-600/20 to-gray-500/20 rounded-lg border border-gray-600/30">
          <div className="flex items-center gap-2 mb-2">
            <SkipForward className="w-4 h-4 text-blue-400" />
            <span className="text-white font-montserrat-bold">Up Next</span>
          </div>
          <div className="text-sm text-gray-300 mb-1 truncate">
            {nextSong.title}
          </div>
          <div className="text-xs text-gray-400 truncate">
            by {nextSong.artist}
          </div>
        </div>
      )}

      {/* Transition Progress */}
      {autoDJState.isEnabled && autoDJState.isTransitioning && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 font-montserrat-light">Transition:</span>
            <span className="text-white font-montserrat-bold">
              {Math.round(autoDJState.transitionProgress)}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-100"
              style={{ width: `${autoDJState.transitionProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="space-y-3">
        {/* Main Controls */}
        <div className="flex gap-2">
          <Button
            onClick={autoDJState.isEnabled ? stopAutoDJ : startAutoDJ}
            className={`flex-1 ${
              autoDJState.isEnabled 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            } text-white font-montserrat-bold`}
          >
            {autoDJState.isEnabled ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Stop Auto DJ
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Auto DJ
              </>
            )}
          </Button>
          
          {autoDJState.isEnabled && (
            <>
              <Button
                onClick={skipToNext}
                variant="outline"
                className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white font-montserrat-bold"
                title="Force Transition Now"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => {
                  console.log('🔧 MANUAL FORCE TRANSITION TRIGGERED');
                  skipToNext();
                }}
                variant="outline"
                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white font-montserrat-bold text-xs px-2"
                title="Debug: Force Transition"
              >
                Force
              </Button>
            </>
          )}
        </div>

        {/* Settings */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 font-montserrat-light text-sm">Settings</span>
          </div>
          
          <div>
            <label className="text-white font-montserrat-light mb-2 block text-sm">
              Transition Start: {autoDJState.transitionDuration}s before end
            </label>
            <input
              type="range"
              min="5"
              max="30"
              value={autoDJState.transitionDuration}
              onChange={(e) => updateTransitionDuration(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-purple-500 via-gray-700 to-blue-500 rounded-lg appearance-none cursor-pointer crossfader"
            />
            <div className="flex justify-between font-montserrat-light text-gray-400 mt-1 text-xs">
              <span>5s</span>
              <span>30s</span>
            </div>
          </div>

          <div>
            <label className="text-white font-montserrat-light mb-2 block text-sm">
              Crossfade Speed: {autoDJState.crossfadeSpeed}s duration
            </label>
            <input
              type="range"
              min="2"
              max="15"
              value={autoDJState.crossfadeSpeed}
              onChange={(e) => updateCrossfadeSpeed(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-purple-500 via-gray-700 to-blue-500 rounded-lg appearance-none cursor-pointer crossfader"
            />
            <div className="flex justify-between font-montserrat-light text-gray-400 mt-1 text-xs">
              <span>2s</span>
              <span>15s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      {!autoDJState.isEnabled && (
        <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
          <p className="text-blue-300 text-sm font-montserrat-light">
            Auto DJ will automatically mix your songs with smooth transitions and crossfading.
          </p>
        </div>
      )}
    </div>
  );
};

export default AutoDJPanel;
