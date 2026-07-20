import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Play, Pause, Save, Loader2, X, Wand2, Music2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/store/hooks';
import { getAISongsByOwner } from '@/api';
import { Song } from '@/Types';

interface AIMusicTabProps {
  loadTrackToDeckA: (song: Song) => void;
  loadTrackToDeckB: (song: Song) => void;
}

interface GeneratedSong {
  id: string;
  artistName: string;
  songTitle: string;
  lyrics: string;
  relativePath: string;
  sizeBytes: number;
}

interface AISong {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  audioUrl: string;
  url: string;
  duration: number;
  ownerId: string;
  genres: string;
  uploadDate: string;
  playCount: number;
}

const AIMusicTab: React.FC<AIMusicTabProps> = ({ loadTrackToDeckA, loadTrackToDeckB }) => {
  const accountInfo = useAppSelector((state) => state.accountSlice.accountInfo);
  const secrets = useAppSelector((state) => state.globalVariables.secrets);
  const baseUrl = 'https://play-server-621707723909.europe-west1.run.app';

  // AI-generated songs from Firestore
  const [aiSongs, setAiSongs] = useState<AISong[]>([]);
  const [loadingAiSongs, setLoadingAiSongs] = useState(true);

  // Currently previewing song
  const [previewingSongId, setPreviewingSongId] = useState<string | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Generate music state
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generatedSong, setGeneratedSong] = useState<GeneratedSong | null>(null);

  // Save music state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Preview for newly generated song (before save)
  const [isPreviewingGenerated, setIsPreviewingGenerated] = useState(false);
  const generatedAudioRef = useRef<HTMLAudioElement | null>(null);

  // DJ username (used as 'user' param to backend)
  const djUsername = accountInfo?.djInfo?.djName
    ? accountInfo.djInfo.djName.replace(/[^a-zA-Z0-9_-]/g, '_')
    : accountInfo?.userId
    ? accountInfo.userId.replace(/[^a-zA-Z0-9_-]/g, '_')
    : 'dj_user';

  const artistName = accountInfo?.djInfo?.djName || accountInfo?.fname || 'DJ';
  const userId = accountInfo?.userId || '';

  // Subscribe to AI songs in real-time
  useEffect(() => {
    if (!userId) {
      setLoadingAiSongs(false);
      return;
    }
    setLoadingAiSongs(true);
    const unsubscribe = getAISongsByOwner(userId, (songs) => {
      // Sort newest first
      const sorted = [...songs].sort((a, b) =>
        new Date(b.uploadDate || 0).getTime() - new Date(a.uploadDate || 0).getTime()
      );
      setAiSongs(sorted as AISong[]);
      setLoadingAiSongs(false);
    });
    return () => unsubscribe();
  }, [userId]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      previewAudioRef.current?.pause();
      generatedAudioRef.current?.pause();
    };
  }, []);

  // --- Preview existing AI song ---
  const handlePreviewToggle = (song: AISong) => {
    if (previewingSongId === song.id && isPreviewPlaying) {
      previewAudioRef.current?.pause();
      setIsPreviewPlaying(false);
    } else {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      const audio = new Audio(song.audioUrl || song.url);
      previewAudioRef.current = audio;
      audio.play();
      setPreviewingSongId(song.id);
      setIsPreviewPlaying(true);
      audio.onended = () => {
        setIsPreviewPlaying(false);
        setPreviewingSongId(null);
      };
    }
  };

  // --- Load to deck helpers ---
  const toSong = (s: AISong): Song => ({
    id: s.id,
    title: s.title,
    artist: s.artist,
    albumArt: s.albumArt || 'https://mrdocs.empiredigitals.org/playIcon.png',
    url: s.audioUrl || s.url,
    audioUrl: s.audioUrl || s.url,
    duration: s.duration || 0,
    action: 'stop',
    isPlaying: false,
    isSuggested: false,
    ownerId: s.ownerId,
  });

  // --- Generate music ---
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenerationError(null);
    setGeneratedSong(null);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      const response = await fetch(`${baseUrl}/api/generate-music`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: djUsername,
          prompt: prompt.trim(),
          artistName: artistName,
          songTitle: songTitle.trim() || prompt.trim().slice(0, 50),
        }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || json.details || 'Failed to generate music');
      }
      setGeneratedSong(json.data);
    } catch (err: any) {
      setGenerationError(err.message || 'An error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  // --- Preview generated song (temp file served by backend) ---
  const handlePreviewGenerated = () => {
    if (!generatedSong) return;
    const audioUrl = `${baseUrl}/${generatedSong.relativePath}`;
    if (isPreviewingGenerated) {
      generatedAudioRef.current?.pause();
      setIsPreviewingGenerated(false);
    } else {
      if (generatedAudioRef.current) {
        generatedAudioRef.current.pause();
      }
      const audio = new Audio(audioUrl);
      generatedAudioRef.current = audio;
      audio.play();
      setIsPreviewingGenerated(true);
      audio.onended = () => setIsPreviewingGenerated(false);
    }
  };

  // --- Save music ---
  const handleSave = async () => {
    if (!generatedSong) return;
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const response = await fetch(`${baseUrl}/api/save-music`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: generatedSong.id,
          ownerId: userId,
        }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to save music');
      }
      setSaveSuccess(true);
      generatedAudioRef.current?.pause();
      setIsPreviewingGenerated(false);
      // Reset after a moment so user can see success
      setTimeout(() => {
        setGeneratedSong(null);
        setPrompt('');
        setSongTitle('');
        setSaveSuccess(false);
        setShowGenerateModal(false);
      }, 2000);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save music.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseModal = () => {
    if (isGenerating || isSaving) return;
    generatedAudioRef.current?.pause();
    setIsPreviewingGenerated(false);
    setShowGenerateModal(false);
    setPrompt('');
    setSongTitle('');
    setGeneratedSong(null);
    setGenerationError(null);
    setSaveError(null);
    setSaveSuccess(false);
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Create Music Button */}
      <div className="mb-3">
        <button
          onClick={() => setShowGenerateModal(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200
            bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600
            hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500
            text-white shadow-lg shadow-purple-900/40 hover:shadow-purple-600/50
            border border-purple-400/30 hover:border-purple-300/50
            active:scale-[0.98]"
        >
          <Wand2 className="w-4 h-4" />
          <span>Create AI Music</span>
          <Sparkles className="w-3.5 h-3.5 text-fuchsia-300 animate-pulse" />
        </button>
      </div>

      {/* AI Songs List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
        {loadingAiSongs ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <Loader2 className="w-7 h-7 text-purple-400 animate-spin" />
            <p className="text-gray-400 text-xs">Loading AI tracks...</p>
          </div>
        ) : aiSongs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-800/40 to-fuchsia-800/40 flex items-center justify-center border border-purple-600/30">
              <Sparkles className="w-7 h-7 text-purple-400" />
            </div>
            <p className="text-gray-300 text-sm font-semibold">No AI tracks yet</p>
            <p className="text-gray-500 text-xs max-w-[180px]">
              Click "Create AI Music" to generate your first track!
            </p>
          </div>
        ) : (
          aiSongs.map((song) => {
            const isThisPlaying = previewingSongId === song.id && isPreviewPlaying;
            return (
              <div
                key={song.id}
                className={`rounded-lg p-2 transition-all duration-200 group border-2 ${
                  isThisPlaying
                    ? 'bg-purple-900/40 border-purple-500/70 shadow-md shadow-purple-900/30'
                    : 'bg-gray-800/40 border-transparent hover:bg-gray-700/40 hover:border-gray-600/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {/* Album Art / AI Badge */}
                  <div className="relative w-11 h-11 flex-shrink-0">
                    <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center overflow-hidden">
                      {song.albumArt ? (
                        <img src={song.albumArt} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Music2 className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-fuchsia-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-2.5 h-2.5 text-white" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold truncate">{song.title}</p>
                    <p className="text-purple-300 text-xs truncate">{song.artist}</p>
                    {song.duration > 0 && (
                      <p className="text-gray-500 text-[10px]">{formatDuration(song.duration)}</p>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-1">
                    {/* Preview toggle */}
                    <button
                      onClick={() => handlePreviewToggle(song)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        isThisPlaying
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white'
                      }`}
                      title={isThisPlaying ? 'Pause preview' : 'Play preview'}
                    >
                      {isThisPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                    </button>

                    {/* Deck A/B - visible on hover */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => loadTrackToDeckA(toSong(song))}
                        className="w-6 h-6 rounded text-[10px] font-bold bg-purple-700/60 text-purple-200 hover:bg-purple-600 transition-colors border border-purple-500/40"
                        title="Load to Deck A"
                      >
                        A
                      </button>
                      <button
                        onClick={() => loadTrackToDeckB(toSong(song))}
                        className="w-6 h-6 rounded text-[10px] font-bold bg-blue-700/60 text-blue-200 hover:bg-blue-600 transition-colors border border-blue-500/40"
                        title="Load to Deck B"
                      >
                        B
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Generate Music Modal */}
      {showGenerateModal && (
        <div style={{marginTop:200}} className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          {/* Modal */}
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-900/50
            bg-gradient-to-b from-[#1a1535] to-[#110f2e] overflow-hidden">
            {/* Glow header */}
            <div className="relative px-5 pt-5 pb-4 border-b border-purple-500/20">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-900/30 to-fuchsia-900/30" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-900/40">
                    <Wand2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">Create AI Music</h3>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  disabled={isGenerating || isSaving}
                  className="w-7 h-7 rounded-full bg-gray-700/60 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-600 transition-colors disabled:opacity-40"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="px-5 py-4 space-y-4">
              {/* Artist name display */}
              <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-purple-900/20 border border-purple-500/20">
                <Sparkles className="w-3.5 h-3.5 text-fuchsia-400 flex-shrink-0" />
                <span className="text-xs text-gray-300">Artist: <span className="text-white font-semibold">{artistName}</span></span>
              </div>

              {/* Song title input */}
              <div className="mt-px">
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                  Song title
                </label>
                <input
                  type="text"
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  placeholder="e.g. Midnight Amapiano"
                  disabled={isGenerating || isSaving || saveSuccess}
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-800/60 text-white text-xs
                    border border-gray-600/40 focus:border-purple-500/60 focus:outline-none focus:ring-1 focus:ring-purple-500/30
                    placeholder-gray-600 transition-colors disabled:opacity-50"
                />
              </div>

              {/* Prompt textarea */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium mt-px">
                  Describe your track
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Upbeat amapiano with deep bass, energetic, 126 BPM..."
                  rows={3}
                  disabled={isGenerating || isSaving || saveSuccess}
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-800/60 text-white text-xs
                    border border-gray-600/40 focus:border-purple-500/60 focus:outline-none focus:ring-1 focus:ring-purple-500/30
                    placeholder-gray-600 resize-none transition-colors disabled:opacity-50"
                />
              </div>

              {/* Error */}
              {generationError && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-900/20 border border-red-500/30">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-xs">{generationError}</p>
                </div>
              )}

              {/* Generated song preview */}
              {generatedSong && !saveSuccess && (
                <div className="p-3 rounded-xl bg-gradient-to-r from-violet-900/30 to-fuchsia-900/30 border border-purple-500/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <p className="text-green-300 text-xs font-semibold">Track generated!</p>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm truncate">{generatedSong.songTitle}</p>
                    <p className="text-purple-300 text-xs">{generatedSong.artistName}</p>
                  </div>

                  {/* Preview button */}
                  <button
                    onClick={handlePreviewGenerated}
                    className={`flex items-center gap-2 w-full py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                      isPreviewingGenerated
                        ? 'bg-fuchsia-600/40 text-fuchsia-200 border border-fuchsia-500/40'
                        : 'bg-gray-700/60 text-gray-200 border border-gray-600/30 hover:bg-gray-600/60'
                    }`}
                  >
                    {isPreviewingGenerated ? (
                      <><Pause className="w-3.5 h-3.5" /> Pause Preview</>
                    ) : (
                      <><Play className="w-3.5 h-3.5 ml-0.5" /> Listen to Preview</>
                    )}
                  </button>

                  {/* Save error */}
                  {saveError && (
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-900/20 border border-red-500/30">
                      <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-red-300 text-[10px]">{saveError}</p>
                    </div>
                  )}

                  {/* Save button */}
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg font-semibold text-sm
                      bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500
                      text-white transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {isSaving ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Saving to Library...</>
                    ) : (
                      <><Save className="w-4 h-4" /> Save to My Library</>
                    )}
                  </button>
                </div>
              )}

              {/* Save success */}
              {saveSuccess && (
                <div className="flex flex-col items-center gap-2 py-4">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                  <p className="text-green-300 font-semibold text-sm">Saved to your library!</p>
                  <p className="text-gray-400 text-xs">Your AI track is now in the list above.</p>
                </div>
              )}

              {/* Generate / Regenerate button */}
              {!generatedSong && !saveSuccess && (
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg font-semibold text-sm
                    bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500
                    text-white transition-all shadow-lg shadow-purple-900/40
                    disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {isGenerating ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Generating your track...</>
                  ) : (
                    <><Wand2 className="w-4 h-4" /> Generate Music</>
                  )}
                </button>
              )}

              {generatedSong && !saveSuccess && (
                <button
                  onClick={() => {
                    generatedAudioRef.current?.pause();
                    setIsPreviewingGenerated(false);
                    setGeneratedSong(null);
                    setGenerationError(null);
                    setSaveError(null);
                  }}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg text-xs
                    bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Wand2 className="w-3.5 h-3.5" /> Generate Another Track
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIMusicTab;
