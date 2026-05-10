import { useFarmStore } from '../game/useFarmStore';

export const Puppy = () => {
  const happiness = useFarmStore((s) => s.puppyHappiness);
  const fedRecently = useFarmStore((s) => s.puppyFedRecently);

  const mood: 'happy' | 'neutral' | 'sad' =
    happiness >= 65 ? 'happy' : happiness >= 35 ? 'neutral' : 'sad';

  const moodEmoji = { happy: '😄', neutral: '🙂', sad: '😢' }[mood];
  const dogEmoji = fedRecently ? '🐕' : '🐶';

  const barColor = {
    happy: 'linear-gradient(90deg, #f43f5e, #fb7185)',
    neutral: 'linear-gradient(90deg, #f97316, #fb923c)',
    sad: 'linear-gradient(90deg, #6b7280, #9ca3af)',
  }[mood];

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">
        Biscuit
      </p>

      {/* Puppy pen */}
      <div className="relative w-36 h-36 rounded-2xl bg-green-500/40 border-4 border-amber-400/50 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center gap-1 overflow-hidden">
        {/* Fence posts */}
        <div className="absolute -top-1 left-0 right-0 flex justify-around px-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-4 rounded-t-sm"
              style={{ background: 'rgba(180,120,60,0.7)' }}
            />
          ))}
        </div>

        <div
          className={`text-6xl ${
            fedRecently ? 'animate-happy-bounce' : 'animate-idle-bounce'
          }`}
        >
          {dogEmoji}
        </div>
        <span className="text-xl">{moodEmoji}</span>
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

      {fedRecently && (
        <p className="text-pink-300 text-sm font-semibold">❤️ Nom nom nom!</p>
      )}
    </div>
  );
};
