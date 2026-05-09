import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, Environment, OrbitControls } from '@react-three/drei';

function App() {
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
          <p className="text-white/80 text-sm">Use <span className="text-white font-bold">W A S D</span> to move.</p>
          <p className="text-white/80 text-sm">Use <span className="text-white font-bold">Mouse</span> to look around.</p>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
        <color attach="background" args={['#87CEEB']} />
        
        {/* Environment & Lighting */}
        <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
        <ambientLight intensity={0.5} />
        <directionalLight 
          castShadow 
          position={[10, 20, 10]} 
          intensity={1.5} 
          shadow-mapSize={[1024, 1024]}
        >
          <orthographicCamera attach="shadow-camera" args={[-20, 20, 20, -20, 0.1, 50]} />
        </directionalLight>

        {/* Temporary Ground Plane */}
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#2E7D32" />
        </mesh>

        {/* Temporary Player Placeholder */}
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#FFB74D" />
        </mesh>

        {/* Temporary OrbitControls until Third Person Camera is implemented */}
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}

export default App;
