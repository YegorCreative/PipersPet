import { useFarmStore } from '../game/useFarmStore';

export const HUD = () => {
  const coins            = useFarmStore((s) => s.coins);
  const carrots          = useFarmStore((s) => s.carrots);
  const wheat            = useFarmStore((s) => s.wheat);
  const eggs             = useFarmStore((s) => s.eggs);
  const carrotSeeds      = useFarmStore((s) => s.carrotSeeds);
  const wheatSeeds       = useFarmStore((s) => s.wheatSeeds);
  const puppyHappiness   = useFarmStore((s) => s.puppyHappiness);
  const chickenHappiness = useFarmStore((s) => s.chickenHappiness);
  const day              = useFarmStore((s) => s.day);

  const puppyColor   = puppyHappiness   >= 60 ? '#f43f5e' : puppyHappiness   >= 30 ? '#fb923c' : '#6b7280';
  const chickenColor = chickenHappiness >= 60 ? '#fbbf24' : chickenHappiness >= 30 ? '#fb923c' : '#6b7280';

  return (
    <div className="
      sticky top-0 z-20 w-full flex flex-wrap items-center gap-x-3 gap-y-1.5 px-3 py-2.5
      bg-black/35 backdrop-blur-md border-b border-white/15 select-none
      md:absolute md:top-4 md:left-1/2 md:-translate-x-1/2 md:z-10 md:w-auto
      md:flex-nowrap md:gap-4 md:px-6 md:py-3
      md:rounded-2xl md:bg-white/15 md:border md:border-white/25 md:shadow-xl
    ">
      {/* Title — desktop only */}
      <span className="hidden md:block font-bold text-white text-base tracking-wide" style={{ fontFamily: 'Outfit, sans-serif' }}>
        🌾 Piper's Farm
      </span>

      <span
        className="text-xs font-bold px-2.5 py-0.5 rounded-full"
        style={{ background: 'rgba(251,191,36,0.2)', color: '#fde68a', border: '1px solid rgba(251,191,36,0.3)' }}
      >
        Day {day}
      </span>

      {/* Divider — desktop only */}
      <div className="hidden md:block w-px h-5 bg-white/30" />

      <div className="flex items-center gap-1.5 text-amber-200 font-semibold text-sm">
        <span>🪙</span><span>{coins}</span>
      </div>
      <div className="flex items-center gap-1.5 text-orange-200 font-semibold text-sm">
        <span>🥕</span><span>{carrots}</span>
      </div>
      <div className="flex items-center gap-1.5 text-yellow-200 font-semibold text-sm">
        <span>🌾</span><span>{wheat}</span>
      </div>
      <div className="flex items-center gap-1.5 text-yellow-100 font-semibold text-sm">
        <span>🥚</span><span>{eggs}</span>
      </div>

      {/* Divider — desktop only */}
      <div className="hidden md:block w-px h-5 bg-white/30" />

      {/* Seeds */}
      <div className="flex items-center gap-1 text-white/50 font-semibold text-xs" title="Carrot seeds">
        <span>🥕</span><span className="text-white/70">{carrotSeeds}</span><span className="text-white/30 text-[10px]">🌱</span>
      </div>
      <div className="flex items-center gap-1 text-white/50 font-semibold text-xs" title="Wheat seeds">
        <span>🌾</span><span className="text-white/70">{wheatSeeds}</span><span className="text-white/30 text-[10px]">🌱</span>
      </div>

      {/* Divider — desktop only */}
      <div className="hidden md:block w-px h-5 bg-white/30" />

      {/* Biscuit happiness */}
      <div className="flex items-center gap-1.5">
        <span className="text-sm">🐶</span>
        <div className="w-14 h-2.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${puppyHappiness}%`, background: puppyColor }}
          />
        </div>
        <span className="text-white/60 text-xs">{Math.round(puppyHappiness)}%</span>
      </div>

      {/* Clover happiness */}
      <div className="flex items-center gap-1.5">
        <span className="text-sm">🐔</span>
        <div className="w-14 h-2.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${chickenHappiness}%`, background: chickenColor }}
          />
        </div>
        <span className="text-white/60 text-xs">{Math.round(chickenHappiness)}%</span>
      </div>
    </div>
  );
};
