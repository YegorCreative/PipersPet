import { useFarmStore } from '../game/useFarmStore';

interface MarketProps {
  onClose: () => void;
}

interface SellRowProps {
  emoji: string;
  name: string;
  count: number;
  coinsPer: number;
  onSell: () => void;
}

const SellRow = ({ emoji, name, count, coinsPer, onSell }: SellRowProps) => {
  const canSell = count > 0;
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-white/10 bg-white/5">
      {/* Item info */}
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="text-2xl">{emoji}</span>
        <div className="flex flex-col">
          <span className="text-white font-semibold text-sm">{name}</span>
          <span className="text-white/40 text-xs">
            {count} in stock · {coinsPer}🪙 each
          </span>
        </div>
      </div>

      {/* Sell 1 button */}
      <button
        onClick={onSell}
        disabled={!canSell}
        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-semibold text-xs transition-all duration-150 select-none
          ${canSell
            ? 'bg-emerald-500 hover:bg-emerald-400 border-emerald-400/60 text-white shadow-md cursor-pointer active:scale-95'
            : 'bg-white/5 border-white/10 text-white/25 cursor-not-allowed'
          }`}
      >
        Sell 1 · +{coinsPer}🪙
      </button>
    </div>
  );
};

export const Market = ({ onClose }: MarketProps) => {
  const coins      = useFarmStore((s) => s.coins);
  const carrots    = useFarmStore((s) => s.carrots);
  const wheat      = useFarmStore((s) => s.wheat);
  const eggs       = useFarmStore((s) => s.eggs);
  const sellCarrot = useFarmStore((s) => s.sellCarrot);
  const sellWheat  = useFarmStore((s) => s.sellWheat);
  const sellEgg    = useFarmStore((s) => s.sellEgg);
  const sellAll    = useFarmStore((s) => s.sellAll);

  const totalValue = carrots * 2 + wheat * 4 + eggs * 8;
  const hasAnything = totalValue > 0;

  return (
    /* Backdrop */
    <div
      className="absolute inset-0 z-20 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative w-88 rounded-3xl border border-white/20 shadow-2xl p-6 flex flex-col gap-5"
        style={{
          width: '22rem',
          background: 'linear-gradient(160deg, #14261a, #0a1a10)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2
            className="text-white font-bold text-xl"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            🏪 Farm Market
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
            Wallet: <span className="text-amber-100 font-bold">{coins} coins</span>
          </span>
        </div>

        {/* Sell rows */}
        <div className="flex flex-col gap-2.5">
          <SellRow emoji="🥕" name="Carrot"  count={carrots} coinsPer={2} onSell={sellCarrot} />
          <SellRow emoji="🌾" name="Wheat"   count={wheat}   coinsPer={4} onSell={sellWheat}  />
          <SellRow emoji="🥚" name="Egg"     count={eggs}    coinsPer={8} onSell={sellEgg}    />
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {/* Sell All */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-white font-semibold text-sm">Sell All Produce</span>
            <span className="text-white/40 text-xs">
              {hasAnything ? `Earn +${totalValue} 🪙 total` : 'Nothing to sell'}
            </span>
          </div>
          <button
            onClick={sellAll}
            disabled={!hasAnything}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl border font-bold text-sm transition-all duration-150 select-none
              ${hasAnything
                ? 'bg-amber-500 hover:bg-amber-400 border-amber-400/60 text-white shadow-md cursor-pointer active:scale-95'
                : 'bg-white/5 border-white/10 text-white/25 cursor-not-allowed'
              }`}
          >
            Sell All · +{totalValue}🪙
          </button>
        </div>

        <p className="text-white/20 text-xs text-center">Prices are fixed · Buy seeds coming soon…</p>
      </div>
    </div>
  );
};
