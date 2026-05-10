import React, { useEffect, useState } from 'react';
import { useGameStore } from '../game/systems/useGameStore';
import { Tree, Pond, Rock, Flower, WindingPath, PetCorner, TreatAltar } from '../components/MapElements';

export const GameScreen: React.FC = () => {
  const { 
    currentMission, playerPosition, puppyPosition, treatPosition, hasTreat, 
    missionComplete, flowerPositions, movePlayer, collectTreat, feedPuppy, collectFlower 
  } = useGameStore();
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});

  // Keyboard state
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => setKeys((k) => ({ ...k, [e.key]: true }));
    const handleKeyUp = (e: KeyboardEvent) => setKeys((k) => ({ ...k, [e.key]: false }));

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Movement Loop
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
    }, 16);

    return () => clearInterval(interval);
  }, [keys, movePlayer]);

  // Check Distance logic
  useEffect(() => {
    const getDist = (p1: { x: number, y: number }, p2: { x: number, y: number }) => {
      return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    };

    if (currentMission === 1) {
      // Treat collection
      if (!hasTreat) {
        if (getDist(playerPosition, treatPosition) < 5) {
          collectTreat();
        }
      }

      // Puppy feed
      if (keys['e'] || keys['E']) {
        if (getDist(playerPosition, puppyPosition) < 10 && hasTreat && !missionComplete) {
          feedPuppy();
          setKeys((k) => ({ ...k, e: false, E: false }));
        }
      }
    } else if (currentMission === 2) {
      // Flower collection
      flowerPositions.forEach((flower, index) => {
        if (!flower.collected && getDist(playerPosition, flower.pos) < 5) {
          collectFlower(index);
        }
      });
    }
  }, [currentMission, playerPosition, treatPosition, puppyPosition, hasTreat, missionComplete, flowerPositions, keys, collectTreat, feedPuppy, collectFlower]);

  // Audio hook placeholder
  useEffect(() => {
    if (missionComplete) {
      console.log("[AUDIO] Play happy_bark.mp3");
      console.log("[AUDIO] Play mission_success.mp3");
    }
  }, [missionComplete]);

  return (
    <div className="w-full h-full bg-[#96c773] relative overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.2)]">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '60px 60px' }} />

      {/* Decorative Map Elements */}
      <WindingPath />
      <Pond left="85%" top="15%" />
      <PetCorner left="80%" top="80%" />
      <TreatAltar left="20%" top="20%" />

      {/* Trees framing the map */}
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

      {/* Rocks and Flowers scattered */}
      <Rock left="25%" top="30%" scale={0.8} />
      <Rock left="75%" top="45%" scale={1.2} />
      <Rock left="45%" top="75%" scale={0.9} />
      
      <Flower left="20%" top="40%" color="bg-purple-300" />
      <Flower left="22%" top="42%" color="bg-pink-300" />
      <Flower left="60%" top="25%" color="bg-yellow-200" />
      <Flower left="58%" top="28%" color="bg-orange-300" />
      <Flower left="70%" top="85%" color="bg-pink-300" />

      {/* Interactive Entities */}
      {currentMission === 1 && !hasTreat && (
        <div 
          className="absolute w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center animate-bounce shadow-lg text-xl border-2 border-white z-20"
          style={{ left: `${treatPosition.x}%`, top: `${treatPosition.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          🦴
        </div>
      )}

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

      <div 
        className={`absolute w-14 h-14 bg-orange-400 rounded-3xl flex items-center justify-center shadow-lg text-3xl border-4 border-white/50 z-20 transition-all duration-300 ${missionComplete ? 'animate-happy-bounce' : 'animate-idle-bounce'}`}
        style={{ left: `${puppyPosition.x}%`, top: `${puppyPosition.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        {/* Tail */}
        <div className={`absolute -right-3 top-1/2 w-4 h-2 bg-orange-300 rounded-full origin-left ${missionComplete ? 'animate-wag' : 'animate-[tailWag_1s_ease-in-out_infinite_alternate]'}`} />
        
        <span className="relative z-10">🐶</span>

        {/* Reaction Text & Hearts */}
        {missionComplete && (
          <>
            <div className="absolute -top-12 whitespace-nowrap text-white font-bold bg-amber-500 px-3 py-1 rounded-full shadow-lg text-sm animate-bounce">
              {currentMission === 1 ? 'Woof! Thank you! 🦴' : 'Woof! So pretty! 🌸'}
            </div>
            <div className="absolute top-0 text-red-500 animate-float-heart" style={{ left: '20%' }}>❤️</div>
            <div className="absolute top-0 text-pink-500 animate-float-heart" style={{ left: '80%', animationDelay: '0.2s' }}>💖</div>
            <div className="absolute top-0 text-red-400 animate-float-heart" style={{ left: '50%', animationDelay: '0.4s' }}>❤️</div>
          </>
        )}
      </div>

      <div 
        className="absolute w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white z-30 text-2xl"
        style={{ left: `${playerPosition.x}%`, top: `${playerPosition.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        🤠
      </div>
    </div>
  );
};
