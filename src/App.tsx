import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { KeyboardControls, Loader } from '@react-three/drei';
import { HUD } from './UI/HUD';
import { MainScene } from './Scenes/MainScene';

// Define controls for standard movement
const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'sprint', keys: ['Shift'] },
];

function App() {
  return (
    <KeyboardControls map={keyboardMap}>
      <div className="w-screen h-screen overflow-hidden bg-black relative">
        <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
          <Suspense fallback={null}>
            <Physics>
              <MainScene />
            </Physics>
          </Suspense>
        </Canvas>
        <HUD />
        <Loader />
      </div>
    </KeyboardControls>
  );
}

export default App;
