import React, { useEffect } from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudioLogic } from '@/hooks/useAudioLogic';
import { Song } from '@/Types';

interface DJAudioControllerProps {
  songs: Song[];
  currentDeckSong?: Song | null;
  onSongChange?: (song: Song | null) => void;
}

/**
 * Example component showing how to integrate useAudioLogic with DJ controls
 * This demonstrates the pattern for updating song states when DJ plays/pauses/stops tracks
 */
const DJAudioController: React.FC<DJAudioControllerProps> = ({
  songs,
  currentDeckSong,
  onSongChange
}) => {
  const {
    handleSongUpdate,
    currentPosition,
    currentPlayingSong,
    isPlaying,
    isSongPlaying,
    formatPosition
  } = useAudioLogic(songs);

  // Example: When DJ deck changes, update the audio logic
  useEffect(() => {
    if (currentDeckSong && currentDeckSong !== currentPlayingSong) {
      // Notify parent component of song change
      onSongChange?.(currentDeckSong);
    }
  }, [currentDeckSong, currentPlayingSong, onSongChange]);

  // Handle play action
  const handlePlay = async (song: Song, position: number = 0) => {
    await handleSongUpdate(song, 'play', position);
    console.log(`🎵 DJ started playing: ${song.title}`);
  };

  // Handle pause action
  const handlePause = async (song: Song, position: number) => {
    await handleSongUpdate(song, 'pause', position);
    console.log(`⏸️ DJ paused: ${song.title} at ${position}s`);
  };

  // Handle stop action
  const handleStop = async (song: Song) => {
    await handleSongUpdate(song, 'stop', 0);
    console.log(`⏹️ DJ stopped: ${song.title}`);
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
      <h3 className="text-white font-semibold mb-3">DJ Audio Controller</h3>
      
      {/* Current Playing Info */}
      {currentPlayingSong && (
        <div className="mb-4 p-3 bg-gray-700/50 rounded-lg border border-red-500/50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">{currentPlayingSong.title}</h4>
              <p className="text-gray-400 text-sm">{currentPlayingSong.artist}</p>
              <p className="text-red-400 text-xs mt-1">
                ● LIVE - Position: {formatPosition(currentPosition)}
              </p>
            </div>
            
            {/* Control Buttons */}
            <div className="flex gap-2">
              {isPlaying ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                  onClick={() => handlePause(currentPlayingSong, currentPosition)}
                >
                  <Pause className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
                  onClick={() => handlePlay(currentPlayingSong, currentPosition)}
                >
                  <Play className="w-4 h-4" />
                </Button>
              )}
              
              <Button
                size="sm"
                variant="outline"
                className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                onClick={() => handleStop(currentPlayingSong)}
              >
                <Square className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-xs text-gray-400 space-y-1">
        <p>• This component demonstrates useAudioLogic integration</p>
        <p>• Songs with red borders are currently playing</p>
        <p>• Songs with bids show cancel (X) button</p>
        <p>• Bid amounts replace time display</p>
        <p>• Current position updates in real-time</p>
      </div>

      {/* Integration Example */}
      <div className="mt-4 p-3 bg-blue-900/20 rounded border border-blue-500/30">
        <h4 className="text-blue-400 font-medium text-sm mb-2">Integration Example:</h4>
        <pre className="text-xs text-gray-300 overflow-x-auto">
{`// In your DJ component:
const { handleSongUpdate } = useAudioLogic(songs);

// When DJ plays a track:
await handleSongUpdate(song, 'play', currentPosition);

// When DJ pauses:
await handleSongUpdate(song, 'pause', currentPosition);

// When DJ stops:
await handleSongUpdate(song, 'stop', 0);`}
        </pre>
      </div>
    </div>
  );
};

export default DJAudioController;
