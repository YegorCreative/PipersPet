import { useFarmStore } from '../game/useFarmStore';

export const Chicken = () => {
  const happiness       = useFarmStore((s) => s.chickenHappiness);
  const fedRecently     = useFarmStore((s) => s.chickenFedRecently);
  const eggs            = useFarmStore((s) => s.eggs);

  const mood: 'happy' | 'neutral' | 'sad' =
    happiness >= 65 ? 'happy' : happiness >= 35 ? 'neutral' : 'sad';

  const moodEmoji = { happy: '😄', neutral: '🙂', sad: '😢' }[mood];
  const chickenEmoji = fedRecently ? '🐔' : '🐓';

  const barColor = {
    happy:   'linear-gradient(90deg, #fbbf24, #f59e0b)',
    neutral: 'linear-gradient(90deg, #f97316, #fb923c)',
    sad:     'linear-gradient(90deg, #6b7280, #9ca3af)',
  }[mood];

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">
        Clover
      </p>

      {/* Chicken coop pen */}
      <div className="relative w-36 h-36 rounded-2xl border-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center gap-1 overflow-hidden"
        style={{
          background: 'rgba(180,120,50,0.35)',
          borderColor: 'rgba(200,150,60,0.55)',
        }}
      >
        {/* Straw floor */}
        <div className="absolute inset-0 opacity-20 pointer-events-none flex flex-col justify-end gap-0.5 pb-2 px-2">
          <div className="w-full h-1 bg-yellow-400 rounded" />
          <div className="w-4/5 h-1 bg-yellow-300 rounded ml-1" />
          <div className="w-full h-1 bg-yellow-400 rounded" />
        </div>

        {/* Roof-like top trim */}
        <div className="absolute top-0 left-0 right-0 h-3 flex">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex-1 h-full"
              style={{ background: i % 2 === 0 ? 'rgba(160,100,40,0.5)' : 'rgba(200,140,60,0.5)' }}
            />
          ))}
        </div>

        <div
          className={`text-5xl z-10 ${
            fedRecently ? 'animate-happy-bounce' : 'animate-idle-bounce'
          }`}
        >
          {chickenEmoji}
        </div>
        <span className="text-xl z-10">{moodEmoji}</span>
      </div>

      {/* Happiness bar */}
      <div className="w-36 flex flex-col gap-1">
        <div className="flex justify-between text-xs text-white/55">
          <span>Happiness</span>
          <span>{Math.round(happiness)}%</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden border border-white/10">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${happiness}%`, background: barColor }}
          />
        </div>
      </div>

      {/* Egg count */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-yellow-400/10 border border-yellow-400/20">
        <span className="text-sm">🥚</span>
        <span className="text-yellow-200 font-semibold text-sm">{eggs} egg{eggs !== 1 ? 's' : ''}</span>
      </div>

      {fedRecently && (
        <p className="text-yellow-300 text-sm font-semibold">🌾 Cluck cluck!</p>
      )}
    </div>
  );
};
