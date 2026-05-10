import React from 'react';

// Soft rounded pond
export const Pond: React.FC<{ left: string; top: string }> = ({ left, top }) => (
  <div 
    className="absolute bg-blue-300 shadow-inner"
    style={{ 
      left, top, 
      width: '25%', height: '20%', 
      borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
      transform: 'translate(-50%, -50%)',
      border: '4px solid #8fc9e0'
    }}
  >
    {/* Water ripples */}
    <div className="absolute top-1/4 left-1/4 w-1/2 h-1/4 border-t-2 border-white/40 rounded-[50%]" />
    <div className="absolute top-1/2 left-1/3 w-1/3 h-1/4 border-t-2 border-white/40 rounded-[50%]" />
  </div>
);

// A simple tree made of overlapping green circles and a brown trunk
export const Tree: React.FC<{ left: string; top: string; scale?: number }> = ({ left, top, scale = 1 }) => (
  <div 
    className="absolute flex flex-col items-center justify-end z-10"
    style={{ left, top, transform: `translate(-50%, -100%) scale(${scale})` }}
  >
    <div className="relative w-16 h-16 mb-[-12px]">
      <div className="absolute top-0 left-2 w-12 h-12 bg-emerald-500 rounded-full shadow-md" />
      <div className="absolute top-4 left-[-4px] w-10 h-10 bg-emerald-600 rounded-full shadow-md" />
      <div className="absolute top-4 right-[-4px] w-12 h-12 bg-emerald-400 rounded-full shadow-md" />
    </div>
    <div className="w-4 h-6 bg-amber-800 rounded-sm shadow-inner" />
  </div>
);

// A rocky patch
export const Rock: React.FC<{ left: string; top: string; scale?: number }> = ({ left, top, scale = 1 }) => (
  <div 
    className="absolute bg-slate-400 shadow-md"
    style={{ 
      left, top, transform: `translate(-50%, -50%) scale(${scale})`,
      width: '30px', height: '20px',
      borderRadius: '60% 40% 50% 50% / 60% 50% 50% 40%'
    }}
  />
);

// Cute flowers
export const Flower: React.FC<{ left: string; top: string; color?: string }> = ({ left, top, color = 'bg-pink-300' }) => (
  <div 
    className="absolute flex items-center justify-center"
    style={{ left, top, transform: 'translate(-50%, -50%)' }}
  >
    <div className={`absolute w-3 h-3 ${color} rounded-full top-[-4px]`} />
    <div className={`absolute w-3 h-3 ${color} rounded-full bottom-[-4px]`} />
    <div className={`absolute w-3 h-3 ${color} rounded-full left-[-4px]`} />
    <div className={`absolute w-3 h-3 ${color} rounded-full right-[-4px]`} />
    <div className="absolute w-2 h-2 bg-yellow-300 rounded-full z-10" />
  </div>
);

// Dirt Path using a responsive SVG
export const WindingPath: React.FC = () => (
  <svg 
    className="absolute inset-0 w-full h-full pointer-events-none opacity-40" 
    preserveAspectRatio="none"
    viewBox="0 0 100 100"
  >
    <path 
      d="M 50 50 Q 60 70 80 80" 
      fill="none" 
      stroke="#c29a67" 
      strokeWidth="6" 
      strokeLinecap="round" 
    />
    <path 
      d="M 50 50 Q 40 30 20 20" 
      fill="none" 
      stroke="#c29a67" 
      strokeWidth="6" 
      strokeLinecap="round" 
    />
  </svg>
);

// Puppy Corner base
export const PetCorner: React.FC<{ left: string; top: string }> = ({ left, top }) => (
  <div 
    className="absolute bg-orange-100/50 border-4 border-dashed border-orange-300 rounded-3xl"
    style={{ 
      left, top, 
      width: '15%', height: '15%', 
      transform: 'translate(-50%, -50%)' 
    }}
  />
);

// Treat Altar base
export const TreatAltar: React.FC<{ left: string; top: string }> = ({ left, top }) => (
  <div 
    className="absolute bg-pink-100/60 border-2 border-pink-300 rounded-full shadow-inner flex items-center justify-center"
    style={{ 
      left, top, 
      width: '8%', height: '8%', 
      transform: 'translate(-50%, -50%)' 
    }}
  >
    <div className="w-3/4 h-3/4 border-2 border-dashed border-pink-400 rounded-full animate-[spin_10s_linear_infinite]" />
  </div>
);
