import React from 'react';
import { useGameStore } from '../game/systems/useGameStore';
import { ArrowLeft, Bone, Flower2, CheckCircle2, Dribbble } from 'lucide-react';

export const MissionSelect: React.FC = () => {
  const { startMission, goToMenu, completedMissions } = useGameStore();

  const missions = [
    {
      id: 1,
      title: 'Find the Puppy',
      description: 'Find the puppy and give it a treat!',
      icon: <Bone className="w-8 h-8 text-amber-500 fill-current" />,
      color: 'bg-amber-50 border-amber-200 hover:border-amber-400',
    },
    {
      id: 2,
      title: 'Flower Collection',
      description: 'Collect 3 flowers for the puppy.',
      icon: <Flower2 className="w-8 h-8 text-purple-500 fill-current" />,
      color: 'bg-purple-50 border-purple-200 hover:border-purple-400',
    },
    {
      id: 3,
      title: 'Find Buddy\'s Toy',
      description: 'Find Buddy\'s lost toy.',
      icon: <Dribbble className="w-8 h-8 text-blue-500 fill-current" />,
      color: 'bg-blue-50 border-blue-200 hover:border-blue-400',
    }
  ];

  return (
    <div className="w-full h-full bg-[#96c773] flex flex-col items-center justify-center relative overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.2)]">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '60px 60px' }} />
      
      <div className="bg-white/90 backdrop-blur-md px-12 py-10 rounded-[3rem] shadow-2xl border-4 border-white w-full max-w-2xl z-10 animate-[zoomIn_0.3s_ease-out_forwards]">
        
        <div className="flex items-center mb-8 relative">
          <button 
            onClick={() => goToMenu()}
            className="absolute left-0 p-3 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-4xl font-extrabold text-slate-800 w-full text-center">Select Mission</h1>
        </div>
        
        <div className="flex flex-col space-y-4">
          {missions.map((mission) => (
            <button
              key={mission.id}
              onClick={() => startMission(mission.id)}
              className={`flex items-center p-6 rounded-3xl border-4 text-left transition-transform hover:scale-[1.02] ${mission.color}`}
            >
              <div className="bg-white p-4 rounded-2xl shadow-sm mr-6">
                {mission.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-800 mb-1">Mission {mission.id}: {mission.title}</h3>
                  {completedMissions.includes(mission.id) && (
                    <div className="flex items-center space-x-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">
                      <CheckCircle2 className="w-4 h-4" /> <span>Completed</span>
                    </div>
                  )}
                </div>
                <p className="text-slate-600 font-medium">{mission.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
