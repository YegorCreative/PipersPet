import React from 'react';
import { useGameStore } from '../game/systems/useGameStore';
import { ArrowLeft, Bone, Heart, CheckCircle2 } from 'lucide-react';

export const PetProfile: React.FC = () => {
  const { goToMenu, totalTreats, puppyHappiness, completedMissions } = useGameStore();

  return (
    <div className="w-full h-full bg-[#96c773] flex flex-col items-center justify-center relative overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.2)]">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '60px 60px' }} />
      
      <div className="bg-white/90 backdrop-blur-md px-12 py-10 rounded-[3rem] shadow-2xl border-4 border-white w-full max-w-xl z-10 animate-[zoomIn_0.3s_ease-out_forwards]">
        
        <div className="flex items-center mb-10 relative">
          <button 
            onClick={() => goToMenu()}
            className="absolute left-0 p-3 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-4xl font-extrabold text-slate-800 w-full text-center">My Pets</h1>
        </div>
        
        <div className="flex flex-col items-center">
          {/* Avatar Area */}
          <div className="relative mb-6">
            <div className="w-40 h-40 bg-orange-100 rounded-full border-8 border-orange-300 flex items-center justify-center shadow-inner overflow-hidden">
              {/* Pet representation */}
              <div className="w-24 h-24 bg-orange-400 rounded-3xl flex items-center justify-center text-6xl shadow-lg border-4 border-white/50 animate-idle-bounce">
                🐶
              </div>
            </div>
            {/* Sparkles */}
            <div className="absolute -top-2 -right-2 text-3xl animate-bounce">✨</div>
            <div className="absolute top-10 -left-6 text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>✨</div>
          </div>

          <h2 className="text-4xl font-extrabold text-slate-800 mb-2">Buddy</h2>
          <span className="bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-8">
            Golden Puppy
          </span>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-pink-50 p-6 rounded-3xl border-2 border-pink-200 flex flex-col items-center justify-center">
              <Heart className="w-10 h-10 text-pink-500 fill-current mb-2" />
              <div className="text-3xl font-extrabold text-pink-700">{puppyHappiness}</div>
              <div className="text-pink-600 font-medium text-sm mt-1 uppercase tracking-wide">Happiness</div>
            </div>

            <div className="bg-amber-50 p-6 rounded-3xl border-2 border-amber-200 flex flex-col items-center justify-center">
              <Bone className="w-10 h-10 text-amber-500 fill-current mb-2" />
              <div className="text-3xl font-extrabold text-amber-700">{totalTreats}</div>
              <div className="text-amber-600 font-medium text-sm mt-1 uppercase tracking-wide">Treats Earned</div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-4 w-full bg-slate-50 p-6 rounded-3xl border-2 border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-100 p-3 rounded-2xl">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="font-bold text-slate-700 text-lg">Missions Completed</span>
            </div>
            <span className="text-2xl font-extrabold text-emerald-600">{completedMissions.length}</span>
          </div>

        </div>
      </div>
    </div>
  );
};
