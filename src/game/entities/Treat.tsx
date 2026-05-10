import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { useGameStore } from '../systems/useGameStore';

export const Treat: React.FC = () => {
  const meshRef = useRef<Mesh>(null);
  const hasTreat = useGameStore((state) => state.hasTreat);
  const collectTreat = useGameStore((state) => state.collectTreat);

  useFrame((state, delta) => {
    if (!meshRef.current || hasTreat) return;

    // Spin animation
    meshRef.current.rotation.y += delta;
    meshRef.current.rotation.x += delta * 0.5;
    meshRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.1;

    // Check collection
    const playerPos = useGameStore.getState().playerPosition;
    const distance = meshRef.current.position.distanceTo(playerPos);
    
    if (distance < 1.0) {
      collectTreat();
    }
  });

  if (hasTreat) return null;

  return (
    <group position={[-3, 0.5, -3]}>
      <mesh ref={meshRef} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.6]} />
        <meshStandardMaterial color="#ff9999" />
      </mesh>
    </group>
  );
};
