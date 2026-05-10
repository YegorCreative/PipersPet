import React from 'react';
import { useGameStore } from '../game/systems/useGameStore';
import { PawPrint, Map, Sparkles, Bone, Heart, RotateCcw } from 'lucide-react';

export const MainMenu: React.FC = () => {
  const { startMission, goToMissions, goToPets, totalTreats, puppyHappiness, resetProgress } = useGameStore();

  return (
    <div className="w-full h-full bg-[#96c773] flex flex-col items-center justify-center relative overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.2)]">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '60px 60px' }} />
      
      <div className="bg-white/90 backdrop-blur-md px-16 py-12 rounded-[3rem] shadow-2xl border-4 border-white flex flex-col items-center z-10 animate-[zoomIn_0.5s_ease-out_forwards]">
        
        <div className="flex items-center justify-center mb-6 text-orange-400 animate-bounce">
          <PawPrint className="w-20 h-20 fill-current" />
        </div>
        
        <h1 className="text-6xl font-extrabold text-slate-800 mb-2 tracking-tight text-center">Paws of <br/> Adventure</h1>
        <p className="text-xl text-slate-500 mb-6 font-medium">A cozy pet rescue game</p>
        
        {/* Progress Display */}
        <div className="flex space-x-6 mb-8">
          <div className="flex items-center space-x-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200 shadow-sm">
            <Bone className="w-6 h-6 text-amber-500 fill-current" />
            <span className="font-bold text-amber-700 text-lg">{totalTreats}</span>
          </div>
          <div className="flex items-center space-x-2 bg-pink-50 px-4 py-2 rounded-2xl border border-pink-200 shadow-sm">
            <Heart className="w-6 h-6 text-pink-500 fill-current" />
            <span className="font-bold text-pink-700 text-lg">{puppyHappiness}</span>
          </div>
        </div>
        
        <div className="flex flex-col w-full space-y-4 mb-8">
          <button 
            onClick={() => startMission(1)}
            className="group relative flex items-center justify-center w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-2xl px-10 py-5 rounded-full transition-transform hover:scale-105 shadow-lg shadow-emerald-500/30 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10 flex items-center">Play <PawPrint className="ml-3 w-6 h-6" /></span>
          </button>
          
          <button 
            onClick={() => goToMissions()}
            className="flex items-center justify-center w-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-xl px-10 py-4 rounded-full transition-transform hover:scale-105 shadow-lg shadow-blue-500/30"
          >
            Missions <Map className="ml-3 w-5 h-5" />
          </button>
          
          <button 
            onClick={() => goToPets()}
            className="flex items-center justify-center w-full bg-pink-500 hover:bg-pink-600 text-white font-bold text-xl px-10 py-4 rounded-full transition-transform hover:scale-105 shadow-lg shadow-pink-500/30"
          >
            Pets <Sparkles className="ml-3 w-5 h-5" />
          </button>
        </div>

        {/* Reset Progress */}
        <button 
          onClick={() => {
            if (window.confirm('Are you sure you want to reset all your progress?')) {
              resetProgress();
            }
          }}
          className="flex items-center space-x-2 text-slate-400 hover:text-red-500 transition-colors mt-2 text-sm font-bold"
        >
          <RotateCcw className="w-4 h-4" /> <span>Reset Progress</span>
        </button>
      </div>
    </div>
  );
};
