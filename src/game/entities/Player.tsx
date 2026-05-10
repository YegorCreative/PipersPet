import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { Mesh, Vector3 } from 'three';
import { useGameStore } from '../systems/useGameStore';

const SPEED = 5;

export const Player: React.FC = () => {
  const meshRef = useRef<Mesh>(null);
  const [, get] = useKeyboardControls();

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    const { forward, backward, left, right } = get();

    const moveZ = (forward ? -1 : 0) + (backward ? 1 : 0);
    const moveX = (left ? -1 : 0) + (right ? 1 : 0);

    const moveDirection = new Vector3(moveX, 0, moveZ).normalize().multiplyScalar(SPEED * delta);
    
    meshRef.current.position.add(moveDirection);

    // Update global store for puppy and treat to use
    useGameStore.getState().playerPosition.copy(meshRef.current.position);
  });

  return (
    <mesh ref={meshRef} position={[0, 0.5, 0]} castShadow>
      <capsuleGeometry args={[0.3, 0.4, 4, 16]} />
      <meshStandardMaterial color="#6eb5ff" />
    </mesh>
  );
};
