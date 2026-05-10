import React, { useEffect, useState } from 'react';
import { useGameStore } from '../game/systems/useGameStore';

export const GameScreen: React.FC = () => {
  const { playerPosition, puppyPosition, treatPosition, hasTreat, movePlayer, collectTreat, feedPuppy } = useGameStore();
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

    // Treat collection
    if (!hasTreat) {
      if (getDist(playerPosition, treatPosition) < 5) {
        collectTreat();
      }
    }

    // Puppy feed (if 'e' is pressed)
    if (keys['e'] || keys['E']) {
      if (getDist(playerPosition, puppyPosition) < 10 && hasTreat) {
        feedPuppy();
        // clear 'e' key state to prevent spam
        setKeys((k) => ({ ...k, e: false, E: false }));
      }
    }
  }, [playerPosition, treatPosition, puppyPosition, hasTreat, keys, collectTreat, feedPuppy]);

  return (
    <div className="w-full h-full bg-[#a7d188] relative overflow-hidden">
      {/* Floor pattern (optional cozy touch) */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '40px 40px' }} />

      {/* Treat */}
      {!hasTreat && (
        <div 
          className="absolute w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center animate-bounce shadow-lg text-lg border-2 border-white"
          style={{ left: `${treatPosition.x}%`, top: `${treatPosition.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          🦴
        </div>
      )}

      {/* Puppy */}
      <div 
        className="absolute w-12 h-12 bg-orange-400 rounded-2xl flex items-center justify-center shadow-lg text-2xl border-4 border-white/50"
        style={{ left: `${puppyPosition.x}%`, top: `${puppyPosition.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        🐶
      </div>

      {/* Player */}
      <div 
        className="absolute w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center shadow-xl border-4 border-white z-10 text-2xl"
        style={{ left: `${playerPosition.x}%`, top: `${playerPosition.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        🤠
      </div>
    </div>
  );
};
