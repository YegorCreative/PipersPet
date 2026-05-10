import React from 'react';

// ─── CORE ELEMENTS ──────────────────────────────────────────────────────────

export const Pond: React.FC<{ left: string; top: string; w?: string; h?: string; borderRadius?: string }> = ({
  left, top, w = '25%', h = '12%', borderRadius = '40% 60% 70% 30% / 40% 50% 60% 50%'
}) => (
  <div
    className="absolute shadow-[inset_0_0_30px_rgba(6,182,212,0.4),0_0_20px_rgba(6,182,212,0.1)]"
    style={{
      left, top, width: w, height: h, borderRadius,
      transform: 'translate(-50%,-50%)',
      backgroundColor: '#042f2e', // teal-950
      border: '1.5px solid #0e7490',
    }}
  >
    <div className="absolute top-1/4 left-1/4 w-1/2 h-1/4 border-t border-cyan-400/20 rounded-[50%] animate-pulse" />
    <div className="absolute top-1/2 left-1/3 w-1/3 h-1/4 border-t border-cyan-400/10 rounded-[50%] animate-pulse" style={{ animationDelay: '1.3s' }} />
  </div>
);

/** Dark Pine Tree – three overlapping triangles */
export const Tree: React.FC<{ left: string; top: string; scale?: number; variant?: 1|2|3 }> = ({ left, top, scale = 1, variant = 1 }) => {
  const colors = [
    ['#064e3b','#065f46','#047857'], // emerald tones
    ['#1c2a1e','#1a3a22','#1e4620'], // very dark green
    ['#022c22','#064e3b','#065f46'], // near-black
  ];
  const [c0,c1,c2] = colors[variant - 1];
  return (
    <div className="absolute flex flex-col items-center justify-end z-10" style={{ left, top, transform: `translate(-50%,-100%) scale(${scale})` }}>
      {/* Shadow */}
      <div className="absolute bottom-0 w-14 h-3 bg-black/50 rounded-full blur-md" style={{ transform: 'translateY(70%)' }} />
      <div className="relative flex flex-col items-center" style={{ gap: '-12px' }}>
        <div className="w-0 h-0" style={{ borderLeft:'18px solid transparent', borderRight:'18px solid transparent', borderBottom:`28px solid ${c0}`, marginBottom:'-10px', filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' }} />
        <div className="w-0 h-0" style={{ borderLeft:'24px solid transparent', borderRight:'24px solid transparent', borderBottom:`38px solid ${c1}`, marginBottom:'-12px', filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
        <div className="w-0 h-0" style={{ borderLeft:'30px solid transparent', borderRight:'30px solid transparent', borderBottom:`48px solid ${c2}`, filter:'drop-shadow(0 4px 8px rgba(0,0,0,0.6))' }} />
      </div>
      <div className="w-3 h-8 rounded-sm" style={{ backgroundColor:'#292524' }} />
    </div>
  );
};

/** Dense Bush – blocks paths / hides secrets */
export const Bush: React.FC<{ left: string; top: string; scale?: number }> = ({ left, top, scale = 1 }) => (
  <div className="absolute z-10" style={{ left, top, transform: `translate(-50%,-70%) scale(${scale})` }}>
    <div className="relative flex items-end justify-center">
      <div className="absolute w-12 h-10 bg-emerald-950 rounded-full shadow-[inset_0_-4px_8px_rgba(0,0,0,0.5)]" style={{ left:'-10px', top:'4px' }} />
      <div className="absolute w-14 h-12 bg-emerald-900 rounded-full shadow-[inset_0_-4px_8px_rgba(0,0,0,0.4)]" style={{ left:'4px', top:'0' }} />
      <div className="w-12 h-10 bg-emerald-800 rounded-full shadow-[inset_0_-4px_8px_rgba(0,0,0,0.3)]" style={{ position:'relative', left:'10px', top:'4px' }} />
    </div>
  </div>
);

/** Rugged dark rock */
export const Rock: React.FC<{ left: string; top: string; scale?: number }> = ({ left, top, scale = 1 }) => (
  <div
    className="absolute bg-slate-800 shadow-[inset_-3px_-3px_8px_rgba(0,0,0,0.6),3px_3px_8px_rgba(0,0,0,0.3)]"
    style={{
      left, top, transform: `translate(-50%,-50%) scale(${scale})`,
      width:'36px', height:'26px',
      borderRadius:'58% 42% 50% 50% / 60% 50% 50% 40%',
      borderBottom:'2px solid #0f172a',
    }}
  />
);

/** Ethereal glow-flower */
export const Flower: React.FC<{ left: string; top: string; color?: string }> = ({ left, top, color = 'bg-pink-500' }) => (
  <div className="absolute flex items-center justify-center animate-slow-pulse" style={{ left, top, transform:'translate(-50%,-50%)' }}>
    <div className={`absolute w-7 h-7 ${color} rounded-full blur-lg opacity-20`} />
    <div className={`absolute w-2 h-2 ${color} rounded-full opacity-80`} style={{ top:'-3px' }} />
    <div className={`absolute w-2 h-2 ${color} rounded-full opacity-80`} style={{ bottom:'-3px' }} />
    <div className={`absolute w-2 h-2 ${color} rounded-full opacity-80`} style={{ left:'-3px' }} />
    <div className={`absolute w-2 h-2 ${color} rounded-full opacity-80`} style={{ right:'-3px' }} />
    <div className="absolute w-1.5 h-1.5 bg-yellow-100 rounded-full z-10" />
  </div>
);

// ─── NEW STRUCTURAL ELEMENTS ─────────────────────────────────────────────────

/** Broken wooden fence segment */
export const Fence: React.FC<{ left: string; top: string; rotate?: number; length?: number }> = ({ left, top, rotate = 0, length = 80 }) => (
  <div className="absolute z-10" style={{ left, top, transform:`translate(-50%,-50%) rotate(${rotate}deg)`, width: length, height: 16 }}>
    {/* Rails */}
    <div className="absolute top-1/4 left-0 right-0 h-1.5 bg-amber-950 rounded opacity-80" />
    <div className="absolute top-3/4 left-0 right-0 h-1.5 bg-amber-950 rounded opacity-70" />
    {/* Posts */}
    {Array.from({ length: Math.round(length / 20) }).map((_, i) => (
      <div key={i} className="absolute top-0 bottom-0 w-1.5 bg-amber-900 rounded" style={{ left: i * 20 + 4, opacity: i % 3 === 1 ? 0.5 : 0.9 }} />
    ))}
  </div>
);

/** Ruin pillar / broken stone wall segment */
export const Ruin: React.FC<{ left: string; top: string; h?: number; broken?: boolean }> = ({ left, top, h = 60, broken = false }) => (
  <div className="absolute z-10" style={{ left, top, transform:'translate(-50%,-100%)' }}>
    <div
      className="relative bg-slate-700 shadow-[inset_-4px_0_10px_rgba(0,0,0,0.5)]"
      style={{ width: 22, height: h, borderRadius: broken ? '2px 8px 0 0' : '2px 2px 0 0' }}
    >
      {/* Stone texture lines */}
      {[0.25, 0.5, 0.75].map((frac) => (
        <div key={frac} className="absolute left-0 right-0 h-px bg-slate-900/60" style={{ top:`${frac * 100}%` }} />
      ))}
      {broken && <div className="absolute top-0 right-0 w-3 h-3 bg-slate-950 rounded-bl-full" />}
    </div>
    {/* Base stone */}
    <div className="w-7 h-3 bg-slate-800 rounded-sm -ml-1 shadow-md" />
  </div>
);

/** Archway between two pillars */
export const RuinArch: React.FC<{ left: string; top: string }> = ({ left, top }) => (
  <div className="absolute z-10 flex items-end space-x-6" style={{ left, top, transform:'translate(-50%,-100%)' }}>
    <Ruin left="0" top="0" h={70} broken />
    <div className="absolute top-0 left-0 right-0 h-8 border-b-4 border-slate-600 rounded-b-[50%] opacity-60" style={{ width:'100%' }} />
    <Ruin left="100%" top="0" h={65} broken />
  </div>
);

/** Soft fog zone – local atmospheric patch */
export const FogZone: React.FC<{ left: string; top: string; w?: string; h?: string; color?: string }> = ({
  left, top, w = '35%', h = '20%', color = 'rgba(100,116,139,0.08)'
}) => (
  <div
    className="absolute pointer-events-none z-20 animate-ambient-drift"
    style={{
      left, top, width: w, height: h,
      transform:'translate(-50%,-50%)',
      background: `radial-gradient(ellipse, ${color} 0%, transparent 80%)`,
      animationDuration:'25s',
    }}
  />
);

/** Worn dirt path – SVG overlay stretched across full map */
export const WindingPath: React.FC = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 100 100">
    {/* Main north-south path */}
    <path d="M 50 95 Q 50 78 50 70 Q 50 62 50 55 Q 50 45 50 35 Q 50 25 50 15 Q 50 10 50 8"
      fill="none" stroke="#431407" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
    {/* Branch west to ruins */}
    <path d="M 50 68 Q 38 63 28 55 Q 20 48 18 45"
      fill="none" stroke="#431407" strokeWidth="2.5" strokeLinecap="round" opacity="0.25" />
    {/* Branch east to glade */}
    <path d="M 50 62 Q 60 60 68 58 Q 72 56 74 52"
      fill="none" stroke="#431407" strokeWidth="2.5" strokeLinecap="round" opacity="0.25" />
    {/* Secret shortcut – faint  */}
    <path d="M 28 55 Q 42 52 50 55"
      fill="none" stroke="#431407" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3" opacity="0.15" />
    {/* Camp clearing circle */}
    <ellipse cx="50" cy="87" rx="12" ry="6" fill="#431407" opacity="0.12" />
  </svg>
);

/** Lookout hill – elevation illusion via gradient & shadow */
export const Hill: React.FC<{ left: string; top: string }> = ({ left, top }) => (
  <div
    className="absolute pointer-events-none z-0"
    style={{
      left, top, transform:'translate(-50%,-50%)',
      width:'28%', height:'14%',
      borderRadius:'50%',
      background:'radial-gradient(ellipse at 40% 35%, #064e3b 0%, #022c22 60%, transparent 80%)',
      boxShadow:'0 12px 30px rgba(0,0,0,0.5)',
    }}
  />
);

/** River crossing – wide horizontal water band */
export const River: React.FC<{ top: string }> = ({ top }) => (
  <div
    className="absolute left-0 right-0 pointer-events-none z-0"
    style={{
      top, height:'7%',
      background:'linear-gradient(180deg, #042f2e 0%, #065f46 40%, #042f2e 100%)',
      borderTop:'1.5px solid #0e7490',
      borderBottom:'1.5px solid #0e7490',
      boxShadow:'inset 0 4px 20px rgba(6,182,212,0.15), 0 0 30px rgba(6,182,212,0.08)',
    }}
  >
    {/* Ripple lines */}
    <div className="absolute top-1/3 left-1/4 w-1/2 h-px bg-cyan-400/20 rounded animate-pulse" />
    <div className="absolute top-2/3 left-1/3 w-1/3 h-px bg-cyan-400/15 rounded animate-pulse" style={{ animationDelay:'0.8s' }} />
  </div>
);

/** Stepping stones over river */
export const Stone: React.FC<{ left: string; top: string }> = ({ left, top }) => (
  <div
    className="absolute bg-slate-600 shadow-[0_3px_8px_rgba(0,0,0,0.5)]"
    style={{
      left, top, transform:'translate(-50%,-50%)',
      width: 28, height: 18,
      borderRadius:'50% 45% 55% 48% / 55% 50% 48% 52%',
    }}
  />
);

/** Ancient altar / campfire remnant */
export const TreatAltar: React.FC<{ left: string; top: string }> = ({ left, top }) => (
  <div
    className="absolute bg-slate-900/90 border border-amber-900/60 rounded-full shadow-[0_0_25px_rgba(217,119,6,0.15)] flex items-center justify-center"
    style={{ left, top, width:'5%', height:'3%', transform:'translate(-50%,-50%)', minWidth:40, minHeight:24 }}
  >
    <div className="w-3/4 h-3/4 border border-dashed border-amber-700/50 rounded-full animate-[spin_20s_linear_infinite]" />
  </div>
);

/** Cosy campfire glow (decorative) */
export const CampFire: React.FC<{ left: string; top: string }> = ({ left, top }) => (
  <div className="absolute" style={{ left, top, transform:'translate(-50%,-50%)' }}>
    {/* Glow */}
    <div className="absolute w-16 h-16 bg-orange-500 rounded-full blur-2xl opacity-10 animate-pulse" style={{ transform:'translate(-50%,-50%) translate(8px,8px)' }} />
    {/* Stones */}
    <div className="relative flex items-end justify-center">
      <div className="w-4 h-2 bg-slate-700 rounded-full -mr-1" />
      <div className="w-4 h-2 bg-slate-700 rounded-full -ml-1" />
    </div>
    <div className="flex justify-center">
      <div className="w-1 h-3 bg-orange-500 rounded-full opacity-80 animate-pulse" style={{ animationDelay:'0.1s' }} />
      <div className="w-1 h-4 bg-amber-400 rounded-full opacity-90 animate-pulse mx-0.5" />
      <div className="w-1 h-3 bg-orange-400 rounded-full opacity-80 animate-pulse" style={{ animationDelay:'0.2s' }} />
    </div>
  </div>
);

/** Floating ambient firefly particles */
export const AmbientParticles: React.FC = () => {
  const particles = Array.from({ length: 20 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
      {particles.map((_, i) => (
        <div
          key={i}
          className="absolute bg-yellow-200 rounded-full blur-[1px] animate-ambient-drift"
          style={{
            width:  Math.random() * 3 + 1 + 'px',
            height: Math.random() * 3 + 1 + 'px',
            left:   Math.random() * 100 + '%',
            top:    Math.random() * 100 + '%',
            opacity: Math.random() * 0.4 + 0.1,
            animationDelay:    `-${Math.random() * 20}s`,
            animationDuration: `${Math.random() * 10 + 15}s`,
          }}
        />
      ))}
    </div>
  );
};
