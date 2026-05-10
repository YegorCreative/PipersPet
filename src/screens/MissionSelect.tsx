import React from 'react';
import { useGameStore } from '../game/systems/useGameStore';
import { ArrowLeft, Bone, Flower2, CheckCircle2, Dribbble, Key } from 'lucide-react';

export const MissionSelect: React.FC = () => {
  const { startMission, goToMenu, completedMissions } = useGameStore();

  const missions = [
    {
      id: 1,
      title: 'The Old Trail',
      description: 'Buddy senses something hidden near the old trail.',
      icon: <Bone className="w-8 h-8 text-amber-500/80 fill-current" />,
      color: 'bg-slate-800/60 border-slate-700/50 hover:border-amber-500/50 hover:bg-slate-800/80',
    },
    {
      id: 2,
      title: 'Wild Flora',
      description: 'Gather wild flora to calm the spirit.',
      icon: <Flower2 className="w-8 h-8 text-pink-500/80 fill-current" />,
      color: 'bg-slate-800/60 border-slate-700/50 hover:border-pink-500/50 hover:bg-slate-800/80',
    },
    {
      id: 3,
      title: 'The Lost Artifact',
      description: 'A lost artifact lies somewhere in the ruins.',
      icon: <Dribbble className="w-8 h-8 text-cyan-500/80 fill-current" />,
      color: 'bg-slate-800/60 border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-800/80',
    },
    {
      id: 4,
      title: 'The Hidden Key',
      description: 'Use Buddy\'s instinct to reveal the hidden key.',
      icon: <Key className="w-8 h-8 text-yellow-500/80 fill-current" />,
      color: 'bg-slate-800/60 border-slate-700/50 hover:border-yellow-500/50 hover:bg-slate-800/80',
    }
  ];

  return (
    <div className="w-full h-full bg-slate-950 flex flex-col items-center py-12 px-6 relative overflow-y-auto font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 fixed" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 mix-blend-overlay fixed" />
      
      <div className="bg-slate-900/60 backdrop-blur-xl px-12 py-10 rounded-[2.5rem] shadow-2xl border border-slate-700/50 w-full max-w-2xl z-10 animate-[zoomIn_0.6s_ease-out_forwards]">
        
        <div className="flex items-center mb-10 relative">
          <button 
            onClick={() => goToMenu()}
            className="absolute left-0 p-3 bg-slate-800/50 hover:bg-slate-700 rounded-full text-slate-300 transition-colors border border-slate-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400 w-full text-center tracking-wide uppercase">Quest Log</h1>
        </div>
        
        <div className="flex flex-col space-y-4">
          {missions.map((mission) => (
            <button
              key={mission.id}
              onClick={() => startMission(mission.id)}
              className={`flex items-center w-full text-left p-6 rounded-2xl border transition-all duration-300 group hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:-translate-y-1 ${mission.color}`}
            >
              <div className="bg-slate-900/80 p-4 rounded-xl shadow-inner mr-6 border border-slate-700 group-hover:scale-110 transition-transform duration-500">
                {mission.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-100 mb-1 tracking-wide">Quest {mission.id}: {mission.title}</h3>
                  {completedMissions.includes(mission.id) && (
                    <div className="flex items-center space-x-1.5 bg-cyan-900/40 text-cyan-400 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border border-cyan-800/50">
                      <CheckCircle2 className="w-3 h-3" /> <span>Fulfilled</span>
                    </div>
                  )}
                </div>
                <p className="text-slate-400 font-light text-sm tracking-wide">{mission.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
