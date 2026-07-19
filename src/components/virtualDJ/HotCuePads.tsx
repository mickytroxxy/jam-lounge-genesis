import React from 'react';

const HOT_CUE_COLORS = [
  '#ff4444', // 1 - red
  '#ff8800', // 2 - orange
  '#ffff00', // 3 - yellow
  '#00ff44', // 4 - green
  '#00ffff', // 5 - cyan
  '#4488ff', // 6 - blue
  '#aa44ff', // 7 - purple
  '#ff44aa', // 8 - pink
];

interface HotCuePadsProps {
  hotCues: (number | null)[];           // array of 8 cue positions (null = empty)
  onSet: (index: number, position: number) => void;
  onJump: (index: number) => void;
  onClear: (index: number) => void;
  currentPosition: number;
  isDisabled?: boolean;
}

const HotCuePads: React.FC<HotCuePadsProps> = ({
  hotCues,
  onSet,
  onJump,
  onClear,
  currentPosition,
  isDisabled = false,
}) => {
  const handleClick = (index: number, e: React.MouseEvent) => {
    if (isDisabled) return;
    if (e.ctrlKey || e.metaKey) {
      // Ctrl/Cmd+click = clear cue
      onClear(index);
    } else if (hotCues[index] != null) {
      // Click on set cue = jump to it
      onJump(index);
    } else {
      // Click on empty = set cue at current position
      onSet(index, currentPosition);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Hot Cues</span>
        <span className="text-[9px] text-gray-600">⌘+click to clear</span>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {Array.from({ length: 8 }).map((_, i) => {
          const color = HOT_CUE_COLORS[i];
          const isSet = hotCues[i] != null;
          const position = hotCues[i];

          return (
            <button
              key={i}
              onClick={(e) => handleClick(i, e)}
              disabled={isDisabled}
              title={isSet ? `Jump to ${formatTime(position!)} (⌘+click to clear)` : `Set Hot Cue ${i + 1}`}
              className={`
                relative h-10 rounded flex flex-col items-center justify-center
                transition-all duration-100 select-none
                ${isSet
                  ? 'opacity-100 shadow-lg scale-100 active:scale-95'
                  : 'opacity-40 hover:opacity-60 active:opacity-80'
                }
                ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
              style={{
                background: isSet
                  ? `linear-gradient(135deg, ${color}cc, ${color}66)`
                  : `${color}1a`,
                border: `1.5px solid ${isSet ? color : color + '44'}`,
                boxShadow: isSet ? `0 0 8px ${color}66` : 'none',
              }}
            >
              <span className="text-[10px] font-bold text-white leading-none">{i + 1}</span>
              {isSet && position != null && (
                <span className="text-[8px] text-white/70 leading-none mt-0.5 font-mono">
                  {formatTime(position)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export { HOT_CUE_COLORS };
export default HotCuePads;
