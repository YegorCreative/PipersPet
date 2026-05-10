import { useState, useEffect } from 'react';
import { useFarmStore } from '../game/useFarmStore';

const STAGES = [
  { threshold: 0,   emoji: '🌱', label: 'Just sprouting…' },
  { threshold: 33,  emoji: '🌿', label: 'Growing nicely!' },
  { threshold: 66,  emoji: '🌾', label: 'Almost ready…' },
];

export const CropPatch = () => {
  const cropState = useFarmStore((s) => s.cropState);
  const wateredAt = useFarmStore((s) => s.wateredAt);
  const growthMs = useFarmStore((s) => s.growthMs);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (cropState !== 'watered' || !wateredAt) {
      setProgress(0);
      return;
    }
    const update = () =>
      setProgress(Math.min(100, ((Date.now() - wateredAt) / growthMs) * 100));
    update();
    const id = setInterval(update, 200);
    return () => clearInterval(id);
  }, [cropState, wateredAt, growthMs]);

  const growthStage = STAGES.filter((s) => progress >= s.threshold).at(-1)!;

  const display = {
    empty: {
      emoji: null,
      label: 'Empty soil',
      hint: 'Plant a carrot to begin',
    },
    planted: {
      emoji: '🌱',
      label: 'Carrot planted',
      hint: 'Water it to start growing',
    },
    watered: {
      emoji: growthStage.emoji,
      label: growthStage.label,
      hint: null,
    },
    ready: {
      emoji: '🥕',
      label: 'Ready to harvest!',
      hint: null,
    },
  }[cropState];

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">
        Crop Patch
      </p>

      {/* Dirt tile */}
      <div className="relative w-36 h-36 rounded-2xl bg-amber-900 border-4 border-amber-800 shadow-[inset_0_4px_12px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center">
        {/* Soil texture */}
        <div className="absolute inset-3 flex flex-col gap-1.5 opacity-25 pointer-events-none">
          <div className="w-full h-1 bg-amber-600 rounded" />
          <div className="w-3/4 h-1 bg-amber-600 rounded ml-2" />
          <div className="w-full h-1 bg-amber-600 rounded" />
          <div className="w-2/3 h-1 bg-amber-600 rounded ml-3" />
          <div className="w-5/6 h-1 bg-amber-600 rounded" />
        </div>

        {display.emoji ? (
          <span
            className="text-5xl z-10 drop-shadow-lg"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
          >
            {display.emoji}
          </span>
        ) : (
          <div className="z-10 flex flex-col gap-1.5 opacity-40">
            <div className="w-16 h-1.5 bg-amber-600 rounded-full" />
            <div className="w-12 h-1.5 bg-amber-600 rounded-full ml-2" />
          </div>
        )}
      </div>

      <p className="text-white font-semibold text-sm">{display.label}</p>

      {display.hint && (
        <p className="text-white/45 text-xs text-center max-w-[140px]">
          {display.hint}
        </p>
      )}

      {/* Growth progress bar */}
      {cropState === 'watered' && (
        <div className="w-36 flex flex-col gap-1">
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #4ade80, #22c55e)',
              }}
            />
          </div>
          <p className="text-center text-white/45 text-xs">
            {Math.round(progress)}% grown
          </p>
        </div>
      )}
    </div>
  );
};
