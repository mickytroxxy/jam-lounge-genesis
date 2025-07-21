import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addOrUpdateSong, setDJSongs, batchUpdateSongs } from '@/store/slices/musicPlayerSlice';
import { Song } from '@/Types';
import { Button } from '@/components/ui/button';

// Mock song generator for testing
const generateMockSong = (id: string, title: string, bid: number = 0): Song => ({
  id,
  title,
  artist: 'Test Artist',
  albumArt: '',
  url: 'test-url',
  currentBid: bid,
  currentBiders: bid > 0 ? [{ userId: 'test-user', amount: bid }] : [],
  active: true,
  isLocal: false,
  audioUrl: 'test-audio-url',
  ownerId: 'test-owner',
  ownerName: 'Test Owner',
  playCount: 0,
  DJCurrentSong: false,
  action: 'stop' as const,
  isPlaying: false,
  currentPosition: 0,
  isSuggested: false,
  duration: 180
});

const PerformanceTest: React.FC = () => {
  const dispatch = useAppDispatch();
  const songs = useAppSelector(state => state.musicPlayerSlice.djSongs);
  const [renderCount, setRenderCount] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);

  // Track renders
  useEffect(() => {
    setRenderCount(prev => prev + 1);
    setLastUpdateTime(Date.now());
  });

  // Test functions
  const testBulkLoad = () => {
    console.log('🧪 Testing bulk load (old method)...');
    const startTime = performance.now();
    
    const mockSongs = Array.from({ length: 100 }, (_, i) => 
      generateMockSong(`bulk-${i}`, `Bulk Song ${i}`, Math.random() * 100)
    );
    
    dispatch(setDJSongs(mockSongs));
    
    const endTime = performance.now();
    console.log(`⏱️ Bulk load took ${endTime - startTime}ms`);
  };

  const testIncrementalAdd = () => {
    console.log('🧪 Testing incremental add (new method)...');
    const startTime = performance.now();
    
    // Add 10 songs incrementally
    for (let i = 0; i < 10; i++) {
      const newSong = generateMockSong(`incremental-${i}`, `Incremental Song ${i}`, Math.random() * 100);
      dispatch(addOrUpdateSong(newSong));
    }
    
    const endTime = performance.now();
    console.log(`⏱️ Incremental add took ${endTime - startTime}ms`);
  };

  const testBidUpdate = () => {
    console.log('🧪 Testing bid update...');
    const startTime = performance.now();
    
    if (songs.length > 0) {
      const songToUpdate = { ...songs[0], currentBid: Math.random() * 200 };
      dispatch(addOrUpdateSong(songToUpdate));
    }
    
    const endTime = performance.now();
    console.log(`⏱️ Bid update took ${endTime - startTime}ms`);
  };

  const testBatchUpdate = () => {
    console.log('🧪 Testing batch update...');
    const startTime = performance.now();
    
    const updates = songs.slice(0, 5).map(song => ({
      ...song,
      currentBid: Math.random() * 150
    }));
    
    dispatch(batchUpdateSongs(updates));
    
    const endTime = performance.now();
    console.log(`⏱️ Batch update took ${endTime - startTime}ms`);
  };

  const clearSongs = () => {
    dispatch(setDJSongs([]));
    setRenderCount(0);
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Performance Test Dashboard</h2>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-lg font-semibold">Songs Count</h3>
          <p className="text-2xl text-green-400">{songs.length}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-lg font-semibold">Render Count</h3>
          <p className="text-2xl text-blue-400">{renderCount}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-lg font-semibold">Last Update</h3>
          <p className="text-sm text-gray-400">
            {lastUpdateTime ? new Date(lastUpdateTime).toLocaleTimeString() : 'Never'}
          </p>
        </div>
      </div>

      {/* Test Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button onClick={testBulkLoad} className="bg-red-600 hover:bg-red-700">
          Test Bulk Load (Old Method)
        </Button>
        <Button onClick={testIncrementalAdd} className="bg-green-600 hover:bg-green-700">
          Test Incremental Add (New Method)
        </Button>
        <Button onClick={testBidUpdate} className="bg-blue-600 hover:bg-blue-700">
          Test Bid Update
        </Button>
        <Button onClick={testBatchUpdate} className="bg-purple-600 hover:bg-purple-700">
          Test Batch Update
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <Button onClick={clearSongs} variant="outline">
          Clear All Songs
        </Button>
      </div>

      {/* Songs with Bids */}
      <div className="bg-gray-800 p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Songs with Bids</h3>
        <div className="max-h-40 overflow-y-auto">
          {songs
            .filter(song => song.currentBid && song.currentBid > 0)
            .slice(0, 10)
            .map(song => (
              <div key={song.id} className="flex justify-between py-1">
                <span className="text-sm">{song.title}</span>
                <span className="text-sm text-green-400">${song.currentBid?.toFixed(2)}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gray-800 rounded">
        <h3 className="text-lg font-semibold mb-2">Test Instructions</h3>
        <ul className="text-sm space-y-1">
          <li>• <strong>Bulk Load</strong>: Tests the old method of replacing entire array</li>
          <li>• <strong>Incremental Add</strong>: Tests the new optimized method</li>
          <li>• <strong>Bid Update</strong>: Tests updating a single song's bid</li>
          <li>• <strong>Batch Update</strong>: Tests updating multiple songs efficiently</li>
          <li>• Watch the render count to see optimization impact</li>
          <li>• Check browser console for performance timing logs</li>
        </ul>
      </div>
    </div>
  );
};

export default PerformanceTest;
