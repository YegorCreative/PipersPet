import { HUD } from './HUD';
import { CropPatch } from './CropPatch';
import { Puppy } from './Puppy';
import { ActionBar } from './ActionBar';
import { DailyGoals } from './DailyGoals';

export const FarmGame = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden select-none">
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-200 to-blue-100" />

      {/* Sun */}
      <div
        className="absolute top-6 right-14 w-20 h-20 rounded-full"
        style={{
          background: 'radial-gradient(circle, #fef08a 40%, #fde047 100%)',
          boxShadow: '0 0 60px 20px rgba(253,224,71,0.35)',
        }}
      />

      {/* Clouds */}
      <div className="absolute top-10 left-16 w-28 h-9 bg-white/65 rounded-full" style={{ filter: 'blur(4px)' }} />
      <div className="absolute top-8 left-24 w-20 h-7 bg-white/55 rounded-full" style={{ filter: 'blur(3px)' }} />
      <div className="absolute top-16 right-36 w-24 h-7 bg-white/50 rounded-full" style={{ filter: 'blur(4px)' }} />

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-[42%] bg-green-700" />
      {/* Grass top edge highlight */}
      <div
        className="absolute left-0 right-0 h-5 bg-green-500"
        style={{ bottom: 'calc(42% - 2px)' }}
      />

      {/* HUD */}
      <HUD />

      {/* Daily goals panel */}
      <DailyGoals />

      {/* Farm scene — crop + puppy */}
      <div
        className="absolute inset-0 flex items-center justify-center gap-14"
        style={{ paddingTop: 80, paddingBottom: 110 }}
      >
        <CropPatch />
        <Puppy />
      </div>

      {/* Action bar */}
      <ActionBar />
    </div>
  );
};
