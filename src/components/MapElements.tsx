import React from 'react';

// Mystical spring pond
export const Pond: React.FC<{ left: string; top: string }> = ({ left, top }) => (
  <div 
    className="absolute shadow-[inset_0_0_20px_rgba(6,182,212,0.5),_0_0_30px_rgba(6,182,212,0.2)]"
    style={{ 
      left, top, 
      width: '25%', height: '20%', 
      borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#083344', // cyan-950
      border: '2px solid #0e7490' // cyan-700
    }}
  >
    {/* Water ripples */}
    <div className="absolute top-1/4 left-1/4 w-1/2 h-1/4 border-t border-cyan-400/30 rounded-[50%] animate-pulse" />
    <div className="absolute top-1/2 left-1/3 w-1/3 h-1/4 border-t border-cyan-400/20 rounded-[50%] animate-pulse" style={{ animationDelay: '1s' }} />
  </div>
);

// Dark Pine Tree
export const Tree: React.FC<{ left: string; top: string; scale?: number }> = ({ left, top, scale = 1 }) => (
  <div 
    className="absolute flex flex-col items-center justify-end z-10"
    style={{ left, top, transform: `translate(-50%, -100%) scale(${scale})` }}
  >
    {/* Tree shadow */}
    <div className="absolute bottom-0 w-16 h-4 bg-black/40 rounded-full blur-[4px]" style={{ transform: 'translateY(50%)' }} />
    
    <div className="relative w-16 h-24 mb-[-8px] flex flex-col items-center">
      {/* Pine layers */}
      <div className="absolute top-0 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-emerald-800 drop-shadow-md z-30" />
      <div className="absolute top-4 w-0 h-0 border-l-[26px] border-l-transparent border-r-[26px] border-r-transparent border-b-[40px] border-b-emerald-900 drop-shadow-md z-20" />
      <div className="absolute top-10 w-0 h-0 border-l-[32px] border-l-transparent border-r-[32px] border-r-transparent border-b-[50px] border-b-emerald-950 drop-shadow-md z-10" />
    </div>
    <div className="w-3 h-8 bg-slate-800 rounded-sm shadow-inner" />
  </div>
);

// Dark rugged rock
export const Rock: React.FC<{ left: string; top: string; scale?: number }> = ({ left, top, scale = 1 }) => (
  <div 
    className="absolute bg-slate-800 shadow-[inset_-4px_-4px_10px_rgba(0,0,0,0.5),_4px_4px_10px_rgba(0,0,0,0.3)]"
    style={{ 
      left, top, transform: `translate(-50%, -50%) scale(${scale})`,
      width: '35px', height: '25px',
      borderRadius: '60% 40% 50% 50% / 60% 50% 50% 40%',
      borderBottom: '2px solid #0f172a'
    }}
  />
);

// Ethereal flower
export const Flower: React.FC<{ left: string; top: string; color?: string }> = ({ left, top, color = 'bg-pink-500' }) => (
  <div 
    className="absolute flex items-center justify-center animate-slow-pulse"
    style={{ left, top, transform: 'translate(-50%, -50%)' }}
  >
    {/* Glow */}
    <div className={`absolute w-8 h-8 ${color} rounded-full blur-md opacity-20`} />
    
    <div className={`absolute w-2 h-2 ${color} rounded-full top-[-3px] opacity-80`} />
    <div className={`absolute w-2 h-2 ${color} rounded-full bottom-[-3px] opacity-80`} />
    <div className={`absolute w-2 h-2 ${color} rounded-full left-[-3px] opacity-80`} />
    <div className={`absolute w-2 h-2 ${color} rounded-full right-[-3px] opacity-80`} />
    <div className="absolute w-1.5 h-1.5 bg-yellow-100 rounded-full z-10" />
  </div>
);

// Worn dirt path
export const WindingPath: React.FC = () => (
  <svg 
    className="absolute inset-0 w-full h-full pointer-events-none opacity-20 mix-blend-overlay" 
    preserveAspectRatio="none"
    viewBox="0 0 100 100"
  >
    <path 
      d="M 50 50 Q 60 70 80 80" 
      fill="none" 
      stroke="#78350f" // amber-900
      strokeWidth="8" 
      strokeLinecap="round" 
      filter="blur(2px)"
    />
    <path 
      d="M 50 50 Q 40 30 20 20" 
      fill="none" 
      stroke="#78350f" 
      strokeWidth="8" 
      strokeLinecap="round" 
      filter="blur(2px)"
    />
  </svg>
);

// Mysterious Pet Corner
export const PetCorner: React.FC<{ left: string; top: string }> = ({ left, top }) => (
  <div 
    className="absolute bg-slate-900/40 border border-slate-700/50 rounded-3xl backdrop-blur-sm"
    style={{ 
      left, top, 
      width: '15%', height: '15%', 
      transform: 'translate(-50%, -50%)' 
    }}
  />
);

// Ancient Altar
export const TreatAltar: React.FC<{ left: string; top: string }> = ({ left, top }) => (
  <div 
    className="absolute bg-slate-900/80 border border-amber-900/50 rounded-full shadow-[0_0_30px_rgba(217,119,6,0.1)] flex items-center justify-center backdrop-blur-md"
    style={{ 
      left, top, 
      width: '8%', height: '8%', 
      transform: 'translate(-50%, -50%)' 
    }}
  >
    <div className="w-3/4 h-3/4 border border-dashed border-amber-700/50 rounded-full animate-[spin_20s_linear_infinite]" />
  </div>
);

// Atmospheric Overlays
export const AmbientParticles: React.FC = () => {
  const particles = Array.from({ length: 15 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
      {particles.map((_, i) => (
        <div 
          key={i}
          className="absolute bg-yellow-200 rounded-full blur-[1px] animate-ambient-drift"
          style={{
            width: Math.random() * 3 + 1 + 'px',
            height: Math.random() * 3 + 1 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            opacity: Math.random() * 0.5 + 0.1,
            animationDelay: `-${Math.random() * 20}s`,
            animationDuration: `${Math.random() * 10 + 15}s`
          }}
        />
      ))}
    </div>
  );
};
