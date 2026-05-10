import React, { useEffect, useState } from 'react';
import { useGameStore } from '../game/systems/useGameStore';
import { Tree, Pond, Rock, Flower, WindingPath, PetCorner, TreatAltar } from '../components/MapElements';

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
    <div className="w-full h-full bg-[#96c773] relative overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.2)]">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '60px 60px' }} />

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
      
      <Flower left="20%" top="40%" color="bg-purple-300" />
      <Flower left="22%" top="42%" color="bg-pink-300" />
      <Flower left="60%" top="25%" color="bg-yellow-200" />
      <Flower left="58%" top="28%" color="bg-orange-300" />
      <Flower left="70%" top="85%" color="bg-pink-300" />

      {/* Mission 1 */}
      {currentMission === 1 && !hasTreat && (
        <div 
          className="absolute w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center animate-bounce shadow-lg text-xl border-2 border-white z-20"
          style={{ left: `${treatPosition.x}%`, top: `${treatPosition.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          🦴
        </div>
      )}

      {/* Mission 2 */}
      {currentMission === 2 && flowerPositions.map((flower, index) => (
        !flower.collected && (
          <div 
            key={index}
            className="absolute w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center animate-[bounce_2s_infinite] shadow-lg text-xl border-2 border-white z-20"
            style={{ left: `${flower.pos.x}%`, top: `${flower.pos.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            🌸
          </div>
        )
      ))}

      {/* Mission 3 */}
      {currentMission === 3 && !hasToy && (
        <div 
          className="absolute w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center animate-bounce shadow-lg text-2xl border-2 border-white z-20"
          style={{ left: `${toyPosition.x}%`, top: `${toyPosition.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          🎾
        </div>
      )}

      {/* Mission 4 */}
      {currentMission === 4 && (
        <>
          <div 
            className="absolute w-40 h-10 bg-yellow-300/30 border-t-4 border-yellow-400 rounded-b-xl flex items-center justify-center text-yellow-800 font-bold tracking-widest z-0 animate-pulse"
            style={{ left: `${exitPosition.x}%`, top: `${exitPosition.y}%`, transform: 'translate(-50%, 0)' }}
          >
            EXIT
          </div>
          
          <div 
            className={`absolute w-32 h-10 ${gateUnlocked ? 'bg-amber-800/20' : 'bg-slate-800'} rounded-md flex items-center justify-center shadow-lg border-2 ${gateUnlocked ? 'border-amber-900/50' : 'border-slate-900'} z-10 transition-colors duration-1000 text-white font-bold`}
            style={{ left: `${gatePosition.x}%`, top: `${gatePosition.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {gateUnlocked ? '🔓 OPEN' : '🔒 LOCKED'}
          </div>

          {!hasKey && (
            <div 
              className={`absolute w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg text-lg border-2 border-white z-20 transition-all duration-1000 ${keyVisible ? 'opacity-100 animate-bounce scale-100' : 'opacity-0 scale-50'}`}
              style={{ left: `${keyPosition.x}%`, top: `${keyPosition.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              🗝️
            </div>
          )}
        </>
      )}

      {/* Puppy */}
      <div  
        className={`absolute w-14 h-14 bg-orange-400 rounded-3xl flex items-center justify-center shadow-lg text-3xl border-4 border-white/50 z-20 transition-all duration-300 ${missionComplete ? 'animate-happy-bounce' : 'animate-idle-bounce'}`}
        style={{ left: `${puppyPosition.x}%`, top: `${puppyPosition.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        <div className={`absolute -right-3 top-1/2 w-4 h-2 bg-orange-300 rounded-full origin-left ${missionComplete ? 'animate-wag' : 'animate-[tailWag_1s_ease-in-out_infinite_alternate]'}`} />
        <span className="relative z-10">🐶</span>

        {missionComplete && (
          <>
            <div className="absolute -top-12 whitespace-nowrap text-white font-bold bg-amber-500 px-3 py-1 rounded-full shadow-lg text-sm animate-bounce">
              {currentMission === 1 ? 'Woof! Thank you! 🦴' : currentMission === 2 ? 'Woof! So pretty! 🌸' : currentMission === 3 ? 'You found my toy! 🎾' : 'Woof! Freedom! ✨'}
            </div>
            <div className="absolute top-0 text-red-500 animate-float-heart" style={{ left: '20%' }}>❤️</div>
            <div className="absolute top-0 text-pink-500 animate-float-heart" style={{ left: '80%', animationDelay: '0.2s' }}>💖</div>
            <div className="absolute top-0 text-red-400 animate-float-heart" style={{ left: '50%', animationDelay: '0.4s' }}>❤️</div>
          </>
        )}
      </div>

      {/* Player */}
      <div 
        className="absolute w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white z-30 text-2xl"
        style={{ left: `${playerPosition.x}%`, top: `${playerPosition.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        🤠
      </div>
    </div>
  );
};
