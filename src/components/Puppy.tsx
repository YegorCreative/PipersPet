import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../store';

export function Puppy() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  
  const currentPosition = useRef(new THREE.Vector3(2, 0, 2));
  const velocity = useRef(0);
  const hopTime = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current || !meshRef.current) return;

    // Get target position from store (slightly behind/beside player)
    const playerPos = useGameStore.getState().playerPosition;
    
    // Calculate distance to player
    const distance = currentPosition.current.distanceTo(playerPos);
    
    // Only move if we are far enough away (don't push the player)
    if (distance > 2) {
      // Calculate direction
      const direction = new THREE.Vector3().subVectors(playerPos, currentPosition.current);
      direction.y = 0; // Keep movement on XZ plane
      direction.normalize();
      
      // Calculate speed based on distance (run faster if further behind)
      const speed = Math.min(8, distance * 2);
      velocity.current = speed;
      
      // Move puppy
      currentPosition.current.addScaledVector(direction, speed * delta);
      
      // Rotate puppy to face movement direction
      const targetRotation = Math.atan2(direction.x, direction.z);
      const currentRotation = groupRef.current.rotation.y;
      
      // Smooth rotation
      let diff = targetRotation - currentRotation;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      groupRef.current.rotation.y += diff * 10 * delta;
      
      // Bouncy animation while running
      hopTime.current += delta * speed * 2;
      meshRef.current.position.y = 0.25 + Math.abs(Math.sin(hopTime.current)) * 0.3;
      meshRef.current.rotation.z = Math.sin(hopTime.current) * 0.1;
      
    } else {
      velocity.current = 0;
      // Idle settle
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0.25, 10 * delta);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, 10 * delta);
    }
    
    groupRef.current.position.copy(currentPosition.current);
  });

  return (
    <group ref={groupRef} position={[2, 0, 2]}>
      <group ref={meshRef} position={[0, 0.25, 0]}>
        {/* Puppy Body */}
        <RoundedBox args={[0.4, 0.4, 0.6]} radius={0.05} smoothness={4} castShadow position={[0, 0, 0]}>
          <meshPhysicalMaterial color="#FFFFFF" roughness={0.9} clearcoat={0.1} />
        </RoundedBox>
        
        {/* Puppy Head */}
        <RoundedBox args={[0.4, 0.4, 0.4]} radius={0.05} smoothness={4} castShadow position={[0, 0.3, 0.3]}>
          <meshPhysicalMaterial color="#FFFFFF" roughness={0.9} clearcoat={0.1} />
        </RoundedBox>
        
        {/* Ears */}
        <RoundedBox args={[0.1, 0.3, 0.2]} radius={0.02} smoothness={4} castShadow position={[-0.25, 0.3, 0.3]} rotation={[0, 0, 0.2]}>
          <meshPhysicalMaterial color="#333333" roughness={0.9} />
        </RoundedBox>
        <RoundedBox args={[0.1, 0.3, 0.2]} radius={0.02} smoothness={4} castShadow position={[0.25, 0.3, 0.3]} rotation={[0, 0, -0.2]}>
          <meshPhysicalMaterial color="#333333" roughness={0.9} />
        </RoundedBox>
        
        {/* Tail */}
        <RoundedBox args={[0.1, 0.1, 0.3]} radius={0.02} smoothness={4} castShadow position={[0, 0.1, -0.4]} rotation={[0.5, 0, 0]}>
          <meshPhysicalMaterial color="#FFFFFF" />
        </RoundedBox>
        
        {/* Nose */}
        <RoundedBox args={[0.1, 0.1, 0.1]} radius={0.02} smoothness={4} position={[0, 0.3, 0.51]}>
          <meshPhysicalMaterial color="#000000" />
        </RoundedBox>
      </group>
      
      {/* Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[0.4, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}
