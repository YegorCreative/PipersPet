import { create } from 'zustand';

interface Position {
  x: number;
  y: number;
}

interface GameState {
  hasTreat: boolean;
  missionComplete: boolean;
  playerPosition: Position;
  puppyPosition: Position;
  treatPosition: Position;
  movePlayer: (dx: number, dy: number) => void;
  collectTreat: () => void;
  feedPuppy: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  hasTreat: false,
  missionComplete: false,
  playerPosition: { x: 50, y: 50 },
  puppyPosition: { x: 80, y: 80 },
  treatPosition: { x: 20, y: 20 },
  
  movePlayer: (dx, dy) => set((state) => {
    if (state.missionComplete) return state;
    return {
      playerPosition: {
        x: Math.max(0, Math.min(100, state.playerPosition.x + dx)),
        y: Math.max(0, Math.min(100, state.playerPosition.y + dy)),
      }
    };
  }),
  
  collectTreat: () => set({ hasTreat: true }),
  
  feedPuppy: () => set((state) => {
    if (state.hasTreat) {
      return { hasTreat: false, missionComplete: true };
    }
    return state;
  }),
  
  resetGame: () => set({
    hasTreat: false,
    missionComplete: false,
    playerPosition: { x: 50, y: 50 },
    puppyPosition: { x: 80, y: 80 },
    treatPosition: { x: 20, y: 20 },
  }),
}));
