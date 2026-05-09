import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore } from '../store';

export function Puppy() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const meshRef = useRef<THREE.Group>(null);
  
  // State
  const hopTime = useRef(0);
  const followDistance = 3;

  useFrame((state, delta) => {
    if (!rigidBodyRef.current || !meshRef.current) return;

    // Get target position from store
    const playerPos = useGameStore.getState().playerPosition;
    const currentPos = new THREE.Vector3().copy(rigidBodyRef.current.translation());
    const currentVel = rigidBodyRef.current.linvel();
    
    // Distance check
    const distance = currentPos.distanceTo(playerPos);
    
    if (distance > followDistance) {
      // Calculate direction to player
      const direction = new THREE.Vector3().subVectors(playerPos, currentPos);
      direction.y = 0; // Keep movement on XZ plane
      direction.normalize();
      
      // Calculate speed (faster if further away, up to a cap)
      const speedMultiplier = Math.min(distance * 1.5, 8);
      
      // Rotate to face player
      const targetRotation = Math.atan2(direction.x, direction.z);
      
      // Smooth rotation
      const currentRotation = meshRef.current.rotation.y;
      let diff = targetRotation - currentRotation;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      meshRef.current.rotation.y += diff * 8 * delta;
      
      // Set linear velocity towards player
      rigidBodyRef.current.setLinvel(
        { x: direction.x * speedMultiplier, y: currentVel.y, z: direction.z * speedMultiplier },
        true
      );
      
      // Animate hopping based on actual speed
      hopTime.current += delta * speedMultiplier * 2;
      meshRef.current.position.y = 0.25 + Math.abs(Math.sin(hopTime.current)) * 0.3;
    } else {
      // Stop moving
      rigidBodyRef.current.setLinvel({ x: 0, y: currentVel.y, z: 0 }, true);
      // Reset hop height smoothly
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0.25, 10 * delta);
    }
  });

  return (
    <RigidBody ref={rigidBodyRef} type="dynamic" colliders="cuboid" lockRotations position={[2, 2, 2]} mass={0.5} friction={0.5}>
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
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]} receiveShadow>
        <circleGeometry args={[0.3, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.2} />
      </mesh>
    </RigidBody>
  );
}
