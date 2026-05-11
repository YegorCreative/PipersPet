import { useState, useEffect } from 'react';
import { useFarmStore, type CropType } from '../game/useFarmStore';

const STAGES = [
  { threshold: 0,   emoji: '🌱', label: 'Just sprouting…' },
  { threshold: 33,  emoji: '🌿', label: 'Growing nicely!' },
  { threshold: 66,  emoji: '🌾', label: 'Almost ready…' },
];

const CROP_READY_EMOJI: Record<CropType, string> = {
  carrot: '🥕',
  wheat: '🌾',
};

const CROP_PLANTED_LABEL: Record<CropType, string> = {
  carrot: 'Carrot planted',
  wheat: 'Wheat planted',
};

interface Props {
  patchIndex: number;
}

export const CropPatch = ({ patchIndex }: Props) => {
  const patches        = useFarmStore((s) => s.patches);
  const activePatch    = useFarmStore((s) => s.activePatch);
  const patch2Unlocked = useFarmStore((s) => s.patch2Unlocked);
  const coins          = useFarmStore((s) => s.coins);
  const hasWateringCan = useFarmStore((s) => s.hasWateringCan);
  const setActivePatch = useFarmStore((s) => s.setActivePatch);
  const unlockPatch2   = useFarmStore((s) => s.unlockPatch2);

  const patch = patches[patchIndex];
  const { cropState, cropType, wateredAt, growthMs } = patch;
  const isActive = activePatch === patchIndex;
  const isLocked = patchIndex === 1 && !patch2Unlocked;

  const [progress, setProgress] = useState(0);

  const growthSec = Math.round(growthMs / 1000);
  const growthLabel = hasWateringCan
    ? `Growth time: ${growthSec}s ⚡`
    : `Growth time: ${growthSec}s`;
  const growthLabelColor = hasWateringCan ? 'text-green-300' : 'text-white/40';

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

  const filtered = STAGES.filter((s) => progress >= s.threshold);
  const growthStage = filtered[filtered.length - 1]!;

  /* ── Locked state ─────────────────────────────────── */
  if (isLocked) {
    const canAfford = coins >= 100;
    return (
      <div className="flex flex-col items-center gap-3">
        <p className="text-white/40 text-xs font-semibold uppercase tracking-widest">
          Plot 2
        </p>

        {/* Locked dirt tile */}
        <div className="relative w-36 h-36 rounded-2xl bg-amber-950/50 border-4 border-amber-900/30 shadow-[inset_0_4px_12px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center">
          <div className="absolute inset-3 flex flex-col gap-1.5 opacity-10 pointer-events-none">
            <div className="w-full h-1 bg-amber-700 rounded" />
            <div className="w-3/4 h-1 bg-amber-700 rounded ml-2" />
            <div className="w-full h-1 bg-amber-700 rounded" />
            <div className="w-2/3 h-1 bg-amber-700 rounded ml-3" />
            <div className="w-5/6 h-1 bg-amber-700 rounded" />
          </div>
          <span className="text-4xl z-10 opacity-50">🔒</span>
        </div>

        <p className="text-white/30 font-semibold text-sm">Locked Plot</p>

        <button
          onClick={canAfford ? unlockPatch2 : undefined}
          disabled={!canAfford}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border font-semibold text-xs transition-all duration-150 select-none
            ${canAfford
              ? 'bg-amber-500 hover:bg-amber-400 border-amber-400/60 text-white shadow-md cursor-pointer active:scale-95'
              : 'bg-white/8 border-white/15 text-white/35 cursor-not-allowed'
            }`}
        >
          🔓 Unlock Plot  100🪙
        </button>

        {!canAfford && (
          <p className="text-white/30 text-xs">{100 - coins} more 🪙 needed</p>
        )}
      </div>
    );
  }

  /* ── Normal (unlocked) state ──────────────────────── */
  const display = {
    empty: {
      emoji: null,
      label: 'Empty soil',
      hint: patchIndex === 1 ? 'Click to select, then plant' : 'Choose a crop and plant',
    },
    planted: {
      emoji: '🌱',
      label: CROP_PLANTED_LABEL[cropType],
      hint: 'Water it to start growing',
    },
    watered: {
      emoji: growthStage.emoji,
      label: growthStage.label,
      hint: null,
    },
    ready: {
      emoji: CROP_READY_EMOJI[cropType],
      label: 'Ready to harvest!',
      hint: null,
    },
  }[cropState];

  return (
    <div
      className="flex flex-col items-center gap-3 cursor-pointer"
      onClick={() => setActivePatch(patchIndex)}
    >
      <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">
        {patchIndex === 0 ? 'Crop Patch' : 'Plot 2'}
      </p>

      {/* Dirt tile */}
      <div
        className={`relative w-36 h-36 rounded-2xl bg-amber-900 border-4 shadow-[inset_0_4px_12px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center transition-all duration-200
          ${isActive
            ? 'border-white/60 ring-2 ring-white/30'
            : 'border-amber-800 hover:border-amber-600'
          }`}
      >
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

      {/* Active badge */}
      {isActive && (
        <p className="text-white/80 text-xs font-bold uppercase tracking-widest -mt-1">
          ▶ Active
        </p>
      )}

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
          <p className={`text-center text-xs font-medium ${growthLabelColor}`}>
            {growthLabel}
          </p>
        </div>
      )}

      {/* Growth time hint on planted state */}
      {cropState === 'planted' && (
        <p className={`text-xs font-medium ${growthLabelColor}`}>{growthLabel}</p>
      )}
    </div>
  );
};

