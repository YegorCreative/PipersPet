import { useFarmStore } from '../game/useFarmStore';

const GoalRow = ({ done, icon, label }: { done: boolean; icon: string; label: string }) => (
  <div className="flex items-center gap-2.5">
    <div
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-400
        ${done ? 'bg-green-400 border-green-400 scale-110' : 'border-white/35 bg-white/5'}`}
    >
      {done && (
        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
    <span className={`text-sm font-medium transition-all duration-300 ${done ? 'line-through text-white/35' : 'text-white/85'}`}>
      <span className="mr-1">{icon}</span>
      {label}
    </span>
  </div>
);

export const DailyGoals = () => {
  const day          = useFarmStore((s) => s.day);
  const goalPlanted  = useFarmStore((s) => s.goalPlanted);
  const goalHarvested = useFarmStore((s) => s.goalHarvested);
  const goalFed      = useFarmStore((s) => s.goalFed);
  const dayComplete  = useFarmStore((s) => s.dayComplete);
  const startNextDay = useFarmStore((s) => s.startNextDay);

  const completed = [goalPlanted, goalHarvested, goalFed].filter(Boolean).length;

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-52">
      <div
        className={`rounded-2xl border backdrop-blur-md shadow-xl p-4 flex flex-col gap-3 transition-colors duration-500
          ${dayComplete
            ? 'bg-amber-500/20 border-amber-300/40'
            : 'bg-black/30 border-white/15'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-white/55 text-xs font-semibold uppercase tracking-widest">
            Daily Goals
          </span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(251,191,36,0.2)',
              color: '#fde68a',
              border: '1px solid rgba(251,191,36,0.3)',
            }}
          >
            Day {day}
          </span>
        </div>

        {/* Goals list */}
        <div className="flex flex-col gap-2">
          <GoalRow done={goalPlanted}   icon="🌱" label="Plant 1 carrot"  />
          <GoalRow done={goalHarvested} icon="🥕" label="Harvest 1 crop"  />
          <GoalRow done={goalFed}       icon="🦴" label="Feed Biscuit"     />
        </div>

        {/* Progress bar (3 segments) */}
        {!dayComplete && (
          <div className="flex gap-1.5 pt-0.5">
            {[goalPlanted, goalHarvested, goalFed].map((done, i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full transition-all duration-500
                  ${done ? 'bg-green-400' : 'bg-white/15'}`}
              />
            ))}
          </div>
        )}

        {/* Counter when not complete */}
        {!dayComplete && (
          <p className="text-white/40 text-xs text-center">
            {completed} / 3 complete
          </p>
        )}

        {/* Day complete state */}
        {dayComplete && (
          <div className="flex flex-col gap-2.5 border-t border-amber-300/25 pt-3">
            <div className="text-center flex flex-col gap-0.5">
              <p
                className="text-amber-200 font-bold text-base"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                🎉 Day Complete!
              </p>
              <p className="text-amber-100/60 text-xs">Bonus earned: +25 🪙</p>
            </div>
            <button
              onClick={startNextDay}
              className="w-full py-2 rounded-xl font-bold text-sm transition-all duration-150 active:scale-95 shadow-md"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#1c1008',
              }}
            >
              Start Day {day + 1} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
