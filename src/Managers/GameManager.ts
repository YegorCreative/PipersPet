import { create } from 'zustand';

interface GameState {
  score: number;
  incrementScore: (amount: number) => void;
  resetScore: () => void;
}

export const useGameManager = create<GameState>((set) => ({
  score: 0,
  incrementScore: (amount) => set((state) => ({ score: state.score + amount })),
  resetScore: () => set({ score: 0 }),
}));
