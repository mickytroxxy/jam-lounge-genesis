import React from 'react';
import { Star, Music } from 'lucide-react';

interface DiscoLightsProps {
  isPlaying: boolean;
  deckId: 'A' | 'B';
  children: React.ReactNode;
  className?: string;
  enabled?: boolean;
}

const DiscoLights: React.FC<DiscoLightsProps> = ({
  isPlaying,
  deckId,
  children,
  className = '',
  enabled = true
}) => {
  console.log(`🕺 DiscoLights - Deck ${deckId}: enabled=${enabled}, playing=${isPlaying}`);

  // Don't render if disabled or not playing
  if (!enabled || !isPlaying) {
    return <div className={className}>{children}</div>;
  }

  // Disco colors for each deck
  const deckAColors = ['#FF0080', '#8000FF', '#FF8000', '#0080FF'];
  const deckBColors = ['#00FF80', '#0080FF', '#FF4000', '#00C0FF'];

  const colors = deckId === 'A' ? deckAColors : deckBColors;

  // Create 4 floating icons (2 stars, 2 music notes) - 24px size
  const icons = [
    { Icon: Star, position: 'top-4 left-4', delay: '0s', color: colors[0] },
    { Icon: Music, position: 'top-4 right-4', delay: '0.5s', color: colors[1] },
    { Icon: Star, position: 'bottom-4 left-4', delay: '1s', color: colors[2] },
    { Icon: Music, position: 'bottom-4 right-4', delay: '1.5s', color: colors[3] }
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Lightweight Disco Icons - 24px size */}
      {icons.map((icon, index) => (
        <div
          key={index}
          className={`absolute ${icon.position} pointer-events-none z-20 w-8 h-8 rounded-full flex items-center justify-center`}
          style={{
            backgroundColor: `${icon.color}20`,
            border: `1px solid ${icon.color}`,
            animation: `discoFloat-${deckId} 2s ease-in-out infinite`,
            animationDelay: icon.delay
          }}
        >
          <icon.Icon
            size={24}
            style={{
              color: icon.color,
              filter: 'drop-shadow(0 0 8px currentColor) brightness(1.5)',
              animation: `discoSpin-${deckId} 3s linear infinite`,
              animationDelay: icon.delay
            }}
          />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Lightweight CSS animations */}
      <style jsx>{`
        @keyframes discoSpin-${deckId} {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes discoFloat-${deckId} {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0px);
            opacity: 0.8;
          }
          50% {
            transform: translate(-50%, -50%) translateY(-3px);
            opacity: 1;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          @keyframes discoSpin-${deckId} {
            0% { opacity: 0.6; }
            100% { opacity: 1; }
          }

          @keyframes discoFloat-${deckId} {
            0% { opacity: 0.6; }
            100% { opacity: 1; }
          }
        }
      `}</style>
    </div>
  );
};

export default DiscoLights;
