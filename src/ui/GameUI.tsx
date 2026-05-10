import React from 'react';
import { Bone, Star, ArrowLeft, Dribbble, Key, Footprints, Hand, Search, HandHeart } from 'lucide-react';
import { useGameStore, PuppyCommand } from '../game/systems/useGameStore';

const CommandButton: React.FC<{ command: PuppyCommand, active: boolean, label: string, hotkey: string, onClick: () => void, icon: React.ReactNode }> = ({ active, label, hotkey, onClick, icon }) => (
  <button 
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-2xl transition-all duration-300 font-bold ${active ? 'bg-orange-500 text-white shadow-md scale-105' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'}`}
  >
    <div className={`w-5 h-5 flex items-center justify-center rounded-md text-xs font-black ${active ? 'bg-white/20' : 'bg-white text-slate-400'}`}>
      {hotkey}
    </div>
    {icon}
    <span>{label}</span>
  </button>
);

export const GameUI: React.FC = () => {
  const { currentMission, flowersCollected, hasToy, hasKey, activeCommand, setCommand, startNextMission, hasTreat, missionComplete, playerPosition, puppyPosition, resetGame, goToMenu } = useGameStore();

  const getDist = (p1: { x: number, y: number }, p2: { x: number, y: number }) => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  const isNearPuppy = getDist(playerPosition, puppyPosition) < 10;

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20 font-sans">
      {/* Top Left: Navigation & Mission Objective */}
      <div className="absolute top-6 left-6 flex flex-col space-y-3">
        <button 
          onClick={() => goToMenu()}
          className="pointer-events-auto flex items-center justify-center space-x-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-slate-100 hover:bg-slate-50 hover:scale-105 transition-all w-max text-slate-600 font-bold"
        >
          <ArrowLeft className="w-5 h-5" /> <span>Menu</span>
        </button>
        <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-1">Mission {currentMission}</h2>
          <p className="text-slate-600 font-medium">
            {currentMission === 1 ? 'Find the puppy and give it a treat!' : 
             currentMission === 2 ? `Collect 3 flowers for the puppy. (${flowersCollected}/3)` :
             currentMission === 3 ? 'Find Buddy\'s lost toy.' :
             'Use Buddy to find the hidden key.'}
          </p>
        </div>
      </div>

      {/* Top Right: Inventory */}
      <div className="absolute top-6 right-6 flex items-center space-x-3">
        {currentMission === 1 ? (
          <div className={`flex items-center justify-center w-16 h-16 rounded-3xl shadow-sm border transition-all duration-300 ${hasTreat ? 'bg-amber-100 border-amber-300 scale-110' : 'bg-white/90 border-slate-100'}`}>
            <Bone className={`w-8 h-8 ${hasTreat ? 'text-amber-500 animate-pulse' : 'text-slate-300'}`} />
          </div>
        ) : currentMission === 2 ? (
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`flex items-center justify-center w-12 h-12 rounded-2xl shadow-sm border transition-all duration-300 ${flowersCollected > i ? 'bg-purple-100 border-purple-300 scale-110' : 'bg-white/90 border-slate-100'}`}>
                <span className={`text-2xl ${flowersCollected > i ? 'animate-pulse' : 'opacity-30 grayscale'}`}>🌸</span>
              </div>
            ))}
          </div>
        ) : currentMission === 3 ? (
          <div className={`flex items-center justify-center w-16 h-16 rounded-3xl shadow-sm border transition-all duration-300 ${hasToy ? 'bg-blue-100 border-blue-300 scale-110' : 'bg-white/90 border-slate-100'}`}>
            <Dribbble className={`w-8 h-8 ${hasToy ? 'text-blue-500 animate-pulse' : 'text-slate-300'}`} />
          </div>
        ) : (
          <div className={`flex items-center justify-center w-16 h-16 rounded-3xl shadow-sm border transition-all duration-300 ${hasKey ? 'bg-amber-100 border-amber-300 scale-110' : 'bg-white/90 border-slate-100'}`}>
            <Key className={`w-8 h-8 ${hasKey ? 'text-amber-500 animate-pulse' : 'text-slate-300'}`} />
          </div>
        )}
      </div>

      {/* Center: Mission Complete */}
      {missionComplete && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-md pointer-events-auto z-50">
          {/* Confetti / Celebration burst background effect */}
          <div className="absolute w-[600px] h-[600px] bg-yellow-300/20 rounded-full blur-3xl animate-pulse" />
          
          <div className="bg-white px-12 py-10 rounded-[3rem] shadow-2xl border-4 border-amber-100 text-center relative animate-[zoomIn_0.5s_ease-out_forwards] transform scale-0">
            {/* Stars */}
            <div className="flex justify-center space-x-2 mb-6">
              <Star className="w-12 h-12 text-yellow-400 fill-current animate-[bounce_1s_ease-in-out_infinite]" style={{ animationDelay: '0ms' }} />
              <Star className="w-16 h-16 text-yellow-400 fill-current animate-[bounce_1s_ease-in-out_infinite]" style={{ animationDelay: '200ms' }} />
              <Star className="w-12 h-12 text-yellow-400 fill-current animate-[bounce_1s_ease-in-out_infinite]" style={{ animationDelay: '400ms' }} />
            </div>

            <h1 className="text-5xl font-extrabold text-slate-800 mb-4 tracking-tight">Mission Complete!</h1>
            <p className="text-xl text-slate-600 mb-6 font-medium">Great job! The puppy is very happy.</p>
            
            <div className="bg-amber-50 rounded-2xl py-4 px-6 mb-8 border-2 border-amber-200 shadow-inner flex items-center justify-center space-x-3">
              {currentMission === 1 ? (
                <>
                  <Bone className="w-8 h-8 text-amber-500 fill-current" />
                  <span className="text-xl font-bold text-amber-700">You earned 1 Puppy Treat!</span>
                </>
              ) : currentMission === 2 ? (
                <>
                  <span className="text-3xl">🌸</span>
                  <span className="text-xl font-bold text-purple-700">You made the puppy happy!</span>
                </>
              ) : currentMission === 3 ? (
                <>
                  <Dribbble className="w-8 h-8 text-blue-500 fill-current" />
                  <span className="text-xl font-bold text-blue-700">Buddy gained +1 happiness!</span>
                </>
              ) : (
                <>
                  <Key className="w-8 h-8 text-amber-500 fill-current" />
                  <span className="text-xl font-bold text-amber-700">Buddy gained +2 happiness!</span>
                </>
              )}
            </div>

            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => resetGame()}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xl px-8 py-4 rounded-full transition-transform hover:scale-105 shadow-lg shadow-emerald-500/30"
              >
                Play Again
              </button>
              {currentMission < 4 ? (
                <button 
                  onClick={() => startNextMission()}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-xl px-8 py-4 rounded-full transition-transform hover:scale-105 shadow-lg shadow-blue-500/30"
                >
                  Next Mission
                </button>
              ) : (
                <button 
                  disabled
                  className="bg-slate-100 text-slate-400 font-bold text-lg px-8 py-4 rounded-full border-2 border-slate-200 cursor-not-allowed"
                >
                  More Missions Coming Soon
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Interaction Prompt */}
      {!missionComplete && isNearPuppy && hasTreat && currentMission === 1 && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-6 py-3 rounded-full shadow-lg font-bold text-lg animate-bounce">
          Press 'E' to Feed Puppy!
        </div>
      )}

      {/* Bottom Center: Command Bar */}
      {!missionComplete && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 pointer-events-auto">
          {currentMission === 4 && (
            <div className="bg-amber-100 text-amber-800 px-5 py-2 rounded-full font-bold shadow-sm border border-amber-300 animate-bounce text-sm">
              Hint: Buddy can smell things you cannot see. Use Search!
            </div>
          )}
          <div className="bg-white/90 backdrop-blur-md p-2 rounded-3xl shadow-lg border border-slate-100 flex items-center space-x-2">
            <CommandButton command="follow" active={activeCommand === 'follow'} label="Follow" hotkey="1" onClick={() => setCommand('follow')} icon={<Footprints className="w-5 h-5" />} />
            <CommandButton command="stay" active={activeCommand === 'stay'} label="Stay" hotkey="2" onClick={() => setCommand('stay')} icon={<Hand className="w-5 h-5" />} />
            <CommandButton command="search" active={activeCommand === 'search'} label="Search" hotkey="3" onClick={() => setCommand('search')} icon={<Search className="w-5 h-5" />} />
            <CommandButton command="fetch" active={activeCommand === 'fetch'} label="Fetch" hotkey="4" onClick={() => setCommand('fetch')} icon={<HandHeart className="w-5 h-5" />} />
          </div>
        </div>
      )}
    </div>
  );
};
