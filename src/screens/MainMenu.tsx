import React from 'react';
import { useGameStore } from '../game/systems/useGameStore';
import { PawPrint, Map, Sparkles, Bone, Heart, RotateCcw } from 'lucide-react';

export const MainMenu: React.FC = () => {
  const { startMission, goToMissions, goToPets, totalTreats, puppyHappiness, resetProgress } = useGameStore();

  return (
    <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-950 to-slate-950" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 mix-blend-overlay" />
      
      {/* Ambient glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] animate-ambient-drift" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] animate-ambient-drift" style={{ animationDelay: '-10s' }} />

      <div className="bg-slate-900/60 backdrop-blur-xl px-16 py-14 rounded-3xl shadow-2xl border border-slate-700/50 flex flex-col items-center z-10 animate-[zoomIn_0.8s_ease-out_forwards]">
        
        <div className="flex items-center justify-center mb-8 text-cyan-400 opacity-90">
          <PawPrint className="w-16 h-16 fill-current animate-slow-pulse" />
        </div>
        
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-slate-100 to-slate-400 mb-3 tracking-tight text-center drop-shadow-sm">Paws of <br/> Adventure</h1>
        <p className="text-lg text-slate-400 mb-10 font-medium tracking-wide uppercase">An Indie Exploration Game</p>
        
        {/* Progress Display */}
        <div className="flex space-x-6 mb-10">
          <div className="flex items-center space-x-3 bg-slate-800/50 px-5 py-2.5 rounded-2xl border border-slate-700/50 shadow-inner">
            <Bone className="w-5 h-5 text-amber-400/80 fill-current" />
            <span className="font-bold text-slate-200 text-lg">{totalTreats}</span>
          </div>
          <div className="flex items-center space-x-3 bg-slate-800/50 px-5 py-2.5 rounded-2xl border border-slate-700/50 shadow-inner">
            <Heart className="w-5 h-5 text-pink-500/80 fill-current" />
            <span className="font-bold text-slate-200 text-lg">{puppyHappiness}</span>
          </div>
        </div>
        
        <div className="flex flex-col w-full space-y-4 mb-8">
          <button 
            onClick={() => startMission(1)}
            className="group relative flex items-center justify-center w-full bg-cyan-600/90 hover:bg-cyan-500 text-white font-bold text-xl px-10 py-4 rounded-full transition-all shadow-[0_0_20px_rgba(8,145,178,0.2)] hover:shadow-[0_0_30px_rgba(8,145,178,0.4)] overflow-hidden border border-cyan-400/30"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10 flex items-center tracking-wide">Enter the Wilds <PawPrint className="ml-3 w-5 h-5" /></span>
          </button>
          
          <button 
            onClick={() => goToMissions()}
            className="flex items-center justify-center w-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-medium text-lg px-10 py-4 rounded-full transition-all border border-slate-700 hover:border-slate-500"
          >
            Quest Log <Map className="ml-3 w-4 h-4 text-slate-400" />
          </button>
          
          <button 
            onClick={() => goToPets()}
            className="flex items-center justify-center w-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-medium text-lg px-10 py-4 rounded-full transition-all border border-slate-700 hover:border-slate-500"
          >
            Companions <Sparkles className="ml-3 w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Reset Progress */}
        <button 
          onClick={() => {
            if (window.confirm('Are you sure you want to forsake this journey and start anew?')) {
              resetProgress();
            }
          }}
          className="flex items-center space-x-2 text-slate-600 hover:text-red-400/80 transition-colors mt-4 text-xs font-semibold tracking-wider uppercase"
        >
          <RotateCcw className="w-3 h-3" /> <span>Reset Journey</span>
        </button>
      </div>
    </div>
  );
};
