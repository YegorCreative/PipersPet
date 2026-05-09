import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore } from '../store';

export function BuildingSystem() {
  const buildMode = useGameStore((state) => state.buildMode);
  const addVoxel = useGameStore((state) => state.addVoxel);
  const voxels = useGameStore((state) => state.voxels);
  
  const [hoverPos, setHoverPos] = useState<[number, number, number] | null>(null);

  // We use an invisible plane to catch raycasts for building
  return (
    <>
      {/* Voxel Renderer */}
      {voxels.map((voxel, i) => (
        <RigidBody key={i} type="fixed" colliders="cuboid" position={voxel.position}>
          <RoundedBox 
            args={[1, 1, 1]} 
            radius={0.05} 
            smoothness={4}
            castShadow 
            receiveShadow
          >
            <meshPhysicalMaterial 
              color="#8D6E63" 
              roughness={0.7} 
              metalness={0.1}
              clearcoat={0.1}
              clearcoatRoughness={0.4}
            /> {/* Premium Wood color */}
          </RoundedBox>
        </RigidBody>
      ))}

      {/* Hologram / Build Cursor */}
      {buildMode && hoverPos && (
        <RoundedBox position={hoverPos} args={[1.02, 1.02, 1.02]} radius={0.05} smoothness={4}>
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.5} />
        </RoundedBox>
      )}

      {/* Interaction Plane (only active in build mode) */}
      {buildMode && (
        <mesh 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, 0, 0]} 
          visible={false}
          onPointerMove={(e) => {
            if (!buildMode) return;
            e.stopPropagation();
            // Snap to 1x1 grid, keeping Y at 0.5 (half block height so it sits on ground)
            const x = Math.round(e.point.x);
            const z = Math.round(e.point.z);
            setHoverPos([x, 0.5, z]);
          }}
          onPointerOut={() => setHoverPos(null)}
          onClick={(e) => {
            if (!buildMode || !hoverPos) return;
            e.stopPropagation();
            // Check if voxel already exists there
            const exists = voxels.some(v => v.position[0] === hoverPos[0] && v.position[1] === hoverPos[1] && v.position[2] === hoverPos[2]);
            if (!exists) {
              addVoxel({ position: hoverPos, type: 'timber' });
            }
          }}
        >
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial />
        </mesh>
      )}
    </>
  );
}
