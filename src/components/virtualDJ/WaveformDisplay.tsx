import React, { useEffect, useRef, useState, useCallback } from 'react';

interface WaveformProps {
  audioUrl?: string;
  position: number;        // current playback position in seconds
  duration: number;        // total duration in seconds
  isPlaying: boolean;
  color?: string;          // primary waveform color
  onSeek?: (position: number) => void;
  hotCues?: (number | null)[];  // array of up to 8 cue positions
  hotCueColors?: string[];
  loopIn?: number | null;
  loopOut?: number | null;
}

const BAR_COUNT = 200;

const WaveformDisplay: React.FC<WaveformProps> = ({
  audioUrl,
  position,
  duration,
  isPlaying,
  color = '#a855f7',
  onSeek,
  hotCues = [],
  hotCueColors = ['#ff4444','#ff8800','#ffff00','#00ff44','#00ffff','#4488ff','#aa44ff','#ff44aa'],
  loopIn,
  loopOut,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const lastUrlRef = useRef<string>('');

  // Decode audio and build waveform peak data
  const analyzeAudio = useCallback(async (url: string) => {
    if (!url || url === lastUrlRef.current) return;
    lastUrlRef.current = url;
    setIsLoading(true);

    try {
      const ctx = new AudioContext();
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

      const channelData = audioBuffer.getChannelData(0);
      const blockSize = Math.floor(channelData.length / BAR_COUNT);
      const peaks: number[] = [];

      for (let i = 0; i < BAR_COUNT; i++) {
        let max = 0;
        for (let j = 0; j < blockSize; j++) {
          const val = Math.abs(channelData[i * blockSize + j]);
          if (val > max) max = val;
        }
        peaks.push(max);
      }

      setWaveformData(peaks);
      await ctx.close();
    } catch (err) {
      // Fallback: generate a plausible fake waveform shape
      const fake: number[] = [];
      for (let i = 0; i < BAR_COUNT; i++) {
        const t = i / BAR_COUNT;
        const base = Math.sin(t * Math.PI * 8) * 0.3 + 0.3;
        fake.push(Math.max(0.05, base + (Math.random() - 0.5) * 0.25));
      }
      setWaveformData(fake);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (audioUrl) analyzeAudio(audioUrl);
  }, [audioUrl, analyzeAudio]);

  // Draw waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const progress = duration > 0 ? position / duration : 0;
    const playedBars = Math.floor(progress * BAR_COUNT);
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Draw loop region
    if (loopIn != null && loopOut != null && duration > 0) {
      const loopStartX = (loopIn / duration) * width;
      const loopEndX = (loopOut / duration) * width;
      ctx.fillStyle = 'rgba(0, 220, 120, 0.15)';
      ctx.fillRect(loopStartX, 0, loopEndX - loopStartX, height);
    }

    const barWidth = width / BAR_COUNT;

    // Draw bars
    for (let i = 0; i < BAR_COUNT; i++) {
      const amplitude = waveformData[i] || 0.05;
      const barHeight = Math.max(2, amplitude * height * 0.85);
      const x = i * barWidth;
      const played = i <= playedBars;

      // Frequency-style color: played = bright, unplayed = dimmed
      if (played) {
        ctx.fillStyle = color;
      } else {
        ctx.fillStyle = color + '55';
      }

      // Mirrored bars (top + bottom)
      ctx.fillRect(x + 1, centerY - barHeight / 2, barWidth - 2, barHeight / 2);
      ctx.fillStyle = played ? color + 'bb' : color + '33';
      ctx.fillRect(x + 1, centerY, barWidth - 2, barHeight / 2);
    }

    // Draw hot cue markers
    hotCues.forEach((cuePos, idx) => {
      if (cuePos == null || duration <= 0) return;
      const x = (cuePos / duration) * width;
      const cueColor = hotCueColors[idx] || '#ffffff';
      ctx.fillStyle = cueColor;
      ctx.fillRect(x - 1, 0, 2, height);
      // Triangle marker at top
      ctx.beginPath();
      ctx.moveTo(x - 5, 0);
      ctx.lineTo(x + 5, 0);
      ctx.lineTo(x, 8);
      ctx.closePath();
      ctx.fill();
    });

    // Draw loop markers
    if (loopIn != null && duration > 0) {
      const x = (loopIn / duration) * width;
      ctx.fillStyle = '#00ff88';
      ctx.fillRect(x - 1, 0, 2, height);
    }
    if (loopOut != null && duration > 0) {
      const x = (loopOut / duration) * width;
      ctx.fillStyle = '#ff4444';
      ctx.fillRect(x - 1, 0, 2, height);
    }

    // Draw playhead
    const playheadX = progress * width;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(playheadX - 1, 0, 2, height);

    // Loading indicator
    if (isLoading) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#ffffff88';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Analyzing...', width / 2, height / 2 + 4);
    }
  }, [waveformData, position, duration, color, hotCues, hotCueColors, loopIn, loopOut, isLoading]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onSeek || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = x / rect.width;
    onSeek(ratio * duration);
  };

  return (
    <div className="relative w-full rounded-md overflow-hidden" style={{ height: 64 }}>
      <canvas
        ref={canvasRef}
        width={600}
        height={64}
        className="w-full h-full cursor-crosshair"
        onClick={handleClick}
        style={{ display: 'block' }}
      />
      {/* Time readout */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 pb-0.5 pointer-events-none">
        <span className="text-[9px] text-white/50 font-mono">
          {Math.floor(position / 60)}:{String(Math.floor(position % 60)).padStart(2, '0')}
        </span>
        <span className="text-[9px] text-white/50 font-mono">
          -{Math.floor((duration - position) / 60)}:{String(Math.floor((duration - position) % 60)).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

export default WaveformDisplay;
