import React, { useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, KeyboardControls, Environment, SoftShadows } from '@react-three/drei';
import { EffectComposer, SSAO, Bloom } from '@react-three/postprocessing';
import { Physics, RigidBody } from '@react-three/rapier';
import { Player } from './components/Player';
import { Puppy } from './components/Puppy';
import { BuildingSystem } from './components/BuildingSystem';
import { useGameStore } from './store';

function App() {
  const keyboardMap = useMemo(() => [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'right', keys: ['ArrowRight', 'KeyD'] },
    { name: 'jump', keys: ['Space'] },
  ], []);

  const buildMode = useGameStore((state) => state.buildMode);
  const toggleBuildMode = useGameStore((state) => state.toggleBuildMode);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'b') {
        toggleBuildMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleBuildMode]);

  return (
    <div className="w-full h-full relative">
      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 p-8 flex flex-col justify-between">
        <div className="glass-panel w-64 p-4 pointer-events-auto">
          <h1 className="text-white font-bold text-xl mb-2">Paws of Adventure</h1>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs text-white/80 mb-1">
                <span>Health</span>
                <span>100/100</span>
              </div>
              <div className="w-full bg-black/50 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full w-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-white/80 mb-1">
                <span>Energy</span>
                <span>50/50</span>
              </div>
              <div className="w-full bg-black/50 rounded-full h-2">
                <div className="bg-adventure-blue h-2 rounded-full w-full"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-panel w-72 p-4 pointer-events-auto self-end">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-bold">Mode:</span>
            <span className={`px-2 py-1 rounded text-xs font-bold ${buildMode ? 'bg-adventure-orange text-white' : 'bg-white/20 text-white/80'}`}>
              {buildMode ? 'BUILDING' : 'EXPLORING'}
            </span>
          </div>
          <p className="text-white/80 text-sm mb-1">Press <span className="text-white font-bold bg-white/20 px-1 rounded">B</span> to toggle mode.</p>
          {buildMode ? (
            <p className="text-white/80 text-sm">Use <span className="text-white font-bold bg-white/20 px-1 rounded">Mouse Click</span> to build.</p>
          ) : (
            <>
              <p className="text-white/80 text-sm mb-1">Use <span className="text-white font-bold bg-white/20 px-1 rounded">W A S D</span> to move.</p>
              <p className="text-white/80 text-sm">Use <span className="text-white font-bold bg-white/20 px-1 rounded">Mouse</span> to look.</p>
            </>
          )}
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
        <KeyboardControls map={keyboardMap}>
          <color attach="background" args={['#87CEEB']} />
          
          <SoftShadows size={20} samples={16} focus={0.5} />
          
          {/* Environment & Lighting */}
          <Sky distance={450000} sunPosition={[10, 20, 10]} inclination={0} azimuth={0.25} />
          <Environment preset="city" />
          <ambientLight intensity={0.2} />
          <directionalLight 
            castShadow 
            position={[10, 20, 10]} 
            intensity={1.5} 
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0001}
          >
            <orthographicCamera attach="shadow-camera" args={[-20, 20, 20, -20, 0.1, 50]} />
          </directionalLight>

          <Physics>
            {/* Ground Plane */}
            <RigidBody type="fixed" colliders="cuboid">
              <mesh receiveShadow position={[0, -0.5, 0]}>
                <boxGeometry args={[100, 1, 100]} />
                <meshPhysicalMaterial color="#2E7D32" roughness={0.9} metalness={0.1} />
              </mesh>
            </RigidBody>

            {/* Player, Camera, & Pets */}
            <Player />
            <Puppy />
            
            {/* Building System */}
            <BuildingSystem />
          </Physics>
          
          {/* Post Processing */}
          <EffectComposer>
            <SSAO samples={21} radius={0.1} intensity={15} luminanceInfluence={0.5} color="black" />
            <Bloom luminanceThreshold={1} mipmapBlur intensity={0.5} />
          </EffectComposer>
        </KeyboardControls>
      </Canvas>
    </div>
  );
}

export default App;
