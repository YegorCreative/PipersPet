import { create } from 'zustand';
import * as THREE from 'three';

export type Voxel = {
  position: [number, number, number];
  type: string;
};

interface GameState {
  playerPosition: THREE.Vector3;
  setPlayerPosition: (pos: THREE.Vector3) => void;
  buildMode: boolean;
  toggleBuildMode: () => void;
  voxels: Voxel[];
  addVoxel: (voxel: Voxel) => void;
}

export const useGameStore = create<GameState>((set) => ({
  playerPosition: new THREE.Vector3(),
  setPlayerPosition: (pos) => set({ playerPosition: pos }),
  buildMode: false,
  toggleBuildMode: () => set((state) => ({ buildMode: !state.buildMode })),
  voxels: [],
  addVoxel: (voxel) => set((state) => ({ voxels: [...state.voxels, voxel] })),
}));
