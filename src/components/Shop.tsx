import { useFarmStore } from '../game/useFarmStore';

interface ShopProps {
  onClose: () => void;
}

export const Shop = ({ onClose }: ShopProps) => {
  const coins         = useFarmStore((s) => s.coins);
  const hasWateringCan = useFarmStore((s) => s.hasWateringCan);
  const buyWateringCan = useFarmStore((s) => s.buyWateringCan);

  const canAfford = coins >= 50;

  return (
    /* Backdrop */
    <div
      className="absolute inset-0 z-20 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative w-80 rounded-3xl border border-white/20 shadow-2xl p-6 flex flex-col gap-5"
        style={{ background: 'linear-gradient(160deg, #1e293b, #0f172a)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2
            className="text-white font-bold text-xl"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            🛒 Farm Shop
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 font-bold transition-colors flex items-center justify-center text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Coin balance */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-400/10 border border-amber-400/20">
          <span className="text-lg">🪙</span>
          <span className="text-amber-200 font-semibold text-sm">
            Your coins: <span className="text-amber-100 font-bold">{coins}</span>
          </span>
        </div>

        {/* Upgrade card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-white font-semibold text-base" style={{ fontFamily: 'Outfit, sans-serif' }}>
                💧 Better Watering Can
              </span>
              <span className="text-white/50 text-xs leading-relaxed">
                Crops grow in <span className="text-green-300 font-semibold">20 seconds</span> instead of 30.
              </span>
            </div>
            <span
              className="flex-shrink-0 text-sm font-bold px-2.5 py-1 rounded-xl"
              style={{
                background: 'rgba(251,191,36,0.15)',
                color: '#fde68a',
                border: '1px solid rgba(251,191,36,0.3)',
              }}
            >
              50 🪙
            </span>
          </div>

          {hasWateringCan ? (
            <div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-green-500/15 border border-green-400/25">
              <span className="text-green-400 text-base">✓</span>
              <span className="text-green-300 font-semibold text-sm">Owned — crops grow 33% faster!</span>
            </div>
          ) : (
            <button
              onClick={buyWateringCan}
              disabled={!canAfford}
              className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all duration-150 border
                ${canAfford
                  ? 'bg-sky-500 hover:bg-sky-400 border-sky-400/50 text-white active:scale-95 shadow-md cursor-pointer'
                  : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                }`}
            >
              {canAfford ? 'Buy for 50 🪙' : `Need ${50 - coins} more 🪙`}
            </button>
          )}
        </div>

        <p className="text-white/25 text-xs text-center">More upgrades coming soon…</p>
      </div>
    </div>
  );
};
