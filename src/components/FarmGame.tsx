import { HUD } from './HUD';
import { CropPatch } from './CropPatch';
import { Puppy } from './Puppy';
import { Chicken } from './Chicken';
import { ActionBar } from './ActionBar';
import { DailyGoals } from './DailyGoals';

export const FarmGame = () => {
  return (
    /* Mobile: min-h-screen scrollable column  |  Desktop: h-screen fixed */
    <div className="relative w-full select-none overflow-x-hidden min-h-screen md:h-screen md:overflow-hidden">

      {/* Sky — fixed so it covers viewport during mobile scroll too */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-sky-400 via-sky-200 to-blue-100" />

      {/* Sun — smaller on mobile */}
      <div
        className="fixed top-5 right-5 md:top-6 md:right-14 w-14 h-14 md:w-20 md:h-20 -z-10 rounded-full"
        style={{
          background: 'radial-gradient(circle, #fef08a 40%, #fde047 100%)',
          boxShadow: '0 0 60px 20px rgba(253,224,71,0.35)',
        }}
      />

      {/* Clouds — hidden on mobile to reduce visual noise */}
      <div className="hidden md:block fixed top-10 left-16 w-28 h-9 bg-white/65 rounded-full -z-10" style={{ filter: 'blur(4px)' }} />
      <div className="hidden md:block fixed top-8 left-24 w-20 h-7 bg-white/55 rounded-full -z-10" style={{ filter: 'blur(3px)' }} />
      <div className="hidden md:block fixed top-16 right-36 w-24 h-7 bg-white/50 rounded-full -z-10" style={{ filter: 'blur(4px)' }} />

      {/* Ground */}
      <div className="fixed bottom-0 left-0 right-0 h-[42%] bg-green-700 -z-10" />
      <div
        className="fixed left-0 right-0 h-5 bg-green-500 -z-10"
        style={{ bottom: 'calc(42% - 2px)' }}
      />

      {/* HUD — sticky on mobile, absolute on desktop */}
      <HUD />

      {/* ── Mobile layout (< 768px): scrollable vertical column ────────────── */}
      <div className="md:hidden flex flex-col items-center gap-5 px-3 pt-[76px] pb-[260px]">
        {/* Daily goals inline on mobile */}
        <DailyGoals inline />
        <Puppy />
        {/* Two crop patches side-by-side on mobile */}
        <div className="flex gap-3 justify-center w-full">
          <CropPatch patchIndex={0} />
          <CropPatch patchIndex={1} />
        </div>
        <Chicken />
      </div>

      {/* ── Desktop layout (≥ 768px): absolute centered horizontal row ─────── */}
      <div
        className="hidden md:flex md:absolute md:inset-0 md:items-center md:justify-center md:gap-6"
        style={{ paddingTop: 80, paddingBottom: 110 }}
      >
        <Puppy />
        <CropPatch patchIndex={0} />
        <CropPatch patchIndex={1} />
        <Chicken />
      </div>

      {/* DailyGoals — desktop only (absolute left panel) */}
      <div className="hidden md:block">
        <DailyGoals />
      </div>

      {/* Action bar */}
      <ActionBar />
    </div>
  );
};
