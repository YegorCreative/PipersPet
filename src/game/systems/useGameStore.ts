import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Position {
  x: number;
  y: number;
}

interface GameState {
  // Persistent State
  completedMissions: number[];
  totalTreats: number;
  puppyHappiness: number;

  // Session State
  currentScreen: 'menu' | 'missions' | 'game';
  currentMission: number;
  hasTreat: boolean;
  missionComplete: boolean;
  playerPosition: Position;
  puppyPosition: Position;
  treatPosition: Position;
  flowersCollected: number;
  flowerPositions: { pos: Position; collected: boolean }[];

  movePlayer: (dx: number, dy: number) => void;
  collectTreat: () => void;
  feedPuppy: () => void;
  collectFlower: (index: number) => void;
  startMission: (missionNumber: number) => void;
  startNextMission: () => void;
  resetGame: () => void;
  goToMenu: () => void;
  goToMissions: () => void;
  resetProgress: () => void;
}

const INITIAL_PLAYER = { x: 50, y: 50 };
const INITIAL_PUPPY = { x: 80, y: 80 };
const INITIAL_TREAT = { x: 20, y: 20 };
const INITIAL_FLOWERS = [
  { pos: { x: 30, y: 70 }, collected: false },
  { pos: { x: 70, y: 30 }, collected: false },
  { pos: { x: 85, y: 60 }, collected: false },
];

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      completedMissions: [],
      totalTreats: 0,
      puppyHappiness: 0,

      currentScreen: 'menu',
      currentMission: 1,
      hasTreat: false,
      missionComplete: false,
      playerPosition: INITIAL_PLAYER,
      puppyPosition: INITIAL_PUPPY,
      treatPosition: INITIAL_TREAT,
      flowersCollected: 0,
      flowerPositions: INITIAL_FLOWERS,
      
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
        if (state.hasTreat && state.currentMission === 1 && !state.missionComplete) {
          const newCompleted = state.completedMissions.includes(1) ? state.completedMissions : [...state.completedMissions, 1];
          return { 
            hasTreat: false, 
            missionComplete: true,
            totalTreats: state.totalTreats + 1,
            completedMissions: newCompleted,
          };
        }
        return state;
      }),

      collectFlower: (index) => set((state) => {
        if (state.currentMission !== 2 || state.flowerPositions[index].collected) return state;
        
        const newFlowers = [...state.flowerPositions];
        newFlowers[index] = { ...newFlowers[index], collected: true };
        
        const newCollected = state.flowersCollected + 1;
        const missionComplete = newCollected >= 3;
        
        if (missionComplete && !state.missionComplete) {
          const newCompleted = state.completedMissions.includes(2) ? state.completedMissions : [...state.completedMissions, 2];
          return {
            flowerPositions: newFlowers,
            flowersCollected: newCollected,
            missionComplete: true,
            puppyHappiness: state.puppyHappiness + 1,
            completedMissions: newCompleted,
          };
        }
        
        return {
          flowerPositions: newFlowers,
          flowersCollected: newCollected,
        };
      }),

      startMission: (missionNumber) => set({
        currentScreen: 'game',
        currentMission: missionNumber,
        missionComplete: false,
        hasTreat: false,
        playerPosition: INITIAL_PLAYER,
        puppyPosition: INITIAL_PUPPY,
        treatPosition: INITIAL_TREAT,
        flowersCollected: 0,
        flowerPositions: INITIAL_FLOWERS,
      }),

      startNextMission: () => set((state) => {
        if (state.currentMission === 1) {
          return {
            currentMission: 2,
            missionComplete: false,
            hasTreat: false,
            playerPosition: INITIAL_PLAYER,
            puppyPosition: INITIAL_PUPPY,
            treatPosition: INITIAL_TREAT,
            flowersCollected: 0,
            flowerPositions: INITIAL_FLOWERS,
          };
        }
        return state;
      }),
      
      resetGame: () => set(() => ({
        hasTreat: false,
        missionComplete: false,
        playerPosition: INITIAL_PLAYER,
        puppyPosition: INITIAL_PUPPY,
        treatPosition: INITIAL_TREAT,
        flowersCollected: 0,
        flowerPositions: INITIAL_FLOWERS,
      })),

      goToMenu: () => set({ currentScreen: 'menu' }),
      
      goToMissions: () => set({ currentScreen: 'missions' }),

      resetProgress: () => set({
        completedMissions: [],
        totalTreats: 0,
        puppyHappiness: 0,
      }),
    }),
    {
      name: 'pipers-pet-storage',
      partialize: (state) => ({ 
        completedMissions: state.completedMissions,
        totalTreats: state.totalTreats,
        puppyHappiness: state.puppyHappiness
      }),
    }
  )
);
