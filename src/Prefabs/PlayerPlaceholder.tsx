import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { RigidBody } from '@react-three/rapier';

export const PlayerPlaceholder = () => {
  const meshRef = useRef<Mesh>(null);

  // Very simple floating/bobbing animation just so the scene isn't completely static
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <RigidBody position={[0, 2, 0]} colliders="cuboid" type="dynamic" lockRotations>
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </RigidBody>
  );
};
