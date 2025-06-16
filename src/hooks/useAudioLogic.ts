import { createData, getUserDetailsByUserId, updateTable } from "@/api";
import { useAppSelector } from "@/store/hooks";
import { setAccountInfo } from "@/store/slices/accountInfo";
import { Song } from "@/Types";
import { useCallback, useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import moment from 'moment';

interface AudioState {
  currentPlayingSong: Song | null;
  isPlaying: boolean;
  currentPosition: number;
}

export const useAudioLogic = (songs: Song[] = []) => {
    const dispatch = useDispatch();
    const accountInfo = useAppSelector((state) => state.accountSlice.accountInfo);
    const [audioState, setAudioState] = useState<AudioState>({
        currentPlayingSong: null,
        isPlaying: false,
        currentPosition: 0
    });

    // Track bid clearing timeouts
    const bidClearTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const playingStartTimeRef = useRef<number | null>(null);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (bidClearTimeoutRef.current) {
                clearTimeout(bidClearTimeoutRef.current);
            }
        };
    }, []);

    // Clear bid after 45 seconds of playing
    const clearBidAfterDelay = useCallback(async (song: Song) => {
        if (!song.currentBid || !song.currentBiders || song.currentBiders.length === 0) {
            return;
        }

        console.log(`⏰ Starting 45-second timer to clear bid for: ${song.title}`);

        bidClearTimeoutRef.current = setTimeout(async () => {
            try {
                // Double-check the song is still playing before clearing bids
                const currentSong = songs.find(s => s.id === song.id);
                if (currentSong?.isPlaying && currentSong?.DJCurrentSong) {
                    await updateTable('music', song.id, {
                        ...song,
                        currentBiders: [],
                        currentBid: 0,
                        lastUpdated: Date.now()
                    });
                    console.log(`✅ Bid cleared automatically for: ${song.title} after 45 seconds of playing`);
                } else {
                    console.log(`⚠️ Song ${song.title} is no longer playing, skipping bid clear`);
                }
            } catch (error) {
                console.error('Failed to clear bid automatically:', error);
            }
        }, 45000); // 45 seconds
    }, [songs]);

    // Handle song updates (play, pause, stop)
    const handleSongUpdate = useCallback(async (song: Song, action: 'play' | 'pause' | 'stop', position: number = 0) => {
        if (!song || !song.id) {
            console.error('Invalid song object provided to handleSongUpdate');
            return;
        }

        try {
            // Clear any existing timeout
            if (bidClearTimeoutRef.current) {
                clearTimeout(bidClearTimeoutRef.current);
                bidClearTimeoutRef.current = null;
            }

            // Update local state immediately
            setAudioState({
                currentPlayingSong: action === 'stop' ? null : song,
                isPlaying: action === 'play',
                currentPosition: position
            });

            // Update the current song in database
            await updateTable('music', song.id, {
                ...song,
                DJCurrentSong: action === 'play',
                action,
                isPlaying: action === 'play',
                currentPosition: position,
                lastUpdated: Date.now()
            });

            console.log(`🎵 Song ${action}: ${song.title} at position ${position}s`);

            // Handle bid clearing for songs with bids when they start playing
            if (action === 'play' && song.currentBid && song.currentBiders && song.currentBiders.length > 0) {
                playingStartTimeRef.current = Date.now();
                console.log(`💰 Song with bid started playing: ${song.title} (${song.currentBid} tokens)`);
                clearBidAfterDelay(song);
            }

            // Stop all other songs if this one is playing
            if (action === 'play') {
                const otherSongUpdates = songs
                    .filter(s => s.id !== song.id && (s.isPlaying || s.DJCurrentSong))
                    .map(s => updateTable('music', s.id, {
                        ...s,
                        DJCurrentSong: false,
                        action: 'stop',
                        isPlaying: false,
                        currentPosition: 0
                    }));

                if (otherSongUpdates.length > 0) {
                    await Promise.all(otherSongUpdates);
                    console.log(`🛑 Stopped ${otherSongUpdates.length} other songs`);
                }
            }

            // Clear timeout if song is paused or stopped
            if (action === 'pause' || action === 'stop') {
                if (bidClearTimeoutRef.current) {
                    clearTimeout(bidClearTimeoutRef.current);
                    bidClearTimeoutRef.current = null;
                    console.log(`⏸️ Bid clearing timer stopped for: ${song.title}`);
                }
                playingStartTimeRef.current = null;
            }
        } catch (error) {
            console.error('Failed to update song status:', error);
        }
    }, [songs, clearBidAfterDelay]);

    // Get current playing song from songs array
    const getCurrentPlayingSong = useCallback(() => {
        return songs.find(song => song.isPlaying || song.DJCurrentSong) || null;
    }, [songs]);

    // Check if a song is currently playing
    const isSongPlaying = useCallback((songId: string) => {
        const song = songs.find(s => s.id === songId);
        return song?.isPlaying || song?.DJCurrentSong || false;
    }, [songs]);

    // Get song with bids (songs that have currentBid > 0)
    const getSongsWithBids = useCallback(() => {
        return songs.filter(song => song.currentBid && song.currentBid > 0);
    }, [songs]);

    // Check if song has bids
    const songHasBids = useCallback((songId: string) => {
        const song = songs.find(s => s.id === songId);
        return song?.currentBid && song.currentBid > 0;
    }, [songs]);

    // Get bid amount for a song
    const getSongBidAmount = useCallback((songId: string) => {
        const song = songs.find(s => s.id === songId);
        return song?.currentBid && song.currentBid > 0 ? song.currentBid : null;
    }, [songs]);

    // Format position as MM:SS
    const formatPosition = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }, []);

    const handleTransaction = async({amount,receiver, sender, type, description, createStatement = true}:{amount:number,receiver:string, sender:string, type:'load' | 'withdraw' | 'transfer',description:string,createStatement?:boolean}) => {
        try {
            const receiverData = await getUserDetailsByUserId(receiver);
            const transactionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const date = moment().format("L");
            if(receiverData?.length > 0){
                const receiverBalance = receiverData[0]?.balance;
                const senderData = await getUserDetailsByUserId(sender);
                const senderBalance = senderData?.[0]?.balance;

                if(senderBalance && senderBalance > amount){
                    const updatedReceiverBalance = receiverBalance + amount;
                    const updatedSenderBalance = senderBalance - amount;
                    await updateTable("users",receiver, {balance:updatedReceiverBalance});
                    await updateTable("users",sender, {balance:updatedSenderBalance});
                    dispatch(setAccountInfo({...accountInfo,balance:updatedSenderBalance}));
                    if(createStatement){
                        await createData("transactions",transactionId,{transactionId,sender,receiver,amount,type,description,participants:[sender,receiver],date});
                    }
                    return true
                }else{
                    return false
                }
            }else{
                return false
            }
        } catch (error) {
            console.log(error)
            return false
        }
    }
    const refundBid = async(song: Song) => {
        const currentBiders = song?.currentBiders || [];
        await Promise.all(currentBiders.map(async (bidder) => {
          return handleTransaction({
            amount: bidder.amount,
            receiver: bidder.userId,
            sender: accountInfo?.userId || '',
            type: 'transfer',
            description: `Song Request Refund`
          });
        }));
    }

    // Cancel bid functionality with confirmation
    const cancelBid = useCallback(async (song: Song) => {
        if (!song || !song.id) {
            console.error('Invalid song object provided to cancelBid');
            return false;
        }

        try {
            console.log(`🚫 Canceling bid for: ${song.title}`);

            // First refund the tokens to bidders
            await refundBid(song);

            // Then update the song to clear bids
            await updateTable('music', song.id, {
                ...song,
                currentBiders: [],
                currentBid: 0,
                lastUpdated: Date.now()
            });

            console.log(`✅ Bid canceled and refunded for: ${song.title}`);
            return true;
        } catch (error) {
            console.error('Failed to cancel bid:', error);
            return false;
        }
    }, [refundBid]);
    return {
        // State
        currentPlayingSong: audioState.currentPlayingSong,
        isPlaying: audioState.isPlaying,
        currentPosition: audioState.currentPosition,

        // Actions
        handleSongUpdate,
        cancelBid,

        // Getters
        getCurrentPlayingSong,
        isSongPlaying,
        getSongsWithBids,
        songHasBids,
        getSongBidAmount,
        refundBid,

        // Utilities
        formatPosition
    };
};
