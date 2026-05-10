import { create } from 'zustand';

interface GameState {
  hasTreat: boolean;
  missionComplete: boolean;
  collectTreat: () => void;
  feedPuppy: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  hasTreat: false,
  missionComplete: false,
  collectTreat: () => set({ hasTreat: true }),
  feedPuppy: () =>
    set((state) => {
      if (state.hasTreat) {
        return { hasTreat: false, missionComplete: true };
      }
      return state;
    }),
  resetGame: () => set({ hasTreat: false, missionComplete: false }),
}));
