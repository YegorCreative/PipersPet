import { useFarmStore } from '../game/useFarmStore';

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

const ActionButton = ({ onClick, disabled, icon, label, variant }: BtnProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      flex items-center gap-2 px-4 py-2.5 rounded-xl border text-white font-semibold text-sm
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
  const cropState  = useFarmStore((s) => s.cropState);
  const carrots    = useFarmStore((s) => s.carrots);
  const plantCarrot = useFarmStore((s) => s.plantCarrot);
  const waterCrop   = useFarmStore((s) => s.waterCrop);
  const harvestCrop = useFarmStore((s) => s.harvestCrop);
  const feedPuppy   = useFarmStore((s) => s.feedPuppy);

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-wrap items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-black/25 backdrop-blur-md border border-white/15 shadow-2xl">
      {cropState === 'empty' && (
        <ActionButton onClick={plantCarrot} icon="🌱" label="Plant Carrot" variant="green" />
      )}
      {cropState === 'planted' && (
        <ActionButton onClick={waterCrop} icon="💧" label="Water Crop" variant="blue" />
      )}
      {cropState === 'watered' && (
        <ActionButton disabled icon="⏳" label="Growing… wait for it" variant="ghost" />
      )}
      {cropState === 'ready' && (
        <ActionButton onClick={harvestCrop} icon="🥕" label="Harvest Carrots  +5🪙 +3🥕" variant="orange" />
      )}

      <div className="w-px h-7 bg-white/20" />

      <ActionButton
        onClick={feedPuppy}
        disabled={carrots < 1}
        icon="🦴"
        label={carrots > 0 ? `Feed Biscuit  (${carrots} 🥕)  +2🪙` : 'Need carrots first'}
        variant="pink"
      />
    </div>
  );
};
