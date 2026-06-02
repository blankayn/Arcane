import { useEffect, useState, useRef } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = Math.random() * 15 + 5;
        return Math.min(prev + increment, 100);
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onComplete, 600);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{
        zIndex: 9999,
        backgroundColor: '#0A0A0F',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.6s ease-out',
        pointerEvents: visible ? 'all' : 'none',
      }}
    >
      {/* Background hexagons */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <svg viewBox="0 0 400 400" className="w-full h-full" style={{ animation: 'spin-slow 120s linear infinite' }}>
          <polygon points="200,20 380,110 380,290 200,380 20,290 20,110" fill="none" stroke="#00F0FF" strokeWidth="0.5" />
          <polygon points="200,60 340,130 340,270 200,340 60,270 60,130" fill="none" stroke="#C49A3C" strokeWidth="0.3" />
          <polygon points="200,100 300,150 300,250 200,300 100,250 100,150" fill="none" stroke="#00F0FF" strokeWidth="0.2" />
        </svg>
      </div>

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)',
        }}
      />

      {/* Main title with glitch effect */}
      <div className="relative mb-4">
        <h1
          className="font-display text-6xl md:text-8xl tracking-[0.2em]"
          style={{ color: '#E2E2E2', textShadow: '0 0 40px rgba(0, 240, 255, 0.3)' }}
        >
          ARCANE
        </h1>
        {/* Glitch layers */}
        <h1
          className="font-display text-6xl md:text-8xl tracking-[0.2em] absolute inset-0"
          style={{
            color: '#00F0FF',
            animation: 'glitch-1 3s infinite linear',
            opacity: 0.7,
          }}
        >
          ARCANE
        </h1>
        <h1
          className="font-display text-6xl md:text-8xl tracking-[0.2em] absolute inset-0"
          style={{
            color: '#C49A3C',
            animation: 'glitch-2 3s infinite linear',
            opacity: 0.5,
          }}
        >
          ARCANE
        </h1>
      </div>

      {/* Subtitle */}
      <div className="overflow-hidden mb-12">
        <p
          className="font-body text-sm tracking-[0.5em] uppercase"
          style={{
            color: '#00F0FF',
            opacity: 0.7,
            animation: 'type-in 1.5s steps(20) 0.5s both',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          HEXTECH ARCHIVES
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-64 md:w-96 relative">
        <div
          className="h-[2px] rounded-full overflow-hidden"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #C49A3C, #00F0FF)',
              boxShadow: '0 0 10px rgba(0, 240, 255, 0.5)',
            }}
          />
        </div>
        <div className="flex justify-between mt-3">
          <span className="font-body text-[10px] tracking-widest uppercase" style={{ color: 'rgba(226,226,226,0.3)' }}>
            Initializing
          </span>
          <span className="font-body text-[10px] tracking-wider" style={{ color: '#00F0FF', opacity: 0.6 }}>
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
}
