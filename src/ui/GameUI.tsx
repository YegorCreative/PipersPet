import React from 'react';
import { Bone, CheckCircle2 } from 'lucide-react';
import { useGameStore } from '../game/systems/useGameStore';

export const GameUI: React.FC = () => {
  const { hasTreat, missionComplete, playerPosition, puppyPosition } = useGameStore();

  const getDist = (p1: { x: number, y: number }, p2: { x: number, y: number }) => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  const isNearPuppy = getDist(playerPosition, puppyPosition) < 10;

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20 font-sans">
      {/* Top Left: Mission Objective */}
      <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-6 py-4 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-1">Mission</h2>
        <p className="text-slate-600 font-medium">Find the puppy and give it a treat!</p>
      </div>

      {/* Top Right: Inventory */}
      <div className="absolute top-6 right-6 flex items-center space-x-3">
        <div className={`flex items-center justify-center w-16 h-16 rounded-3xl shadow-sm border transition-all duration-300 ${hasTreat ? 'bg-amber-100 border-amber-300 scale-110' : 'bg-white/90 border-slate-100'}`}>
          <Bone className={`w-8 h-8 ${hasTreat ? 'text-amber-500 animate-pulse' : 'text-slate-300'}`} />
        </div>
      </div>

      {/* Center: Mission Complete */}
      {missionComplete && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm pointer-events-auto">
          <div className="bg-white px-10 py-8 rounded-[2rem] shadow-2xl border border-emerald-100 text-center animate-bounce">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-500" />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Mission Complete!</h1>
            <p className="text-lg text-slate-600 mb-6">You fed the puppy. Great job!</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xl px-8 py-4 rounded-full transition-colors shadow-lg shadow-emerald-500/30"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
      
      {/* Interaction Prompt */}
      {!missionComplete && isNearPuppy && hasTreat && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-6 py-3 rounded-full shadow-lg font-bold text-lg animate-bounce">
          Press 'E' to Feed Puppy!
        </div>
      )}

      {/* Bottom Center: Controls Hint */}
      {!missionComplete && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-sm text-slate-600 font-medium">
          Use WASD or Arrow Keys to move
        </div>
      )}
    </div>
  );
};
