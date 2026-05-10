import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Position {
  x: number;
  y: number;
}

export type PuppyCommand = 'follow' | 'stay' | 'search' | 'fetch';

interface GameState {
  // Persistent State
  completedMissions: number[];
  totalTreats: number;
  puppyHappiness: number;

  // Session State
  currentScreen: 'menu' | 'missions' | 'game' | 'pets';
  currentMission: number;
  activeCommand: PuppyCommand;
  hasTreat: boolean;
  hasToy: boolean;
  missionComplete: boolean;
  
  // Entity Positions
  playerPosition: Position;
  puppyPosition: Position;
  treatPosition: Position;
  toyPosition: Position;
  
  // Mission 2
  flowersCollected: number;
  flowerPositions: { pos: Position; collected: boolean }[];
  
  // Mission 4
  keyPosition: Position;
  keyVisible: boolean;
  hasKey: boolean;
  gatePosition: Position;
  gateUnlocked: boolean;
  exitPosition: Position;

  movePlayer: (dx: number, dy: number) => void;
  movePuppy: (dx: number, dy: number) => void;
  setCommand: (command: PuppyCommand) => void;
  collectTreat: () => void;
  feedPuppy: () => void;
  collectFlower: (index: number) => void;
  collectToy: () => void;
  revealKey: () => void;
  collectKey: () => void;
  unlockGate: () => void;
  completeMission4: () => void;
  
  startMission: (missionNumber: number) => void;
  startNextMission: () => void;
  resetGame: () => void;
  goToMenu: () => void;
  goToMissions: () => void;
  goToPets: () => void;
  resetProgress: () => void;
}

const INITIAL_PLAYER = { x: 50, y: 50 };
const INITIAL_PUPPY = { x: 80, y: 80 };
const INITIAL_TREAT = { x: 20, y: 20 };
const INITIAL_TOY = { x: 20, y: 85 };
const INITIAL_FLOWERS = [
  { pos: { x: 30, y: 70 }, collected: false },
  { pos: { x: 70, y: 30 }, collected: false },
  { pos: { x: 85, y: 60 }, collected: false },
];
const INITIAL_KEY = { x: 85, y: 20 };
const INITIAL_GATE = { x: 50, y: 10 };
const INITIAL_EXIT = { x: 50, y: 0 };

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      completedMissions: [],
      totalTreats: 0,
      puppyHappiness: 0,

      currentScreen: 'menu',
      currentMission: 1,
      activeCommand: 'follow',
      hasTreat: false,
      hasToy: false,
      missionComplete: false,
      
      playerPosition: INITIAL_PLAYER,
      puppyPosition: INITIAL_PUPPY,
      treatPosition: INITIAL_TREAT,
      toyPosition: INITIAL_TOY,
      flowersCollected: 0,
      flowerPositions: INITIAL_FLOWERS,
      
      keyPosition: INITIAL_KEY,
      keyVisible: false,
      hasKey: false,
      gatePosition: INITIAL_GATE,
      gateUnlocked: false,
      exitPosition: INITIAL_EXIT,
      
      movePlayer: (dx, dy) => set((state) => {
        if (state.missionComplete) return state;
        
        // Block player movement if gate is locked and player tries to cross it
        const newX = state.playerPosition.x + dx;
        const newY = state.playerPosition.y + dy;
        
        // Simple bounding box logic for the gate (y < 12 and x is around 50)
        if (state.currentMission === 4 && !state.gateUnlocked) {
          if (newY < 12 && newX > 40 && newX < 60) {
            return state; // blocked
          }
        }
        
        return {
          playerPosition: {
            x: Math.max(0, Math.min(100, newX)),
            y: Math.max(0, Math.min(100, newY)),
          }
        };
      }),
      
      movePuppy: (dx, dy) => set((state) => {
        return {
          puppyPosition: {
            x: Math.max(0, Math.min(100, state.puppyPosition.x + dx)),
            y: Math.max(0, Math.min(100, state.puppyPosition.y + dy)),
          }
        };
      }),
      
      setCommand: (command) => set({ activeCommand: command }),
      
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

      collectToy: () => set((state) => {
        if (state.currentMission !== 3 || state.hasToy) return state;
        
        const newCompleted = state.completedMissions.includes(3) ? state.completedMissions : [...state.completedMissions, 3];
        return {
          hasToy: true,
          missionComplete: true,
          puppyHappiness: state.puppyHappiness + 1,
          completedMissions: newCompleted,
        };
      }),
      
      revealKey: () => set({ keyVisible: true }),
      
      collectKey: () => set({ hasKey: true }),
      
      unlockGate: () => set({ gateUnlocked: true }),
      
      completeMission4: () => set((state) => {
        if (state.currentMission !== 4 || state.missionComplete) return state;
        const newCompleted = state.completedMissions.includes(4) ? state.completedMissions : [...state.completedMissions, 4];
        return {
          missionComplete: true,
          puppyHappiness: state.puppyHappiness + 2, // big reward
          completedMissions: newCompleted,
        };
      }),

      startMission: (missionNumber) => set({
        currentScreen: 'game',
        currentMission: missionNumber,
        missionComplete: false,
        activeCommand: 'follow',
        hasTreat: false,
        hasToy: false,
        playerPosition: INITIAL_PLAYER,
        puppyPosition: INITIAL_PUPPY,
        treatPosition: INITIAL_TREAT,
        toyPosition: INITIAL_TOY,
        flowersCollected: 0,
        flowerPositions: INITIAL_FLOWERS,
        keyVisible: false,
        hasKey: false,
        gateUnlocked: false,
        keyPosition: INITIAL_KEY,
        gatePosition: INITIAL_GATE,
        exitPosition: INITIAL_EXIT,
      }),

      startNextMission: () => set((state) => {
        if (state.currentMission < 4) {
          return {
            currentMission: state.currentMission + 1,
            missionComplete: false,
            activeCommand: 'follow',
            hasTreat: false,
            hasToy: false,
            playerPosition: INITIAL_PLAYER,
            puppyPosition: INITIAL_PUPPY,
            treatPosition: INITIAL_TREAT,
            toyPosition: INITIAL_TOY,
            flowersCollected: 0,
            flowerPositions: INITIAL_FLOWERS,
            keyVisible: false,
            hasKey: false,
            gateUnlocked: false,
            keyPosition: INITIAL_KEY,
            gatePosition: INITIAL_GATE,
            exitPosition: INITIAL_EXIT,
          };
        }
        return state;
      }),
      
      resetGame: () => set(() => ({
        hasTreat: false,
        hasToy: false,
        missionComplete: false,
        activeCommand: 'follow',
        playerPosition: INITIAL_PLAYER,
        puppyPosition: INITIAL_PUPPY,
        treatPosition: INITIAL_TREAT,
        toyPosition: INITIAL_TOY,
        flowersCollected: 0,
        flowerPositions: INITIAL_FLOWERS,
        keyVisible: false,
        hasKey: false,
        gateUnlocked: false,
        keyPosition: INITIAL_KEY,
        gatePosition: INITIAL_GATE,
        exitPosition: INITIAL_EXIT,
      })),

      goToMenu: () => set({ currentScreen: 'menu' }),
      
      goToMissions: () => set({ currentScreen: 'missions' }),

      goToPets: () => set({ currentScreen: 'pets' }),

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
