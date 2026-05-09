import React from 'react';
import { Environment, Sky, ContactShadows } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { PlayerPlaceholder } from '../Prefabs/PlayerPlaceholder';

export const MainScene: React.FC = () => {
  return (
    <>
      {/* Lighting and Environment */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />
      <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} />
      <Environment preset="sunset" />

      {/* Ground Physics and Visuals */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, -0.5, 0]} receiveShadow>
          <boxGeometry args={[100, 1, 100]} />
          <meshStandardMaterial color="#3a5a40" />
        </mesh>
      </RigidBody>

      {/* Shadows for extra realism without heavy cost */}
      <ContactShadows resolution={1024} scale={50} blur={2} opacity={0.5} far={10} color="#000000" />

      {/* Entities */}
      <PlayerPlaceholder />
    </>
  );
};
