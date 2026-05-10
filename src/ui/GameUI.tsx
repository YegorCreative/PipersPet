import React from 'react';
import { Bone, ArrowLeft, Dribbble, Key, Footprints, Hand, Search, HandHeart } from 'lucide-react';
import { useGameStore, PuppyCommand } from '../game/systems/useGameStore';

const CommandButton: React.FC<{ command: PuppyCommand, active: boolean, label: string, hotkey: string, onClick: () => void, icon: React.ReactNode }> = ({ active, label, hotkey, onClick, icon }) => (
  <button 
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium tracking-wide text-sm ${active ? 'bg-cyan-900/60 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'bg-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent hover:border-slate-700'}`}
  >
    <div className={`w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold ${active ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
      {hotkey}
    </div>
    {icon}
    <span className="uppercase text-xs">{label}</span>
  </button>
);

export const GameUI: React.FC = () => {
  const { currentMission, flowersCollected, hasToy, hasKey, activeCommand, setCommand, startNextMission, hasTreat, missionComplete, playerPosition, puppyPosition, resetGame, goToMenu } = useGameStore();

  const getDist = (p1: { x: number, y: number }, p2: { x: number, y: number }) => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  const isNearPuppy = getDist(playerPosition, puppyPosition) < 10;

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-50 font-sans">
      {/* Top Left: Navigation & Mission Objective */}
      <div className="absolute top-6 left-6 flex flex-col space-y-4">
        <button 
          onClick={() => goToMenu()}
          className="pointer-events-auto flex items-center justify-center space-x-2 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-slate-700 hover:bg-slate-800 transition-all w-max text-slate-300 font-medium text-sm tracking-wide uppercase"
        >
          <ArrowLeft className="w-4 h-4" /> <span>Abandon Quest</span>
        </button>
        <div className="bg-slate-900/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg border border-slate-700/50 max-w-sm">
          <h2 className="text-xs font-bold text-cyan-500 mb-1 tracking-[0.2em] uppercase">Active Quest</h2>
          <p className="text-slate-200 font-light leading-relaxed">
            {currentMission === 1 ? 'Buddy senses something hidden near the old trail.' : 
             currentMission === 2 ? `Gather wild flora to calm the spirit. (${flowersCollected}/3)` :
             currentMission === 3 ? 'A lost artifact lies somewhere in the ruins.' :
             'Use Buddy\'s instinct to reveal the hidden key.'}
          </p>
        </div>
      </div>

      {/* Top Right: Inventory */}
      <div className="absolute top-6 right-6 flex items-center space-x-3">
        {currentMission === 1 ? (
          <div className={`flex items-center justify-center w-14 h-14 rounded-2xl shadow-lg border transition-all duration-500 backdrop-blur-md ${hasTreat ? 'bg-amber-900/40 border-amber-500/50 scale-105' : 'bg-slate-900/80 border-slate-700'}`}>
            <Bone className={`w-6 h-6 ${hasTreat ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]' : 'text-slate-600'}`} />
          </div>
        ) : currentMission === 2 ? (
          <div className="flex space-x-2 bg-slate-900/80 backdrop-blur-md p-2 rounded-2xl border border-slate-700 shadow-lg">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-500 ${flowersCollected > i ? 'bg-pink-900/40 border border-pink-500/30 shadow-[inset_0_0_10px_rgba(236,72,153,0.2)]' : 'bg-slate-800'}`}>
                <div className={`w-3 h-3 rounded-full ${flowersCollected > i ? 'bg-pink-400 shadow-[0_0_8px_rgba(236,72,153,0.8)]' : 'bg-slate-700'}`} />
              </div>
            ))}
          </div>
        ) : currentMission === 3 ? (
          <div className={`flex items-center justify-center w-14 h-14 rounded-2xl shadow-lg border transition-all duration-500 backdrop-blur-md ${hasToy ? 'bg-cyan-900/40 border-cyan-500/50 scale-105' : 'bg-slate-900/80 border-slate-700'}`}>
            <Dribbble className={`w-6 h-6 ${hasToy ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]' : 'text-slate-600'}`} />
          </div>
        ) : (
          <div className={`flex items-center justify-center w-14 h-14 rounded-2xl shadow-lg border transition-all duration-500 backdrop-blur-md ${hasKey ? 'bg-amber-900/40 border-amber-500/50 scale-105' : 'bg-slate-900/80 border-slate-700'}`}>
            <Key className={`w-6 h-6 ${hasKey ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]' : 'text-slate-600'}`} />
          </div>
        )}
      </div>

      {/* Center: Mission Complete */}
      {missionComplete && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm pointer-events-auto z-50">
          <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30 top-1/2 -translate-y-1/2" />
          
          <div className="bg-slate-900/90 px-16 py-12 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-800 text-center relative animate-[zoomIn_0.8s_ease-out_forwards] max-w-lg w-full">
            <h1 className="text-sm font-bold text-cyan-400 mb-6 tracking-[0.4em] uppercase">Quest Complete</h1>
            <h2 className="text-4xl font-light text-slate-100 mb-8 tracking-wide">
              {currentMission === 1 ? 'Bond Strengthened' : currentMission === 2 ? 'Spirit Calmed' : currentMission === 3 ? 'Artifact Secured' : 'Path Opened'}
            </h2>
            
            <div className="bg-slate-950/50 rounded-2xl py-5 px-6 mb-10 border border-slate-800 flex items-center justify-center space-x-4">
              {currentMission === 1 ? (
                <>
                  <Bone className="w-5 h-5 text-amber-500/80 fill-current" />
                  <span className="text-sm font-medium text-slate-300 tracking-wide">Offering Acquired</span>
                </>
              ) : currentMission === 2 ? (
                <>
                  <div className="w-3 h-3 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
                  <span className="text-sm font-medium text-slate-300 tracking-wide">Companion's Heart Lifted</span>
                </>
              ) : currentMission === 3 ? (
                <>
                  <Dribbble className="w-5 h-5 text-cyan-500/80 fill-current" />
                  <span className="text-sm font-medium text-slate-300 tracking-wide">Bond Empowered</span>
                </>
              ) : (
                <>
                  <Key className="w-5 h-5 text-amber-500/80 fill-current" />
                  <span className="text-sm font-medium text-slate-300 tracking-wide">Great Bond Empowered</span>
                </>
              )}
            </div>

            <div className="flex flex-col space-y-4">
              {currentMission < 4 ? (
                <button 
                  onClick={() => startNextMission()}
                  className="w-full bg-cyan-900/40 hover:bg-cyan-800/60 text-cyan-100 font-medium text-sm tracking-widest uppercase px-8 py-4 rounded-xl transition-all border border-cyan-700/50"
                >
                  Continue Journey
                </button>
              ) : (
                <button 
                  onClick={() => goToMenu()}
                  className="w-full bg-amber-900/40 hover:bg-amber-800/60 text-amber-100 font-medium text-sm tracking-widest uppercase px-8 py-4 rounded-xl transition-all border border-amber-700/50 shadow-[0_0_15px_rgba(217,119,6,0.2)]"
                >
                  Return to Sanctuary
                </button>
              )}
              <button 
                onClick={() => resetGame()}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-400 font-medium text-xs tracking-widest uppercase px-8 py-4 rounded-xl transition-all"
              >
                Relive Memory
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Interaction Prompt */}
      {!missionComplete && isNearPuppy && hasTreat && currentMission === 1 && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-slate-900/90 text-cyan-300 px-6 py-3 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.2)] font-semibold text-xs tracking-[0.2em] uppercase border border-cyan-800 animate-pulse">
          Press 'E' to Offer
        </div>
      )}

      {/* Bottom Center: Command Bar */}
      {!missionComplete && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-4 pointer-events-auto w-full max-w-xl">
          {currentMission === 4 && (
            <div className="bg-slate-900/80 text-amber-200/80 px-6 py-2.5 rounded-full font-light text-xs tracking-wide shadow-lg border border-amber-900/30 backdrop-blur-md">
              <span className="font-bold text-amber-500 mr-2">WHISPER:</span> Buddy can smell what eyes cannot see.
            </div>
          )}
          <div className="bg-slate-900/90 backdrop-blur-xl p-2 rounded-2xl shadow-2xl border border-slate-700/50 flex items-center justify-between w-full">
            <CommandButton command="follow" active={activeCommand === 'follow'} label="Follow" hotkey="1" onClick={() => setCommand('follow')} icon={<Footprints className="w-4 h-4" />} />
            <div className="w-[1px] h-8 bg-slate-800" />
            <CommandButton command="stay" active={activeCommand === 'stay'} label="Stay" hotkey="2" onClick={() => setCommand('stay')} icon={<Hand className="w-4 h-4" />} />
            <div className="w-[1px] h-8 bg-slate-800" />
            <CommandButton command="search" active={activeCommand === 'search'} label="Seek" hotkey="3" onClick={() => setCommand('search')} icon={<Search className="w-4 h-4" />} />
            <div className="w-[1px] h-8 bg-slate-800" />
            <CommandButton command="fetch" active={activeCommand === 'fetch'} label="Retrieve" hotkey="4" onClick={() => setCommand('fetch')} icon={<HandHeart className="w-4 h-4" />} />
          </div>
        </div>
      )}
    </div>
  );
};
