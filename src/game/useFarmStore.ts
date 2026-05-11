import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CropState = 'empty' | 'planted' | 'watered' | 'ready';

export const GROWTH_MS_NORMAL   = 30_000;
export const GROWTH_MS_UPGRADED = 20_000;

interface FarmStore {
  coins: number;
  carrots: number;
  cropState: CropState;
  wateredAt: number | null;
  growthMs: number;
  puppyHappiness: number;
  puppyFedRecently: boolean;

  day: number;
  goalPlanted: boolean;
  goalHarvested: boolean;
  goalFed: boolean;
  dayComplete: boolean;
  dayRewardGiven: boolean;

  hasWateringCan: boolean;

  plantCarrot: () => void;
  waterCrop: () => void;
  harvestCrop: () => void;
  feedPuppy: () => void;
  tick: () => void;
  startNextDay: () => void;
  buyWateringCan: () => void;
}

function allDone(a: boolean, b: boolean, c: boolean) {
  return a && b && c;
}

export const useFarmStore = create<FarmStore>()(
  persist(
    (set, get) => ({
      coins: 0,
      carrots: 0,
      cropState: 'empty',
      wateredAt: null,
      growthMs: GROWTH_MS_NORMAL,
      puppyHappiness: 50,
      puppyFedRecently: false,

      day: 1,
      goalPlanted: false,
      goalHarvested: false,
      goalFed: false,
      dayComplete: false,
      dayRewardGiven: false,

      hasWateringCan: false,

      plantCarrot: () => {
        const s = get();
        if (s.cropState !== 'empty') return;
        const goalPlanted = true;
        const reward = !s.dayRewardGiven && allDone(goalPlanted, s.goalHarvested, s.goalFed);
        set({
          cropState: 'planted',
          wateredAt: null,
          goalPlanted,
          ...(reward ? { dayComplete: true, dayRewardGiven: true, coins: s.coins + 25 } : {}),
        });
      },

      waterCrop: () => {
        const s = get();
        if (s.cropState !== 'planted') return;
        set({
          cropState: 'watered',
          wateredAt: Date.now(),
          growthMs: s.hasWateringCan ? GROWTH_MS_UPGRADED : GROWTH_MS_NORMAL,
        });
      },

      buyWateringCan: () => {
        const s = get();
        if (s.hasWateringCan || s.coins < 50) return;
        set({ hasWateringCan: true, coins: s.coins - 50, growthMs: GROWTH_MS_UPGRADED });
      },

      harvestCrop: () => {
        const s = get();
        if (s.cropState !== 'ready') return;
        const goalHarvested = true;
        const newCoins = s.coins + 5;
        const reward = !s.dayRewardGiven && allDone(s.goalPlanted, goalHarvested, s.goalFed);
        set({
          carrots: s.carrots + 3,
          coins: reward ? newCoins + 25 : newCoins,
          cropState: 'empty',
          wateredAt: null,
          goalHarvested,
          ...(reward ? { dayComplete: true, dayRewardGiven: true } : {}),
        });
      },

      feedPuppy: () => {
        const s = get();
        if (s.carrots < 1) return;
        const goalFed = true;
        const newCoins = s.coins + 2;
        const reward = !s.dayRewardGiven && allDone(s.goalPlanted, s.goalHarvested, goalFed);
        set({
          carrots: s.carrots - 1,
          coins: reward ? newCoins + 25 : newCoins,
          puppyHappiness: Math.min(100, s.puppyHappiness + 20),
          puppyFedRecently: true,
          goalFed,
          ...(reward ? { dayComplete: true, dayRewardGiven: true } : {}),
        });
        setTimeout(() => set({ puppyFedRecently: false }), 2500);
      },

      tick: () => {
        const { cropState, wateredAt, growthMs } = get();
        if (cropState === 'watered' && wateredAt !== null) {
          if (Date.now() - wateredAt >= growthMs) {
            set({ cropState: 'ready' });
          }
        }
      },

      startNextDay: () => {
        set((s) => ({
          day: s.day + 1,
          goalPlanted: false,
          goalHarvested: false,
          goalFed: false,
          dayComplete: false,
          dayRewardGiven: false,
          cropState: 'empty',
          wateredAt: null,
        }));
      },
    }),
    {
      name: 'pipers-farm-save',
      partialize: (s) => ({
        coins: s.coins,
        carrots: s.carrots,
        puppyHappiness: s.puppyHappiness,
        day: s.day,
        goalPlanted: s.goalPlanted,
        goalHarvested: s.goalHarvested,
        goalFed: s.goalFed,
        dayComplete: s.dayComplete,
        dayRewardGiven: s.dayRewardGiven,
        cropState: s.cropState,
        wateredAt: s.wateredAt,
        hasWateringCan: s.hasWateringCan,
      }),
    }
  )
);

