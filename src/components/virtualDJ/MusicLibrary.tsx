import React, { useState, useMemo } from 'react';
import { Music, Search, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudioLogic } from '@/hooks/useAudioLogic';
import { currencyFormatter } from '@/utils';
import { Song } from '@/Types';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';

interface MusicLibraryProps {
  songs: Song[];
  isLoadingSongs: boolean;
  loadTrackToDeckA: (song: Song) => void;
  loadTrackToDeckB: (song: Song) => void;
}

const MusicLibrary: React.FC<MusicLibraryProps> = ({
  songs,
  isLoadingSongs,
  loadTrackToDeckA,
  loadTrackToDeckB,
}) => {
  // Initialize audio logic hook
  const {
    isSongPlaying,
    songHasBids,
    getSongBidAmount,
    cancelBid
  } = useAudioLogic(songs);

  // State for confirmation dialog
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean;
    song: Song | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    song: null,
    isLoading: false
  });

  // Search state for filtering tracks
  const [search, setSearch] = useState('');

  // Memoized filtered and sorted songs to prevent expensive operations on every render
  const sortedAndFilteredSongs = useMemo(() => {
    console.log('🔄 Recalculating sorted songs list...');

    // Filter songs based on search
    const filteredSongs = songs.filter(song =>
      song.title.toLowerCase().includes(search.toLowerCase()) ||
      song.artist.toLowerCase().includes(search.toLowerCase())
    );

    // Sort songs by currentBid (highest first), then by title
    return filteredSongs.sort((a, b) => {
      const bidA = a.currentBid || 0;
      const bidB = b.currentBid || 0;
      if (bidA !== bidB) {
        return bidB - bidA; // Higher bids first
      }
      return a.title.localeCompare(b.title); // Then alphabetical
    });
  }, [songs, search]); // Only recalculate when songs array or search changes

  // Handle cancel bid click
  const handleCancelBidClick = (song: Song) => {
    setConfirmationDialog({
      isOpen: true,
      song,
      isLoading: false
    });
  };

  // Handle confirmation dialog close
  const handleDialogClose = () => {
    if (!confirmationDialog.isLoading) {
      setConfirmationDialog({
        isOpen: false,
        song: null,
        isLoading: false
      });
    }
  };

  // Handle bid cancellation confirmation
  const handleConfirmCancelBid = async () => {
    if (!confirmationDialog.song) return;

    setConfirmationDialog(prev => ({ ...prev, isLoading: true }));

    try {
      const success = await cancelBid(confirmationDialog.song);

      if (success) {
        console.log('✅ Bid canceled successfully');
        // Close dialog after successful cancellation
        setConfirmationDialog({
          isOpen: false,
          song: null,
          isLoading: false
        });
      } else {
        console.error('❌ Failed to cancel bid');
        setConfirmationDialog(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('❌ Error canceling bid:', error);
      setConfirmationDialog(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="glass-card p-4 animate-fade-in-up font-montserrat-light" style={{animationDelay: '0.5s'}}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Music className="w-5 h-5 text-white" />
        <h3 className="text-lg font-montserrat-bold text-white">
          Music <span className="neon-text">Library</span>
        </h3>
      </div>

      {/* Instructions (replaced with search) */}
      <div className="pt-3 border-t border-green-700 mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search tracks..."
          className="w-full px-3 py-2 rounded bg-gray-800 text-white text-xs border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Song List - Scrollable */}
      <div className="overflow-hidden">
        <div className="space-y-2 h-full overflow-y-auto custom-scrollbar pr-2">
        {isLoadingSongs ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 border border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-400 text-sm">Loading music library...</p>
          </div>
        ) : songs.length === 0 ? (
          <div className="text-center py-8">
            <Music className="w-12 h-12 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No tracks available</p>
          </div>
        ) : (
          // Use memoized sorted and filtered songs
          sortedAndFilteredSongs.map((song) => {
            const isPlaying = isSongPlaying(song.id);
            const hasBids = songHasBids(song.id);
            const bidAmount = getSongBidAmount(song.id);



            return (
              <div
                key={song.id}
                className={`rounded-lg p-1 hover:bg-gray-700/50 transition-colors group ${
                  isPlaying
                    ? 'bg-gray-800/50 border-2 border-red-500' // Tomato border for playing songs
                    : 'bg-gray-800/30 border-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Album Art */}
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    {song.albumArt ? (
                      <img
                        src={song.albumArt}
                        alt="Album Art"
                        className="w-full h-full rounded-lg object-cover"
                      />
                    ) : (
                      <Music className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Song Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold text-xs truncate">
                      {song.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <User className="w-3 h-3" />
                      <span className="truncate">{song.artist}</span>
                    </div>

                    {/* Show bid amount only if there are bids */}
                    {hasBids && bidAmount ? (
                      <div className="flex items-center gap-1 text-xs text-green-400 mt-1">
                        <span className="font-semibold">{currencyFormatter(bidAmount)}</span>
                      </div>
                    ) : null}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-1 items-center">
                    

                    {/* Load to deck buttons */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white text-xs px-2 py-1 h-auto"
                        onClick={() => loadTrackToDeckA(song)}
                      >
                        A
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white text-xs px-2 py-1 h-auto"
                        onClick={() => loadTrackToDeckB(song)}
                      >
                        B
                      </Button>
                    </div>

                    {/* Cancel button for songs with bids */}
                    {hasBids && bidAmount ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white text-xs px-2 py-1 h-auto"
                        onClick={() => handleCancelBidClick(song)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
        )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={handleDialogClose}
        onConfirm={handleConfirmCancelBid}
        song={confirmationDialog.song}
        isLoading={confirmationDialog.isLoading}
      />
    </div>
  );
};

export default MusicLibrary;
