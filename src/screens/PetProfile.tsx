import React from 'react';
import { useGameStore } from '../game/systems/useGameStore';
import { ArrowLeft, Bone, Heart, CheckCircle2 } from 'lucide-react';

export const PetProfile: React.FC = () => {
  const { goToMenu, totalTreats, puppyHappiness, completedMissions } = useGameStore();

  return (
    <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-slate-950" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 mix-blend-overlay" />

      <div className="bg-slate-900/60 backdrop-blur-xl px-12 py-10 rounded-[2.5rem] shadow-2xl border border-slate-700/50 w-full max-w-xl z-10 animate-[zoomIn_0.6s_ease-out_forwards]">
        
        <div className="flex items-center mb-10 relative">
          <button 
            onClick={() => goToMenu()}
            className="absolute left-0 p-3 bg-slate-800/50 hover:bg-slate-700 rounded-full text-slate-300 transition-colors border border-slate-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400 w-full text-center tracking-wide">COMPANION</h1>
        </div>
        
        <div className="flex flex-col items-center">
          {/* Avatar Area */}
          <div className="relative mb-8">
            <div className="w-40 h-40 bg-slate-800/80 rounded-full border border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.1)] overflow-hidden">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-cyan-600/10 rounded-full flex items-center justify-center border border-cyan-400/40 animate-slow-pulse">
                 {/* Stylized geometric pet icon instead of emoji */}
                 <div className="relative w-12 h-12">
                   <div className="absolute top-2 left-2 w-3 h-3 bg-cyan-400 rounded-full blur-[2px] animate-pulse" />
                   <div className="absolute top-2 right-2 w-3 h-3 bg-cyan-400 rounded-full blur-[2px] animate-pulse" style={{ animationDelay: '0.2s' }} />
                   <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-3 bg-slate-400/50 rounded-full" />
                 </div>
              </div>
            </div>
            {/* Ethereal Sparkles */}
            <div className="absolute -top-2 -right-2 w-2 h-2 bg-cyan-300 rounded-full blur-[1px] animate-pulse" />
            <div className="absolute top-10 -left-6 w-1 h-1 bg-cyan-200 rounded-full blur-[1px] animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>

          <h2 className="text-4xl font-bold text-slate-100 mb-2 tracking-tight">Spirit Guide</h2>
          <span className="text-cyan-400/80 text-xs font-semibold uppercase tracking-[0.2em] mb-10">
            Loyal Familiar
          </span>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center">
              <Heart className="w-8 h-8 text-pink-500/70 fill-current mb-3" />
              <div className="text-3xl font-light text-slate-200 mb-1">{puppyHappiness}</div>
              <div className="text-slate-500 text-[10px] uppercase tracking-[0.15em] font-semibold">Bond Strength</div>
            </div>

            <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center">
              <Bone className="w-8 h-8 text-amber-500/70 fill-current mb-3" />
              <div className="text-3xl font-light text-slate-200 mb-1">{totalTreats}</div>
              <div className="text-slate-500 text-[10px] uppercase tracking-[0.15em] font-semibold">Offerings Found</div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-4 w-full bg-cyan-900/10 p-5 rounded-2xl border border-cyan-800/30 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-cyan-900/30 p-2.5 rounded-xl border border-cyan-800/50">
                <CheckCircle2 className="w-5 h-5 text-cyan-500" />
              </div>
              <span className="font-medium text-slate-300 tracking-wide">Quests Completed</span>
            </div>
            <span className="text-2xl font-light text-cyan-400">{completedMissions.length}</span>
          </div>

        </div>
      </div>
    </div>
  );
};
