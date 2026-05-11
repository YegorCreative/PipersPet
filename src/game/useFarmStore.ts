import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CropState = 'empty' | 'planted' | 'watered' | 'ready';
export type CropType  = 'carrot' | 'wheat';

export const CROP_GROWTH: Record<CropType, { normal: number; upgraded: number }> = {
  carrot: { normal: 30_000, upgraded: 20_000 },
  wheat:  { normal: 45_000, upgraded: 30_000 },
};

export const CROP_REWARD: Record<CropType, { coins: number; carrot: number; wheat: number }> = {
  carrot: { coins: 5,  carrot: 3, wheat: 0 },
  wheat:  { coins: 10, carrot: 0, wheat: 2 },
};

export interface PatchState {
  cropState: CropState;
  cropType: CropType;
  selectedCrop: CropType;
  wateredAt: number | null;
  growthMs: number;
}

const DEFAULT_PATCH: PatchState = {
  cropState: 'empty',
  cropType: 'carrot',
  selectedCrop: 'carrot',
  wateredAt: null,
  growthMs: CROP_GROWTH.carrot.normal,
};

function updatePatch(patches: PatchState[], index: number, delta: Partial<PatchState>): PatchState[] {
  return patches.map((p, i) => (i === index ? { ...p, ...delta } : p));
}

function allDone(a: boolean, b: boolean, c: boolean) {
  return a && b && c;
}

interface FarmStore {
  coins: number;
  carrots: number;
  wheat: number;
  eggs: number;

  patches: PatchState[];
  activePatch: number;
  patch2Unlocked: boolean;

  puppyHappiness: number;
  puppyFedRecently: boolean;

  chickenHappiness: number;
  chickenFedRecently: boolean;

  day: number;
  goalHarvested: boolean;
  goalFedPuppy: boolean;
  goalFedChicken: boolean;
  dayComplete: boolean;
  dayRewardGiven: boolean;

  hasWateringCan: boolean;

  setActivePatch: (index: number) => void;
  selectCrop: (type: CropType) => void;
  plantCrop: () => void;
  waterCrop: () => void;
  harvestCrop: () => void;
  feedPuppy: () => void;
  feedChicken: () => void;
  tick: () => void;
  startNextDay: () => void;
  buyWateringCan: () => void;
  unlockPatch2: () => void;
}

export const useFarmStore = create<FarmStore>()(
  persist(
    (set, get) => ({
      coins: 0,
      carrots: 0,
      wheat: 0,
      eggs: 0,

      patches: [DEFAULT_PATCH, DEFAULT_PATCH],
      activePatch: 0,
      patch2Unlocked: false,

      puppyHappiness: 50,
      puppyFedRecently: false,

      chickenHappiness: 50,
      chickenFedRecently: false,

      day: 1,
      goalHarvested: false,
      goalFedPuppy: false,
      goalFedChicken: false,
      dayComplete: false,
      dayRewardGiven: false,

      hasWateringCan: false,

      setActivePatch: (index) => set({ activePatch: index }),

      selectCrop: (type) => {
        const { patches, activePatch } = get();
        if (patches[activePatch].cropState !== 'empty') return;
        set({ patches: updatePatch(patches, activePatch, { selectedCrop: type }) });
      },

      plantCrop: () => {
        const { patches, activePatch } = get();
        const p = patches[activePatch];
        if (p.cropState !== 'empty') return;
        set({ patches: updatePatch(patches, activePatch, { cropState: 'planted', cropType: p.selectedCrop, wateredAt: null }) });
      },

      waterCrop: () => {
        const { patches, activePatch, hasWateringCan } = get();
        const p = patches[activePatch];
        if (p.cropState !== 'planted') return;
        const times = CROP_GROWTH[p.cropType];
        const growthMs = hasWateringCan ? times.upgraded : times.normal;
        set({ patches: updatePatch(patches, activePatch, { cropState: 'watered', wateredAt: Date.now(), growthMs }) });
      },

      harvestCrop: () => {
        const s = get();
        const p = s.patches[s.activePatch];
        if (p.cropState !== 'ready') return;
        const reward = CROP_REWARD[p.cropType];
        const goalHarvested = true;
        const newCoins = s.coins + reward.coins;
        const dayBonus = !s.dayRewardGiven && allDone(goalHarvested, s.goalFedPuppy, s.goalFedChicken);
        set({
          carrots: s.carrots + reward.carrot,
          wheat: s.wheat + reward.wheat,
          coins: dayBonus ? newCoins + 25 : newCoins,
          patches: updatePatch(s.patches, s.activePatch, { cropState: 'empty', wateredAt: null }),
          goalHarvested,
          ...(dayBonus ? { dayComplete: true, dayRewardGiven: true } : {}),
        });
      },

      feedPuppy: () => {
        const s = get();
        if (s.carrots < 1) return;
        const goalFedPuppy = true;
        const newCoins = s.coins + 2;
        const dayBonus = !s.dayRewardGiven && allDone(s.goalHarvested, goalFedPuppy, s.goalFedChicken);
        set({
          carrots: s.carrots - 1,
          coins: dayBonus ? newCoins + 25 : newCoins,
          puppyHappiness: Math.min(100, s.puppyHappiness + 20),
          puppyFedRecently: true,
          goalFedPuppy,
          ...(dayBonus ? { dayComplete: true, dayRewardGiven: true } : {}),
        });
        setTimeout(() => set({ puppyFedRecently: false }), 2500);
      },

      feedChicken: () => {
        const s = get();
        if (s.wheat < 1) return;
        const goalFedChicken = true;
        const newCoins = s.coins + 3;
        const dayBonus = !s.dayRewardGiven && allDone(s.goalHarvested, s.goalFedPuppy, goalFedChicken);
        set({
          wheat: s.wheat - 1,
          eggs: s.eggs + 1,
          coins: dayBonus ? newCoins + 25 : newCoins,
          chickenHappiness: Math.min(100, s.chickenHappiness + 15),
          chickenFedRecently: true,
          goalFedChicken,
          ...(dayBonus ? { dayComplete: true, dayRewardGiven: true } : {}),
        });
        setTimeout(() => set({ chickenFedRecently: false }), 2500);
      },

      tick: () => {
        const { patches } = get();
        const now = Date.now();
        let changed = false;
        const newPatches = patches.map((p) => {
          if (p.cropState === 'watered' && p.wateredAt !== null && now - p.wateredAt >= p.growthMs) {
            changed = true;
            return { ...p, cropState: 'ready' as CropState };
          }
          return p;
        });
        if (changed) set({ patches: newPatches });
      },

      startNextDay: () => {
        set((s) => ({
          day: s.day + 1,
          goalHarvested: false,
          goalFedPuppy: false,
          goalFedChicken: false,
          dayComplete: false,
          dayRewardGiven: false,
          activePatch: 0,
          patches: [DEFAULT_PATCH, DEFAULT_PATCH],
        }));
      },

      buyWateringCan: () => {
        const s = get();
        if (s.hasWateringCan || s.coins < 50) return;
        set({ hasWateringCan: true, coins: s.coins - 50 });
      },

      unlockPatch2: () => {
        const s = get();
        if (s.patch2Unlocked || s.coins < 100) return;
        set({ patch2Unlocked: true, coins: s.coins - 100 });
      },
    }),
    {
      name: 'pipers-farm-save',
      partialize: (s) => ({
        coins: s.coins,
        carrots: s.carrots,
        wheat: s.wheat,
        eggs: s.eggs,
        puppyHappiness: s.puppyHappiness,
        chickenHappiness: s.chickenHappiness,
        day: s.day,
        goalHarvested: s.goalHarvested,
        goalFedPuppy: s.goalFedPuppy,
        goalFedChicken: s.goalFedChicken,
        dayComplete: s.dayComplete,
        dayRewardGiven: s.dayRewardGiven,
        patches: s.patches,
        patch2Unlocked: s.patch2Unlocked,
        hasWateringCan: s.hasWateringCan,
      }),
    }
  )
);

