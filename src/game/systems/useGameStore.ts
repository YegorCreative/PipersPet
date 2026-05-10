import { create } from 'zustand';
import { Vector3 } from 'three';

interface GameState {
  hasTreat: boolean;
  missionComplete: boolean;
  playerPosition: Vector3; // mutated directly to avoid React renders
  collectTreat: () => void;
  feedPuppy: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  hasTreat: false,
  missionComplete: false,
  playerPosition: new Vector3(0, 0, 0),
  collectTreat: () => set({ hasTreat: true }),
  feedPuppy: () =>
    set((state) => {
      if (state.hasTreat) {
        return { hasTreat: false, missionComplete: true };
      }
      return state;
    }),
  resetGame: () => set({ hasTreat: false, missionComplete: false, playerPosition: new Vector3(0, 0, 0) }),
}));
