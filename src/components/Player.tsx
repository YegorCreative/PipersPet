import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';

export function Player() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [, get] = useKeyboardControls();
  
  // Smoothing values
  const currentPosition = useRef(new THREE.Vector3());
  const targetPosition = useRef(new THREE.Vector3());
  const cameraTarget = useRef(new THREE.Vector3());
  
  const speed = 5;

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const { forward, backward, left, right } = get();
    
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

    if (direction.length() > 0) {
      direction.normalize();
      
      // Update target position
      targetPosition.current.addScaledVector(direction, speed * delta);
      
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

    // Apply movement (simulated physics/lerp)
    currentPosition.current.lerp(targetPosition.current, 10 * delta);
    groupRef.current.position.copy(currentPosition.current);

    // Third Person Camera Logic
    // Camera should follow slightly behind and above the player
    const idealCameraOffset = new THREE.Vector3(0, 3, 6);
    idealCameraOffset.applyQuaternion(state.camera.quaternion);
    // Ignore pitch for offset calculation to keep camera stable vertically
    
    const cameraPos = currentPosition.current.clone().add(new THREE.Vector3(0, 4, 8));
    
    state.camera.position.lerp(cameraPos, 5 * delta);
    
    cameraTarget.current.lerp(currentPosition.current.clone().add(new THREE.Vector3(0, 1, 0)), 10 * delta);
    state.camera.lookAt(cameraTarget.current);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Player Model Placeholder */}
      <mesh ref={meshRef} castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#FFB74D" roughness={0.7} />
        
        {/* Simple "face" indicator to show direction */}
        <mesh position={[0, 0.2, 0.51]}>
          <boxGeometry args={[0.6, 0.2, 0.1]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </mesh>
      
      {/* Shadow Blob / Ground indicator */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[0.7, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}
