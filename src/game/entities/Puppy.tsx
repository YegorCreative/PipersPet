import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { useGameStore } from '../systems/useGameStore';

const FOLLOW_SPEED = 3;
const STOP_DISTANCE = 1.5;

export const Puppy: React.FC = () => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const playerPos = useGameStore.getState().playerPosition;
    const distance = meshRef.current.position.distanceTo(playerPos);

    if (distance > STOP_DISTANCE) {
      // Lerp towards player
      const targetPos = playerPos.clone();
      meshRef.current.position.lerp(targetPos, delta * FOLLOW_SPEED);
    }

    // Bounce slightly while moving
    if (distance > STOP_DISTANCE) {
        meshRef.current.position.y = 0.3 + Math.abs(Math.sin(state.clock.elapsedTime * 10)) * 0.2;
    } else {
        meshRef.current.position.y = 0.3;
    }

    // Check feed interaction
    if (distance < 2.0 && useGameStore.getState().hasTreat) {
      useGameStore.getState().feedPuppy();
    }
  });

  return (
    <mesh ref={meshRef} position={[2, 0.3, 2]} castShadow>
      <boxGeometry args={[0.6, 0.6, 0.6]} />
      <meshStandardMaterial color="#ffb347" />
    </mesh>
  );
};
