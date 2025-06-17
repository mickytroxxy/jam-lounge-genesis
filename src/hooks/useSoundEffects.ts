import { useState, useCallback, useRef, useEffect } from 'react';

interface SoundEffect {
  name: string;
  filename: string;
  isPlaying: boolean;
  audio?: HTMLAudioElement;
}

export const useSoundEffects = () => {
  const [soundEffects, setSoundEffects] = useState<SoundEffect[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

  // Available sound effect files (you can expand this list)
  const availableEffects = [
    { name: 'Air Horn', filename: 'air-horn-djmix-1.mp3' },
    { name: 'Siren', filename: 'Siren-Sound2.mp3' },
    { name: 'Scratch', filename: 'dj-scratch-87179.mp3' },
    { name: 'Reverse', filename: 're-verse-dj-fx-344132.mp3' },
    { name: 'Laser', filename: 'Laser_dancehall.mp3' },
    { name: 'Explosion', filename: 'Explosion.mp3' },
    { name: 'Drop', filename: 'drop.mp3' },
    { name: 'Drop Deep', filename: 'drop_deep.mp3' },
    { name: 'DJ Beats', filename: 'dj-beats-38545.mp3' },
    { name: 'DJ Cousin', filename: 'dj-cousin-shawn-29146.mp3' },
    { name: 'DJ Electrex', filename: 'djelectrexandwarrenbackhouse-88124.mp3' },
    { name: 'Scratch Transform', filename: 'scratch_transform_010-46202.mp3' },
    { name: 'Vinyl Rewind', filename: 'vinyl-rewind-416469-PREVIEW.mp3' },
    { name: 'Voice Sound', filename: 'voice-sound01.mp3' },
    { name: 'Air Horn Preview', filename: 'air-dj-horn-sound-945456-PREVIEW.mp3' }
  ];

  // Initialize sound effects
  useEffect(() => {
    const effects = availableEffects.map(effect => ({
      name: effect.name,
      filename: effect.filename,
      isPlaying: false
    }));
    setSoundEffects(effects);
  }, []);

  // Create or get audio element for effect
  const getAudioElement = useCallback((filename: string) => {
    if (!audioRefs.current.has(filename)) {
      const audio = new Audio(`/effects/${filename}`);
      audio.volume = 0.8;
      audio.preload = 'auto';
      
      // Add event listeners
      audio.addEventListener('ended', () => {
        setSoundEffects(prev => prev.map(effect => 
          effect.filename === filename 
            ? { ...effect, isPlaying: false }
            : effect
        ));
        setCurrentlyPlaying(null);
      });

      audio.addEventListener('error', (e) => {
        console.error(`❌ Error loading sound effect: ${filename}`, e);
      });

      audioRefs.current.set(filename, audio);
    }
    return audioRefs.current.get(filename)!;
  }, []);

  // Play sound effect
  const playEffect = useCallback((filename: string) => {
    console.log(`🎵 playEffect called for: ${filename}`);
    console.log(`🎵 Current audio context state:`, audioRefs.current.size);

    // Stop currently playing effect if any
    if (currentlyPlaying && currentlyPlaying !== filename) {
      const currentAudio = audioRefs.current.get(currentlyPlaying);
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    }

    const audio = getAudioElement(filename);
    console.log(`🎵 Audio element created for: ${filename}`);

    audio.play().then(() => {
      console.log(`✅ Successfully playing: ${filename}`);
      setSoundEffects(prev => prev.map(effect => ({
        ...effect,
        isPlaying: effect.filename === filename
      })));
      setCurrentlyPlaying(filename);
    }).catch((error) => {
      console.error(`❌ Failed to play ${filename}:`, error);
      console.error(`❌ Audio src: ${audio.src}`);
      console.error(`❌ Audio readyState: ${audio.readyState}`);
    });
  }, [currentlyPlaying, getAudioElement]);

  // Pause sound effect
  const pauseEffect = useCallback((filename: string) => {
    console.log(`⏸️ Pausing sound effect: ${filename}`);
    
    const audio = audioRefs.current.get(filename);
    if (audio) {
      audio.pause();
      setSoundEffects(prev => prev.map(effect => 
        effect.filename === filename 
          ? { ...effect, isPlaying: false }
          : effect
      ));
      setCurrentlyPlaying(null);
    }
  }, []);

  // Stop sound effect (pause + reset to beginning)
  const stopEffect = useCallback((filename: string) => {
    console.log(`⏹️ Stopping sound effect: ${filename}`);
    
    const audio = audioRefs.current.get(filename);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setSoundEffects(prev => prev.map(effect => 
        effect.filename === filename 
          ? { ...effect, isPlaying: false }
          : effect
      ));
      setCurrentlyPlaying(null);
    }
  }, []);

  // Stop all effects
  const stopAllEffects = useCallback(() => {
    console.log('⏹️ Stopping all sound effects');
    
    audioRefs.current.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    
    setSoundEffects(prev => prev.map(effect => ({ ...effect, isPlaying: false })));
    setCurrentlyPlaying(null);
  }, []);

  // Toggle play/stop for effect
  const toggleEffect = useCallback((filename: string) => {
    const effect = soundEffects.find(e => e.filename === filename);
    if (effect?.isPlaying) {
      stopEffect(filename);
    } else {
      playEffect(filename);
    }
  }, [soundEffects, playEffect, stopEffect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioRefs.current.forEach((audio) => {
        audio.pause();
        audio.remove();
      });
      audioRefs.current.clear();
    };
  }, []);

  return {
    soundEffects,
    currentlyPlaying,
    playEffect,
    pauseEffect,
    stopEffect,
    stopAllEffects,
    toggleEffect
  };
};
