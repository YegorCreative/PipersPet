import { useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, KeyboardControls, Environment, SoftShadows } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Physics } from '@react-three/rapier';
import { Player } from './components/Player';
import { Puppy } from './components/Puppy';
import { Level1_Forest } from './levels/Level1_Forest';
import { useGameStore } from './store';

function App() {
  const keyboardMap = useMemo(() => [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'right', keys: ['ArrowRight', 'KeyD'] },
    { name: 'jump', keys: ['Space'] },
  ], []);

  const gameState = useGameStore((state) => state.gameState);

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

        {/* Mission Complete UI */}
        {gameState === 'Victory' && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center pointer-events-auto backdrop-blur-sm">
            <h1 className="text-6xl font-black text-white mb-4 drop-shadow-lg">Mission Complete!</h1>
            <p className="text-xl text-green-300 font-bold mb-8">You found the Lost Puppy!</p>
            <button 
              className="px-8 py-4 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-2xl shadow-[0_4px_0_#c2410c] active:shadow-none active:translate-y-1 transition-all"
              onClick={() => window.location.reload()}
            >
              Play Again
            </button>
          </div>
        )}
        
        <div className="glass-panel w-72 p-4 pointer-events-auto self-end">
          <p className="text-white/80 text-sm mb-1">Use <span className="text-white font-bold bg-white/20 px-1 rounded">W A S D</span> to move.</p>
          <p className="text-white/80 text-sm">Use <span className="text-white font-bold bg-white/20 px-1 rounded">Mouse</span> to look.</p>
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
            {/* Level Geometry */}
            <Level1_Forest />

            {/* Player & Mission Target (Puppy) */}
            <Player />
            <Puppy />
          </Physics>
          
          {/* Post Processing */}
          <EffectComposer>
            <Bloom luminanceThreshold={1} mipmapBlur intensity={0.5} />
          </EffectComposer>
        </KeyboardControls>
      </Canvas>
    </div>
  );
}

export default App;
