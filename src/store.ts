import { create } from 'zustand';
import * as THREE from 'three';

interface GameState {
  playerPosition: THREE.Vector3;
  setPlayerPosition: (pos: THREE.Vector3) => void;
}

export const useGameStore = create<GameState>((set) => ({
  playerPosition: new THREE.Vector3(),
  setPlayerPosition: (pos) => set({ playerPosition: pos }),
}));
