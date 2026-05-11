import { useFarmStore } from '../game/useFarmStore';

export const HUD = () => {
  const coins     = useFarmStore((s) => s.coins);
  const carrots   = useFarmStore((s) => s.carrots);
  const wheat     = useFarmStore((s) => s.wheat);
  const happiness = useFarmStore((s) => s.puppyHappiness);
  const day       = useFarmStore((s) => s.day);

  const happinessColor =
    happiness >= 60 ? '#f43f5e' : happiness >= 30 ? '#fb923c' : '#6b7280';

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-5 px-6 py-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 shadow-xl">
      <span className="font-bold text-white text-base tracking-wide" style={{ fontFamily: 'Outfit, sans-serif' }}>
        🌾 Piper's Farm
      </span>

      <span
        className="text-xs font-bold px-2.5 py-0.5 rounded-full"
        style={{ background: 'rgba(251,191,36,0.2)', color: '#fde68a', border: '1px solid rgba(251,191,36,0.3)' }}
      >
        Day {day}
      </span>

      <div className="w-px h-5 bg-white/30" />

      <div className="flex items-center gap-1.5 text-amber-200 font-semibold text-sm">
        <span>🪙</span>
        <span>{coins}</span>
      </div>

      <div className="flex items-center gap-1.5 text-orange-200 font-semibold text-sm">
        <span>🥕</span>
        <span>{carrots}</span>
      </div>

      <div className="flex items-center gap-1.5 text-yellow-200 font-semibold text-sm">
        <span>🌾</span>
        <span>{wheat}</span>
      </div>

      <div className="w-px h-5 bg-white/30" />

      <div className="flex items-center gap-2">
        <span className="text-sm">❤️</span>
        <div className="w-20 h-2.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${happiness}%`, background: happinessColor }}
          />
        </div>
        <span className="text-white/70 text-xs">{Math.round(happiness)}%</span>
      </div>
    </div>
  );
};
