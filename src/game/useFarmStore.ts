import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CropState = 'empty' | 'planted' | 'watered' | 'ready';
export type CropType  = 'carrot' | 'wheat';

export const GROWTH_MS_NORMAL   = 30_000;
export const GROWTH_MS_UPGRADED = 20_000;

// Growth times per crop (normal / upgraded)
export const CROP_GROWTH: Record<CropType, { normal: number; upgraded: number }> = {
  carrot: { normal: 30_000, upgraded: 20_000 },
  wheat:  { normal: 45_000, upgraded: 30_000 },
};

// Harvest rewards per crop
export const CROP_REWARD: Record<CropType, { coins: number; carrot: number; wheat: number }> = {
  carrot: { coins: 5,  carrot: 3, wheat: 0 },
  wheat:  { coins: 10, carrot: 0, wheat: 2 },
};

interface FarmStore {
  coins: number;
  carrots: number;
  wheat: number;
  cropState: CropState;
  cropType: CropType;
  selectedCrop: CropType;
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

  selectCrop: (type: CropType) => void;
  plantCrop: () => void;
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
      wheat: 0,
      cropState: 'empty',
      cropType: 'carrot',
      selectedCrop: 'carrot',
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

      selectCrop: (type) => set({ selectedCrop: type }),

      plantCrop: () => {
        const s = get();
        if (s.cropState !== 'empty') return;
        const goalPlanted = true;
        const reward = !s.dayRewardGiven && allDone(goalPlanted, s.goalHarvested, s.goalFed);
        set({
          cropState: 'planted',
          cropType: s.selectedCrop,
          wateredAt: null,
          goalPlanted,
          ...(reward ? { dayComplete: true, dayRewardGiven: true, coins: s.coins + 25 } : {}),
        });
      },

      waterCrop: () => {
        const s = get();
        if (s.cropState !== 'planted') return;
        const times = CROP_GROWTH[s.cropType];
        set({
          cropState: 'watered',
          wateredAt: Date.now(),
          growthMs: s.hasWateringCan ? times.upgraded : times.normal,
        });
      },

      buyWateringCan: () => {
        const s = get();
        if (s.hasWateringCan || s.coins < 50) return;
        set({ hasWateringCan: true, coins: s.coins - 50 });
      },

      harvestCrop: () => {
        const s = get();
        if (s.cropState !== 'ready') return;
        const reward = CROP_REWARD[s.cropType];
        const goalHarvested = true;
        const newCoins = s.coins + reward.coins;
        const dayBonus = !s.dayRewardGiven && allDone(s.goalPlanted, goalHarvested, s.goalFed);
        set({
          carrots: s.carrots + reward.carrot,
          wheat: s.wheat + reward.wheat,
          coins: dayBonus ? newCoins + 25 : newCoins,
          cropState: 'empty',
          wateredAt: null,
          goalHarvested,
          ...(dayBonus ? { dayComplete: true, dayRewardGiven: true } : {}),
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
        wheat: s.wheat,
        puppyHappiness: s.puppyHappiness,
        day: s.day,
        goalPlanted: s.goalPlanted,
        goalHarvested: s.goalHarvested,
        goalFed: s.goalFed,
        dayComplete: s.dayComplete,
        dayRewardGiven: s.dayRewardGiven,
        cropState: s.cropState,
        cropType: s.cropType,
        selectedCrop: s.selectedCrop,
        wateredAt: s.wateredAt,
        hasWateringCan: s.hasWateringCan,
      }),
    }
  )
);

