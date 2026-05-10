import React, { useEffect, useState } from 'react';
import { useGameStore } from '../game/systems/useGameStore';
import { Tree, Pond, Rock, Flower, WindingPath, PetCorner, TreatAltar, AmbientParticles } from '../components/MapElements';
import { Key } from 'lucide-react';

const getDist = (p1: { x: number, y: number }, p2: { x: number, y: number }) => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

export const GameScreen: React.FC = () => {
  const { 
    currentMission, playerPosition, puppyPosition, treatPosition, hasTreat, 
    missionComplete, flowerPositions, movePlayer, movePuppy, collectTreat, feedPuppy, collectFlower,
    toyPosition, hasToy, collectToy, setCommand, activeCommand,
    keyPosition, keyVisible, hasKey, gatePosition, gateUnlocked, exitPosition,
    revealKey, collectKey, unlockGate, completeMission4
  } = useGameStore();
  
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});

  // Keyboard state
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys((k) => ({ ...k, [e.key]: true }));
      if (e.key === '1') setCommand('follow');
      if (e.key === '2') setCommand('stay');
      if (e.key === '3') setCommand('search');
      if (e.key === '4') setCommand('fetch');
    };
    const handleKeyUp = (e: KeyboardEvent) => setKeys((k) => ({ ...k, [e.key]: false }));

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setCommand]);

  // Movement & AI Loop
  useEffect(() => {
    const speed = 0.5;
    const interval = setInterval(() => {
      let dx = 0;
      let dy = 0;
      if (keys['w'] || keys['W'] || keys['ArrowUp']) dy -= speed;
      if (keys['s'] || keys['S'] || keys['ArrowDown']) dy += speed;
      if (keys['a'] || keys['A'] || keys['ArrowLeft']) dx -= speed;
      if (keys['d'] || keys['D'] || keys['ArrowRight']) dx += speed;

      if (dx !== 0 || dy !== 0) {
        movePlayer(dx, dy);
      }
      
      // Puppy AI
      const state = useGameStore.getState();
      const pPos = state.puppyPosition;
      
      if (state.activeCommand === 'follow') {
        const playerPos = state.playerPosition;
        const dist = getDist(pPos, playerPos);
        if (dist > 15) {
          const angle = Math.atan2(playerPos.y - pPos.y, playerPos.x - pPos.x);
          movePuppy(Math.cos(angle) * (speed * 0.8), Math.sin(angle) * (speed * 0.8));
        }
      } else if (state.activeCommand === 'search' && state.currentMission === 4 && !state.hasKey) {
        const kPos = state.keyPosition;
        const dist = getDist(pPos, kPos);
        if (dist > 2) {
          const angle = Math.atan2(kPos.y - pPos.y, kPos.x - pPos.x);
          movePuppy(Math.cos(angle) * (speed * 0.6), Math.sin(angle) * (speed * 0.6));
        }
      }

    }, 16);

    return () => clearInterval(interval);
  }, [keys, movePlayer, movePuppy]);

  // Check Distance logic
  useEffect(() => {
    if (currentMission === 1) {
      if (!hasTreat && getDist(playerPosition, treatPosition) < 5) {
        collectTreat();
      }
      if (keys['e'] || keys['E']) {
        if (getDist(playerPosition, puppyPosition) < 10 && hasTreat && !missionComplete) {
          feedPuppy();
          setKeys((k) => ({ ...k, e: false, E: false }));
        }
      }
    } else if (currentMission === 2) {
      flowerPositions.forEach((flower, index) => {
        if (!flower.collected && getDist(playerPosition, flower.pos) < 5) {
          collectFlower(index);
        }
      });
    } else if (currentMission === 3) {
      if (!hasToy && getDist(playerPosition, toyPosition) < 5) {
        collectToy();
      }
    } else if (currentMission === 4) {
      if (activeCommand === 'search' && !keyVisible) {
        if (getDist(puppyPosition, keyPosition) < 5) {
          revealKey();
        }
      }
      if (keyVisible && !hasKey) {
        if (getDist(playerPosition, keyPosition) < 5) {
          collectKey();
        }
      }
      if (hasKey && !gateUnlocked) {
        if (getDist(playerPosition, gatePosition) < 10) {
          unlockGate();
        }
      }
      if (gateUnlocked) {
        if (getDist(playerPosition, exitPosition) < 10) {
          completeMission4();
        }
      }
    }
  }, [currentMission, playerPosition, puppyPosition, treatPosition, hasTreat, missionComplete, flowerPositions, keys, activeCommand, keyVisible, hasKey, gateUnlocked, collectTreat, feedPuppy, collectFlower, toyPosition, hasToy, collectToy, revealKey, collectKey, unlockGate, completeMission4, keyPosition, gatePosition, exitPosition]);

  return (
    <div className="w-full h-full bg-emerald-950 relative overflow-hidden font-sans">
      {/* Vignette & Fog Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(2,6,23,0.8)_100%)] pointer-events-none z-30 mix-blend-multiply" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(8,145,178,0.1)_0%,_transparent_50%)] pointer-events-none z-10" />
      <AmbientParticles />

      {/* Decorative Map Elements */}
      <WindingPath />
      <Pond left="85%" top="15%" />
      <PetCorner left="80%" top="80%" />
      <TreatAltar left="20%" top="20%" />

      <Tree left="5%" top="10%" scale={1.2} />
      <Tree left="15%" top="5%" scale={0.9} />
      <Tree left="40%" top="8%" scale={1.1} />
      <Tree left="60%" top="5%" scale={1} />
      <Tree left="95%" top="15%" scale={1.3} />
      
      <Tree left="5%" top="40%" scale={1} />
      <Tree left="3%" top="70%" scale={1.2} />
      <Tree left="10%" top="95%" scale={0.8} />
      
      <Tree left="30%" top="90%" scale={1.1} />
      <Tree left="50%" top="95%" scale={1} />
      <Tree left="90%" top="95%" scale={1.2} />
      <Tree left="95%" top="60%" scale={0.9} />

      <Rock left="25%" top="30%" scale={0.8} />
      <Rock left="75%" top="45%" scale={1.2} />
      <Rock left="45%" top="75%" scale={0.9} />
      
      <Flower left="20%" top="40%" color="bg-cyan-500" />
      <Flower left="22%" top="42%" color="bg-cyan-400" />
      <Flower left="60%" top="25%" color="bg-amber-500" />
      <Flower left="58%" top="28%" color="bg-amber-400" />
      <Flower left="70%" top="85%" color="bg-pink-500" />

      {/* Mission 1 */}
      {currentMission === 1 && !hasTreat && (
        <div 
          className="absolute w-6 h-6 bg-amber-400 rounded-sm shadow-[0_0_15px_rgba(251,191,36,0.8)] z-20 animate-slow-pulse rotate-45"
          style={{ left: `${treatPosition.x}%`, top: `${treatPosition.y}%`, transform: 'translate(-50%, -50%) rotate(45deg)' }}
        />
      )}

      {/* Mission 2 */}
      {currentMission === 2 && flowerPositions.map((flower, index) => (
        !flower.collected && (
          <div 
            key={index}
            className="absolute w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.8)] z-20 animate-slow-pulse"
            style={{ left: `${flower.pos.x}%`, top: `${flower.pos.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="w-2 h-2 bg-white rounded-full opacity-50" />
          </div>
        )
      ))}

      {/* Mission 3 */}
      {currentMission === 3 && !hasToy && (
        <div 
          className="absolute w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.8)] z-20 animate-bounce"
          style={{ left: `${toyPosition.x}%`, top: `${toyPosition.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="w-3 h-3 border border-white/50 rounded-full" />
        </div>
      )}

      {/* Mission 4 */}
      {currentMission === 4 && (
        <>
          <div 
            className="absolute w-40 h-10 bg-cyan-900/30 border-t border-cyan-500/50 flex items-center justify-center text-cyan-500 text-xs tracking-[0.3em] font-medium z-0"
            style={{ left: `${exitPosition.x}%`, top: `${exitPosition.y}%`, transform: 'translate(-50%, 0)' }}
          >
            EXIT
          </div>
          
          <div 
            className={`absolute w-32 h-10 ${gateUnlocked ? 'bg-cyan-900/10' : 'bg-slate-900/80 backdrop-blur-sm'} flex items-center justify-center shadow-lg border ${gateUnlocked ? 'border-cyan-900/30' : 'border-slate-700'} z-10 transition-colors duration-1000 text-white font-medium tracking-widest text-xs`}
            style={{ left: `${gatePosition.x}%`, top: `${gatePosition.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {gateUnlocked ? 'UNSEALED' : 'SEALED'}
          </div>

          {!hasKey && (
            <div 
              className={`absolute flex items-center justify-center z-20 transition-all duration-1000 ${keyVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
              style={{ left: `${keyPosition.x}%`, top: `${keyPosition.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className="absolute w-8 h-8 bg-amber-400 rounded-full blur-md opacity-30 animate-pulse" />
              <Key className="w-5 h-5 text-amber-400 fill-current drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]" />
            </div>
          )}
        </>
      )}

      {/* Spirit Guide (Puppy) */}
      <div  
        className={`absolute w-10 h-10 z-20 transition-all duration-300 ${missionComplete ? 'animate-happy-bounce' : 'animate-idle-bounce'}`}
        style={{ left: `${puppyPosition.x}%`, top: `${puppyPosition.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        <div className="absolute inset-0 bg-cyan-400 rounded-full blur-[8px] opacity-40 animate-pulse" />
        <div className="w-full h-full bg-slate-800 rounded-full border border-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
           {/* Eyes */}
           <div className="absolute top-3 left-2 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse" />
           <div className="absolute top-3 right-2 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse" />
           {/* Snout */}
           <div className="absolute bottom-2 w-3 h-2 bg-slate-600 rounded-full" />
        </div>

        {missionComplete && (
          <>
            <div className="absolute -top-12 whitespace-nowrap text-cyan-100 font-medium bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full shadow-lg text-xs border border-cyan-800/50 animate-bounce tracking-wide">
              {currentMission === 1 ? 'Bond Strengthened' : currentMission === 2 ? 'Spirit Calmed' : currentMission === 3 ? 'Artifact Secured' : 'Path Opened'}
            </div>
          </>
        )}
      </div>

      {/* Player Character */}
      <div 
        className="absolute w-10 h-10 z-30 transition-transform duration-100"
        style={{ left: `${playerPosition.x}%`, top: `${playerPosition.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        <div className="absolute inset-0 bg-slate-900 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-slate-700 overflow-hidden">
          {/* Cloak/Hood suggestion */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-800 rounded-full" />
          <div className="absolute bottom-0 w-full h-4 bg-slate-950" />
        </div>
      </div>
    </div>
  );
};
