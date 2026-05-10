import { create } from 'zustand';

export type CropState = 'empty' | 'planted' | 'watered' | 'ready';

export const GROWTH_MS = 30_000; // 30 seconds to grow after watering

interface FarmStore {
  coins: number;
  carrots: number;
  cropState: CropState;
  wateredAt: number | null;
  growthMs: number;
  puppyHappiness: number;
  puppyFedRecently: boolean;

  plantCarrot: () => void;
  waterCrop: () => void;
  harvestCrop: () => void;
  feedPuppy: () => void;
  tick: () => void;
}

export const useFarmStore = create<FarmStore>((set, get) => ({
  coins: 0,
  carrots: 0,
  cropState: 'empty',
  wateredAt: null,
  growthMs: GROWTH_MS,
  puppyHappiness: 50,
  puppyFedRecently: false,

  plantCarrot: () => {
    if (get().cropState !== 'empty') return;
    set({ cropState: 'planted', wateredAt: null });
  },

  waterCrop: () => {
    if (get().cropState !== 'planted') return;
    set({ cropState: 'watered', wateredAt: Date.now() });
  },

  harvestCrop: () => {
    if (get().cropState !== 'ready') return;
    set((s) => ({
      carrots: s.carrots + 3,
      coins: s.coins + 5,
      cropState: 'empty',
      wateredAt: null,
    }));
  },

  feedPuppy: () => {
    const { carrots, puppyHappiness } = get();
    if (carrots < 1) return;
    set({
      carrots: carrots - 1,
      puppyHappiness: Math.min(100, puppyHappiness + 20),
      puppyFedRecently: true,
      coins: get().coins + 2,
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
}));
