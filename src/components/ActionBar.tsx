import { useState } from 'react';
import { useFarmStore, type CropType } from '../game/useFarmStore';
import { Shop } from './Shop';
import { Market } from './Market';

interface BtnProps {
  onClick?: () => void;
  disabled?: boolean;
  icon: string;
  label: string;
  variant: 'green' | 'blue' | 'orange' | 'pink' | 'ghost';
}

const variantClasses: Record<BtnProps['variant'], string> = {
  green:  'bg-green-500 hover:bg-green-400 border-green-400/60 shadow-green-900/30',
  blue:   'bg-sky-500 hover:bg-sky-400 border-sky-400/60 shadow-sky-900/30',
  orange: 'bg-orange-500 hover:bg-orange-400 border-orange-400/60 shadow-orange-900/30',
  pink:   'bg-rose-500 hover:bg-rose-400 border-rose-400/60 shadow-rose-900/30',
  ghost:  'bg-white/10 border-white/20 shadow-none',
};

const CROP_META: Record<CropType, { icon: string; label: string; rewardLabel: string }> = {
  carrot: { icon: '🥕', label: 'Carrot', rewardLabel: '+3🥕 +5🪙' },
  wheat:  { icon: '🌾', label: 'Wheat',  rewardLabel: '+2🌾 +10🪙' },
};

const ActionButton = ({ onClick, disabled, icon, label, variant }: BtnProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl border text-white font-semibold text-sm
      transition-all duration-150 shadow-md select-none
      ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer active:scale-95 hover:shadow-lg'}
      ${variantClasses[variant]}
    `}
  >
    <span className="text-base">{icon}</span>
    <span>{label}</span>
  </button>
);

export const ActionBar = () => {
  const patches      = useFarmStore((s) => s.patches);
  const activePatch  = useFarmStore((s) => s.activePatch);
  const carrots      = useFarmStore((s) => s.carrots);
  const wheat        = useFarmStore((s) => s.wheat);
  const carrotSeeds  = useFarmStore((s) => s.carrotSeeds);
  const wheatSeeds   = useFarmStore((s) => s.wheatSeeds);
  const selectCrop   = useFarmStore((s) => s.selectCrop);
  const plantCrop    = useFarmStore((s) => s.plantCrop);
  const waterCrop    = useFarmStore((s) => s.waterCrop);
  const harvestCrop  = useFarmStore((s) => s.harvestCrop);
  const feedPuppy    = useFarmStore((s) => s.feedPuppy);
  const feedChicken  = useFarmStore((s) => s.feedChicken);
  const [shopOpen, setShopOpen] = useState(false);
  const [marketOpen, setMarketOpen] = useState(false);

  const patch = patches[activePatch];
  const { cropState, cropType, selectedCrop } = patch;
  const harvestMeta = CROP_META[cropType];

  const seedCount: Record<CropType, number> = { carrot: carrotSeeds, wheat: wheatSeeds };
  const canPlant = seedCount[selectedCrop] > 0;
  const patchLabel = activePatch === 0 ? 'Patch 1' : 'Plot 2';

  return (
    <>
      {shopOpen && <Shop onClose={() => setShopOpen(false)} />}
      {marketOpen && <Market onClose={() => setMarketOpen(false)} />}
      {/* Mobile: fixed bottom bar  |  Desktop: absolute centered pill */}
      <div className="
        fixed bottom-0 left-0 right-0 z-20
        flex flex-wrap items-center justify-center gap-2 px-3 py-3
        bg-black/40 backdrop-blur-md border-t border-white/15
        md:absolute md:bottom-6 md:left-1/2 md:right-auto md:-translate-x-1/2 md:z-10
        md:gap-3 md:px-6 md:py-4 md:rounded-2xl md:bg-black/25 md:border md:border-white/15 md:shadow-2xl
      ">

        {/* Active patch indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-white/70 text-xs font-semibold select-none">
          <span>🌱</span>
          <span>{patchLabel}</span>
        </div>

        {/* Divider — desktop only */}
        <div className="hidden md:block w-px h-7 bg-white/20" />

        {/* Crop selector + plant — only when patch is empty */}
        {cropState === 'empty' && (
          <div className="flex items-center gap-2">
            {/* Crop toggle */}
            <div className="flex rounded-xl border border-white/15 overflow-hidden">
              {(['carrot', 'wheat'] as CropType[]).map((type) => {
                const meta = CROP_META[type];
                const active = selectedCrop === type;
                const seeds = seedCount[type];
                return (
                  <button
                    key={type}
                    onClick={() => selectCrop(type)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold transition-all duration-150 select-none
                      ${active
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/75'
                      }`}
                  >
                    <span>{meta.icon}</span>
                    <span>{meta.label}</span>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ml-0.5
                      ${seeds > 0 ? 'bg-green-500/30 text-green-300' : 'bg-white/10 text-white/30'}`}>
                      {seeds}
                    </span>
                  </button>
                );
              })}
            </div>
            <ActionButton
              onClick={plantCrop}
              disabled={!canPlant}
              icon="🌱"
              label={canPlant ? `Plant ${CROP_META[selectedCrop].label}` : 'No seeds — buy in Market'}
              variant="green"
            />
          </div>
        )}

        {cropState === 'planted' && (
          <ActionButton onClick={waterCrop} icon="💧" label="Water Crop" variant="blue" />
        )}
        {cropState === 'watered' && (
          <ActionButton disabled icon="⏳" label="Growing… wait for it" variant="ghost" />
        )}
        {cropState === 'ready' && (
          <ActionButton
            onClick={harvestCrop}
            icon={harvestMeta.icon}
            label={`Harvest ${harvestMeta.label}  ${harvestMeta.rewardLabel}`}
            variant="orange"
          />
        )}

        {/* Divider — desktop only */}
        <div className="hidden md:block w-px h-7 bg-white/20" />

        <ActionButton
          onClick={feedPuppy}
          disabled={carrots < 1}
          icon="🦴"
          label={carrots > 0 ? `Feed Biscuit  (${carrots} 🥕)  +2🪙` : 'Need carrots first'}
          variant="pink"
        />

        <ActionButton
          onClick={feedChicken}
          disabled={wheat < 1}
          icon="🌾"
          label={wheat > 0 ? `Feed Clover  (${wheat} 🌾)  +1🥚 +3🪙` : 'Need wheat first'}
          variant="orange"
        />

        {/* Divider — desktop only */}
        <div className="hidden md:block w-px h-7 bg-white/20" />

        <ActionButton onClick={() => setMarketOpen(true)} icon="🏪" label="Market" variant="ghost" />
        <ActionButton onClick={() => setShopOpen(true)} icon="🛒" label="Shop" variant="ghost" />
      </div>
    </>
  );
};
