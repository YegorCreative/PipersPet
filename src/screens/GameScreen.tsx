import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls, OrbitControls } from '@react-three/drei';
import { World } from '../game/World';
import { Player } from '../game/entities/Player';
import { Puppy } from '../game/entities/Puppy';
import { Treat } from '../game/entities/Treat';

export const GameScreen: React.FC = () => {
  const keyboardMap = useMemo(
    () => [
      { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
      { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
      { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
      { name: 'right', keys: ['ArrowRight', 'KeyD'] },
    ],
    []
  );

  return (
    <div className="w-full h-full">
      <KeyboardControls map={keyboardMap}>
        <Canvas shadows camera={{ position: [0, 8, 12], fov: 45 }}>
          <color attach="background" args={['#87CEEB']} />
          
          <World />
          <Player />
          <Puppy />
          <Treat />
          
          <OrbitControls 
            makeDefault 
            enablePan={false} 
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 2.5} 
            minDistance={5} 
            maxDistance={20} 
          />
        </Canvas>
      </KeyboardControls>
    </div>
  );
};
