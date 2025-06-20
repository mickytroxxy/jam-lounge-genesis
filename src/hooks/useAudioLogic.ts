import { createData, getUserDetailsByUserId, updateTable, getSongById } from "@/api";
import { useAppSelector } from "@/store/hooks";
import { setAccountInfo } from "@/store/slices/accountInfo";
import { Song } from "@/Types";
import { useCallback, useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import moment from 'moment';
import { useSecrets } from "./useSecrets";

interface AudioState {
  currentPlayingSong: Song | null;
  isPlaying: boolean;
  currentPosition: number;
}

export const useAudioLogic = (songs: Song[] = []) => {
    const dispatch = useDispatch();
    const {secrets} = useSecrets();
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
            console.log(`⚠️ No bid to clear for: ${song.title}`);
            return;
        }

        console.log(`⏰ Starting 45-second timer to clear bid for: ${song.title} (Bid: ${song.currentBid} tokens)`);

        // Clear any existing timeout for this song
        if (bidClearTimeoutRef.current) {
            clearTimeout(bidClearTimeoutRef.current);
            console.log(`🔄 Cleared previous timeout for bid clearing`);
        }

        bidClearTimeoutRef.current = setTimeout(async () => {
            try {
                console.log(`⏰ 45 seconds elapsed - attempting to clear bid for: ${song.title}`);

                // Get fresh song data from database to check current state
                const freshSongData = await getSongById(song.id);

                if (freshSongData && (freshSongData.isPlaying || freshSongData.DJCurrentSong)) {
                    console.log(`🎵 Song ${song.title} is still playing - clearing bid now`);

                    // Update the database to clear the bid
                    await updateTable('music', song.id, {
                        ...freshSongData,
                        currentBiders: [],
                        currentBid: 0,
                        lastUpdated: Date.now()
                    });

                    console.log(`🗄️ Database updated - bid cleared for: ${song.title}`);

                    // Process the payment to DJ
                    const totalBid = (song?.currentBid || 0) * (secrets?.bidShare || 0.5);
                    const transactionSuccess = await handleTransaction({
                        amount: totalBid,
                        receiver: accountInfo?.userId || '',
                        sender: secrets?.appId || '',
                        type: 'transfer',
                        description: `Bid Share for ${song.title}`
                    });

                    if (transactionSuccess) {
                        console.log(`✅ Bid cleared automatically for: ${song.title} after 45 seconds. DJ received ${totalBid} tokens.`);

                        // Force a small delay to ensure database update propagates
                        setTimeout(() => {
                            console.log(`🔄 Bid clearing completed for: ${song.title} - UI should update shortly`);
                        }, 1000);
                    } else {
                        console.error(`❌ Failed to transfer bid share for: ${song.title}`);
                    }
                } else {
                    console.log(`⚠️ Song ${song.title} is no longer playing, skipping bid clear`);
                }

                // Clear the timeout reference
                bidClearTimeoutRef.current = null;

            } catch (error) {
                console.error(`❌ Failed to clear bid automatically for ${song.title}:`, error);
                bidClearTimeoutRef.current = null;
            }
        }, 45000); // 45 seconds

        console.log(`⏰ Timeout set for ${song.title} - will clear in 45 seconds`);
    }, [secrets?.bidShare, secrets?.appId, accountInfo?.userId]);

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

            // Get fresh song data to avoid overwriting cleared bids
            const freshCurrentSongData = await getSongById(song.id) || song;
            console.log(`🔄 Updating current song "${song.title}" - Fresh bid: ${freshCurrentSongData.currentBid || 0}, Stale bid: ${song.currentBid || 0}`);

            // Update the current song in database with fresh data
            await updateTable('music', song.id, {
                ...freshCurrentSongData,
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
                const otherPlayingSongs = songs.filter(s => s.id !== song.id && (s.isPlaying || s.DJCurrentSong));

                if (otherPlayingSongs.length > 0) {
                    console.log(`🛑 Stopping ${otherPlayingSongs.length} other songs - fetching fresh data to preserve bids`);

                    // Fetch fresh data for each song to avoid overwriting cleared bids
                    const otherSongUpdates = otherPlayingSongs.map(async (s) => {
                        try {
                            // Get fresh song data from database
                            const freshSongData = await getSongById(s.id) || s;

                            console.log(`🔄 Stopping "${s.title}" - Fresh bid: ${freshSongData.currentBid || 0}, Stale bid: ${s.currentBid || 0}`);

                            // Update with fresh data, only changing playback state
                            return updateTable('music', s.id, {
                                ...freshSongData,
                                DJCurrentSong: false,
                                action: 'stop',
                                isPlaying: false,
                                currentPosition: 0,
                                lastUpdated: Date.now()
                            });
                        } catch (error) {
                            console.error(`Failed to fetch fresh data for ${s.title}:`, error);
                            // Fallback: only update playback fields, don't touch bid data
                            return updateTable('music', s.id, {
                                DJCurrentSong: false,
                                action: 'stop',
                                isPlaying: false,
                                currentPosition: 0,
                                lastUpdated: Date.now()
                            });
                        }
                    });

                    await Promise.all(otherSongUpdates);
                    console.log(`✅ Stopped ${otherPlayingSongs.length} other songs with preserved bid data`);
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
            sender: secrets?.appId || '',
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
