import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore } from '../store';

export function Player() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const meshRef = useRef<THREE.Group>(null);
  const [, get] = useKeyboardControls();
  
  // Smoothing values
  const cameraTarget = useRef(new THREE.Vector3());
  
  const speed = 5;

  useFrame((state, delta) => {
    if (!rigidBodyRef.current) return;

    const { forward, backward, left, right, jump } = get();
    
    // Calculate movement vector based on camera direction
    const direction = new THREE.Vector3(0, 0, 0);
    
    // Get camera's forward and right vectors, flattened to XZ plane
    const cameraDirection = new THREE.Vector3();
    state.camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0;
    cameraDirection.normalize();
    
    const cameraRight = new THREE.Vector3();
    cameraRight.crossVectors(state.camera.up, cameraDirection).normalize();

    if (forward) direction.add(cameraDirection);
    if (backward) direction.sub(cameraDirection);
    if (right) direction.sub(cameraRight);
    if (left) direction.add(cameraRight);

    const currentVel = rigidBodyRef.current.linvel();
    let targetVelocityX = 0;
    let targetVelocityZ = 0;

    if (direction.length() > 0) {
      direction.normalize();
      targetVelocityX = direction.x * speed;
      targetVelocityZ = direction.z * speed;
      
      // Rotate player mesh to face movement direction
      if (meshRef.current) {
        const targetRotation = Math.atan2(direction.x, direction.z);
        
        // Smooth rotation
        const currentRotation = meshRef.current.rotation.y;
        // Handle wrapping around PI
        let diff = targetRotation - currentRotation;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        
        meshRef.current.rotation.y += diff * 10 * delta;
      }
    }

    // Apply smooth linear velocity
    rigidBodyRef.current.setLinvel(
      { 
        x: THREE.MathUtils.lerp(currentVel.x, targetVelocityX, 10 * delta), 
        y: currentVel.y, 
        z: THREE.MathUtils.lerp(currentVel.z, targetVelocityZ, 10 * delta) 
      },
      true
    );

    // Jumping
    if (jump && Math.abs(currentVel.y) < 0.1) {
      rigidBodyRef.current.applyImpulse({ x: 0, y: 1.5, z: 0 }, true);
    }

    // Get true position from physics body
    const pos = rigidBodyRef.current.translation();
    const currentPosition = new THREE.Vector3(pos.x, pos.y, pos.z);
    
    // Update global store
    useGameStore.getState().setPlayerPosition(currentPosition.clone());

    // Third Person Camera Logic
    // Camera should follow slightly behind and above the player
    const cameraPos = currentPosition.clone().add(new THREE.Vector3(0, 4, 8));
    
    state.camera.position.lerp(cameraPos, 5 * delta);
    
    cameraTarget.current.lerp(currentPosition.clone().add(new THREE.Vector3(0, 1, 0)), 10 * delta);
    state.camera.lookAt(cameraTarget.current);
  });

  return (
    <RigidBody ref={rigidBodyRef} type="dynamic" colliders="cuboid" lockRotations position={[0, 2, 0]} mass={1} friction={0.5}>
      {/* Player Model - Voxel Girl */}
      <group ref={meshRef} position={[0, 0, 0]}>
        {/* Body / Dress */}
        <mesh castShadow position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.3, 0.5, 0.8, 8]} />
          <meshStandardMaterial color="#F48FB1" roughness={0.8} /> {/* Pink dress */}
        </mesh>
        
        {/* Head */}
        <mesh castShadow position={[0, 1.25, 0]}>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial color="#FFCCBC" roughness={0.5} /> {/* Peach skin */}
        </mesh>

        {/* Hair (Base) */}
        <mesh castShadow position={[0, 1.35, -0.05]}>
          <boxGeometry args={[0.65, 0.5, 0.65]} />
          <meshStandardMaterial color="#5D4037" roughness={0.9} /> {/* Brown hair */}
        </mesh>

        {/* Hair (Pigtails) */}
        <mesh castShadow position={[-0.4, 1.1, -0.1]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.2, 0.4, 0.2]} />
          <meshStandardMaterial color="#5D4037" roughness={0.9} />
        </mesh>
        <mesh castShadow position={[0.4, 1.1, -0.1]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.2, 0.4, 0.2]} />
          <meshStandardMaterial color="#5D4037" roughness={0.9} />
        </mesh>
        
        {/* Face / Eyes */}
        <mesh position={[-0.15, 1.25, 0.31]}>
          <boxGeometry args={[0.1, 0.1, 0.05]} />
          <meshStandardMaterial color="#3E2723" />
        </mesh>
        <mesh position={[0.15, 1.25, 0.31]}>
          <boxGeometry args={[0.1, 0.1, 0.05]} />
          <meshStandardMaterial color="#3E2723" />
        </mesh>

        {/* Blush */}
        <mesh position={[-0.2, 1.15, 0.31]}>
          <boxGeometry args={[0.1, 0.05, 0.05]} />
          <meshStandardMaterial color="#FF8A80" opacity={0.6} transparent />
        </mesh>
        <mesh position={[0.2, 1.15, 0.31]}>
          <boxGeometry args={[0.1, 0.05, 0.05]} />
          <meshStandardMaterial color="#FF8A80" opacity={0.6} transparent />
        </mesh>

        {/* Legs */}
        <mesh castShadow position={[-0.15, 0.15, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.3]} />
          <meshStandardMaterial color="#FFCCBC" />
        </mesh>
        <mesh castShadow position={[0.15, 0.15, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.3]} />
          <meshStandardMaterial color="#FFCCBC" />
        </mesh>
      </group>
      
      {/* Shadow Blob / Ground indicator */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[0.7, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.2} />
      </mesh>
    </RigidBody>
  );
}
