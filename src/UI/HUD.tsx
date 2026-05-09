import { useGameManager } from '../Managers/GameManager';

export const HUD = () => {
  const { score } = useGameManager();

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none p-6">
      <div className="flex justify-between items-start">
        <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-lg">
          <h1 className="text-white font-bold text-2xl tracking-wider">PROJECT PAWS</h1>
          <p className="text-white/70 text-sm font-medium">Pre-Alpha Build</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-lg">
          <p className="text-white font-bold text-xl">Score: {score}</p>
        </div>
      </div>
    </div>
  );
};
