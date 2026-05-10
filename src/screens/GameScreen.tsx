import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../game/systems/useGameStore';
import { Key } from 'lucide-react';
import {
  Tree, Bush, Rock, Flower, Fence, Ruin, River, Stone,
  Hill, FogZone, WindingPath, TreatAltar, CampFire, AmbientParticles
} from '../components/MapElements';

const getDist = (a: {x:number,y:number}, b: {x:number,y:number}) =>
  Math.sqrt((a.x-b.x)**2 + (a.y-b.y)**2);

// Map is 300% × 300% of viewport. All entity coords are % of this large map.
const MAP_W = 300; // vw
const MAP_H = 300; // vh

export const GameScreen: React.FC = () => {
  const {
    currentMission, playerPosition, puppyPosition, treatPosition, hasTreat,
    missionComplete, flowerPositions, movePlayer, movePuppy, collectTreat, feedPuppy, collectFlower,
    toyPosition, hasToy, collectToy, setCommand, activeCommand,
    keyPosition, keyVisible, hasKey, gatePosition, gateUnlocked, exitPosition,
    revealKey, collectKey, unlockGate, completeMission4,
  } = useGameStore();

  const [keys, setKeys] = useState<Record<string, boolean>>({});
  const keysRef = useRef(keys);
  keysRef.current = keys;

  // ── Keyboard listeners ────────────────────────────────────────────────────
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      setKeys(k => ({ ...k, [e.key]: true }));
      if (e.key === '1') setCommand('follow');
      if (e.key === '2') setCommand('stay');
      if (e.key === '3') setCommand('search');
      if (e.key === '4') setCommand('fetch');
    };
    const up = (e: KeyboardEvent) => setKeys(k => ({ ...k, [e.key]: false }));
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [setCommand]);

  // ── Game loop ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const SPEED = 0.35;
    const id = setInterval(() => {
      const k = keysRef.current;
      let dx = 0, dy = 0;
      if (k['w'] || k['W'] || k['ArrowUp'])    dy -= SPEED;
      if (k['s'] || k['S'] || k['ArrowDown'])   dy += SPEED;
      if (k['a'] || k['A'] || k['ArrowLeft'])   dx -= SPEED;
      if (k['d'] || k['D'] || k['ArrowRight'])  dx += SPEED;
      if (dx || dy) movePlayer(dx, dy);

      const st = useGameStore.getState();
      if (st.activeCommand === 'follow') {
        const dist = getDist(st.puppyPosition, st.playerPosition);
        if (dist > 8) {
          const ang = Math.atan2(st.playerPosition.y - st.puppyPosition.y, st.playerPosition.x - st.puppyPosition.x);
          movePuppy(Math.cos(ang) * SPEED * 0.75, Math.sin(ang) * SPEED * 0.75);
        }
      } else if (st.activeCommand === 'search' && st.currentMission === 4 && !st.hasKey) {
        const dist = getDist(st.puppyPosition, st.keyPosition);
        if (dist > 2) {
          const ang = Math.atan2(st.keyPosition.y - st.puppyPosition.y, st.keyPosition.x - st.puppyPosition.x);
          movePuppy(Math.cos(ang) * SPEED * 0.55, Math.sin(ang) * SPEED * 0.55);
        }
      }
    }, 16);
    return () => clearInterval(id);
  }, [movePlayer, movePuppy]);

  // ── Collision / pick-up checks ────────────────────────────────────────────
  useEffect(() => {
    if (currentMission === 1) {
      if (!hasTreat && getDist(playerPosition, treatPosition) < 4) collectTreat();
      if ((keys['e'] || keys['E']) && hasTreat && !missionComplete && getDist(playerPosition, puppyPosition) < 8)
        feedPuppy();
    }
    if (currentMission === 2) {
      flowerPositions.forEach((f, i) => {
        if (!f.collected && getDist(playerPosition, f.pos) < 4) collectFlower(i);
      });
    }
    if (currentMission === 3 && !hasToy && getDist(playerPosition, toyPosition) < 4) collectToy();
    if (currentMission === 4) {
      if (activeCommand === 'search' && !keyVisible && getDist(puppyPosition, keyPosition) < 4) revealKey();
      if (keyVisible && !hasKey && getDist(playerPosition, keyPosition) < 4) collectKey();
      if (hasKey && !gateUnlocked && getDist(playerPosition, gatePosition) < 8) unlockGate();
      if (gateUnlocked && getDist(playerPosition, exitPosition) < 8) completeMission4();
    }
  }, [
    currentMission, playerPosition, puppyPosition, treatPosition, hasTreat, missionComplete,
    flowerPositions, keys, activeCommand, keyVisible, hasKey, gateUnlocked,
    collectTreat, feedPuppy, collectFlower, toyPosition, hasToy, collectToy,
    revealKey, collectKey, unlockGate, completeMission4, keyPosition, gatePosition, exitPosition,
  ]);

  // ── Camera: keep player centered ──────────────────────────────────────────
  // player.x/y are % of the 300vw×300vh map.
  const camX = -(playerPosition.x / 100 * MAP_W - 50);   // vw units
  const camY = -(playerPosition.y / 100 * MAP_H - 50);   // vh units

  // Helper: place entity on map using % of MAP dimensions
  const pos = (x: number, y: number): React.CSSProperties => ({
    left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)',
  });

  return (
    <div className="w-full h-full bg-slate-950 relative overflow-hidden font-sans">

      {/* ── Map container (moves with camera) ─────────────────────────── */}
      <div
        className="absolute"
        style={{
          width: `${MAP_W}vw`, height: `${MAP_H}vh`,
          transform: `translate(${camX}vw, ${camY}vh)`,
          transition: 'transform 0.05s linear',
          backgroundColor: '#052e16', // emerald-950
        }}
      >
        {/* Ground texture (subtle) */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage:'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize:'40px 40px' }} />

        {/* ─── PATHS ───────────────────────────────────────────────────── */}
        <WindingPath />

        {/* ─── ZONE 1: SAFE STARTING CAMP (y ~80-95) ───────────────────── */}
        <CampFire left="50%" top="88%" />
        <TreatAltar left="35%" top="78%" />
        {/* Camp fences */}
        <Fence left="38%" top="91%" rotate={0}  length={120} />
        <Fence left="62%" top="91%" rotate={0}  length={120} />
        <Fence left="34%" top="86%" rotate={90} length={80}  />
        <Fence left="66%" top="86%" rotate={90} length={80}  />
        {/* Camp trees */}
        <Tree left="30%" top="93%" scale={1.1} variant={1} />
        <Tree left="70%" top="93%" scale={1.2} variant={1} />
        <Tree left="28%" top="89%" scale={0.9} variant={2} />
        <Tree left="72%" top="89%" scale={1.0} variant={2} />
        {/* Decorative rocks near camp */}
        <Rock left="42%" top="92%" scale={0.8} />
        <Rock left="58%" top="92%" scale={1.0} />

        {/* ─── ZONE 2: FOREST TRAIL (y ~65-80) ─────────────────────────── */}
        {/* Dense tree walls channelling player north along narrow path */}
        <Tree left="30%" top="78%" scale={1.3} variant={2} />
        <Tree left="25%" top="74%" scale={1.1} variant={3} />
        <Tree left="22%" top="70%" scale={1.2} variant={2} />
        <Tree left="26%" top="66%" scale={1.0} variant={1} />
        <Tree left="70%" top="78%" scale={1.2} variant={2} />
        <Tree left="74%" top="74%" scale={1.3} variant={3} />
        <Tree left="72%" top="70%" scale={1.0} variant={1} />
        <Tree left="75%" top="66%" scale={1.2} variant={2} />
        <Bush left="33%" top="75%" scale={1.1} />
        <Bush left="67%" top="75%" scale={1.0} />
        <Bush left="35%" top="69%" scale={0.9} />
        <Bush left="65%" top="69%" scale={1.1} />
        <Rock left="46%" top="72%" scale={0.7} />
        <Rock left="54%" top="75%" scale={0.9} />

        {/* ─── ZONE 3: RIVER CROSSING (y ~61-67) ───────────────────────── */}
        <River top="61%" />
        {/* Stepping stones */}
        <Stone left="44%" top="64%" />
        <Stone left="50%" top="64%" />
        <Stone left="56%" top="64%" />
        {/* Trees crowding river banks */}
        <Tree left="18%" top="63%" scale={1.2} variant={3} />
        <Tree left="12%" top="61%" scale={1.1} variant={2} />
        <Tree left="82%" top="63%" scale={1.3} variant={3} />
        <Tree left="88%" top="61%" scale={1.0} variant={2} />
        <Bush left="38%" top="59%" scale={1.2} />
        <Bush left="62%" top="59%" scale={1.1} />

        {/* ─── ZONE 4: HIDDEN EASTERN GLADE (y ~52-60, x ~65-82) ──────── */}
        {/* Hidden by trees on the main path; accessible via east branch */}
        <FogZone left="73%" top="58%" w="30%" h="18%" color="rgba(6,182,212,0.07)" />
        <Flower left="72%" top="62%" color="bg-pink-500" />
        <Flower left="78%" top="57%" color="bg-purple-400" />
        <Flower left="68%" top="55%" color="bg-rose-400" />
        {/* Mission 2 flower pickups rendered via state below */}
        <Tree left="83%" top="53%" scale={1.1} variant={2} />
        <Tree left="87%" top="57%" scale={1.2} variant={3} />
        <Tree left="85%" top="63%" scale={1.0} variant={1} />
        <Bush left="80%" top="50%" scale={0.9} />
        <Bush left="64%" top="50%" scale={1.0} />

        {/* ─── ZONE 5: OLD BROKEN RUINS (y ~42-55, x ~12-33) ──────────── */}
        <FogZone left="22%" top="48%" w="28%" h="22%" color="rgba(100,116,139,0.08)" />
        <Ruin left="16%" top="53%" h={75} broken />
        <Ruin left="23%" top="50%" h={55} broken />
        <Ruin left="30%" top="55%" h={65} broken />
        <Ruin left="20%" top="44%" h={40} broken />
        <Rock left="13%" top="50%" scale={1.3} />
        <Rock left="28%" top="46%" scale={1.0} />
        <Rock left="19%" top="55%" scale={0.8} />
        <Flower left="17%" top="47%" color="bg-cyan-600" />
        <Flower left="26%" top="52%" color="bg-slate-400" />
        {/* Framing trees */}
        <Tree left="10%" top="55%" scale={1.2} variant={3} />
        <Tree left="8%"  top="48%" scale={1.3} variant={2} />
        <Tree left="35%" top="45%" scale={1.0} variant={1} />
        <Bush left="33%" top="52%" scale={1.1} />

        {/* ─── ZONE 8: SECRET SHORTCUT (x ~33-50, y ~52-57) ───────────── */}
        {/* Only a narrow gap between trees – no explicit marker */}
        <Bush left="40%" top="54%" scale={0.8} />
        <Bush left="44%" top="52%" scale={0.9} />

        {/* ─── ZONE 6: PUPPY SEARCH FIELD (y ~25-42, x ~62-85) ─────────── */}
        <FogZone left="74%" top="33%" w="36%" h="28%" color="rgba(100,116,139,0.12)" />
        <FogZone left="70%" top="28%" w="22%" h="18%" color="rgba(148,163,184,0.06)" />
        <Rock left="65%" top="38%" scale={1.1} />
        <Rock left="78%" top="35%" scale={0.9} />
        <Rock left="72%" top="28%" scale={1.0} />
        <Flower left="68%" top="34%" color="bg-slate-400" />
        <Flower left="76%" top="40%" color="bg-slate-500" />
        <Bush left="62%" top="26%" scale={0.9} />
        <Bush left="82%" top="26%" scale={1.0} />
        <Tree left="88%" top="35%" scale={1.1} variant={3} />
        <Tree left="90%" top="28%" scale={1.2} variant={2} />
        <Tree left="85%" top="22%" scale={1.0} variant={3} />

        {/* ─── ZONE 9: HILL / LOOKOUT (y ~38-48, x ~28-42) ────────────── */}
        <Hill left="35%" top="43%" />
        <Rock left="32%" top="40%" scale={0.7} />
        <Rock left="38%" top="38%" scale={0.6} />
        <Tree left="28%" top="38%" scale={0.8} variant={1} />
        <Tree left="43%" top="36%" scale={0.9} variant={2} />

        {/* ─── ZONE 7: LOCKED GATE AREA (y ~8-18) ─────────────────────── */}
        {/* Dense wall of trees creates the "northern barrier" feel */}
        <Tree left="5%"  top="20%" scale={1.4} variant={3} />
        <Tree left="12%" top="18%" scale={1.3} variant={2} />
        <Tree left="20%" top="20%" scale={1.2} variant={3} />
        <Tree left="28%" top="17%" scale={1.1} variant={2} />
        <Tree left="36%" top="19%" scale={1.3} variant={3} />
        {/* gap at 50% for gate */}
        <Tree left="64%" top="19%" scale={1.2} variant={3} />
        <Tree left="72%" top="17%" scale={1.1} variant={2} />
        <Tree left="80%" top="20%" scale={1.3} variant={3} />
        <Tree left="88%" top="18%" scale={1.2} variant={2} />
        <Tree left="95%" top="20%" scale={1.4} variant={3} />
        <Bush left="41%" top="18%" scale={1.2} />
        <Bush left="59%" top="18%" scale={1.2} />

        {/* ─── BOUNDARY TREES (all edges) ──────────────────────────────── */}
        {[5,15,25,40,60,75,85,95].map(x => (
          <React.Fragment key={`bt${x}`}>
            <Tree left={`${x}%`} top="3%"  scale={1.2} variant={3} />
            <Tree left={`${x}%`} top="97%" scale={1.1} variant={2} />
          </React.Fragment>
        ))}
        {[5,15,30,50,70,85,95].map(y => (
          <React.Fragment key={`bs${y}`}>
            <Tree left="2%"  top={`${y}%`} scale={1.1} variant={3} />
            <Tree left="98%" top={`${y}%`} scale={1.0} variant={2} />
          </React.Fragment>
        ))}

        {/* ─── MISSION OBJECTS ─────────────────────────────────────────── */}

        {/* M1: Treat at altar */}
        {currentMission === 1 && !hasTreat && (
          <div className="absolute w-5 h-5 bg-amber-400 rotate-45 shadow-[0_0_14px_rgba(251,191,36,0.9)] animate-slow-pulse z-20"
            style={{ ...pos(treatPosition.x, treatPosition.y), borderRadius:3 }} />
        )}

        {/* M2: Flowers in eastern glade */}
        {currentMission === 2 && flowerPositions.map((f, i) =>
          !f.collected && (
            <div key={i} className="absolute w-5 h-5 bg-pink-500 rounded-full shadow-[0_0_12px_rgba(236,72,153,0.8)] animate-slow-pulse z-20"
              style={pos(f.pos.x, f.pos.y)}>
              <div className="absolute inset-1 bg-pink-200 rounded-full opacity-50" />
            </div>
          )
        )}

        {/* M3: Toy in ruins */}
        {currentMission === 3 && !hasToy && (
          <div className="absolute w-5 h-5 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.9)] animate-bounce z-20"
            style={pos(toyPosition.x, toyPosition.y)}>
            <div className="absolute inset-1 border border-white/40 rounded-full" />
          </div>
        )}

        {/* M4: Gate, key, exit */}
        {currentMission === 4 && (
          <>
            {/* Exit beacon */}
            <div className="absolute flex flex-col items-center z-0"
              style={{ left:`${exitPosition.x}%`, top:`${exitPosition.y}%`, transform:'translate(-50%,0)' }}>
              <div className="w-24 h-2 bg-cyan-400/30 rounded-full blur-sm animate-pulse" />
              <div className="text-[10px] text-cyan-400/60 tracking-[0.3em] uppercase mt-1">EXIT</div>
            </div>
            {/* Gate */}
            <div className={`absolute z-10 flex items-center justify-center rounded-sm text-[10px] tracking-widest font-semibold transition-all duration-1000
                ${gateUnlocked ? 'bg-transparent border border-cyan-900/30 text-cyan-700' : 'bg-slate-900/90 border border-slate-600 text-slate-300 shadow-[0_0_20px_rgba(0,0,0,0.6)]'}`}
              style={{ left:`${gatePosition.x}%`, top:`${gatePosition.y}%`, transform:'translate(-50%,-50%)', width:80, height:36 }}>
              {gateUnlocked ? 'OPEN' : 'SEALED'}
            </div>
            {/* Key */}
            {!hasKey && (
              <div className={`absolute z-20 transition-all duration-800 ${keyVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                style={pos(keyPosition.x, keyPosition.y)}>
                <div className="absolute inset-0 bg-amber-400 rounded-full blur-md opacity-40 animate-pulse" style={{ width:28, height:28, margin:'-4px' }} />
                <Key className="w-5 h-5 text-amber-400 fill-current drop-shadow-[0_0_6px_rgba(251,191,36,0.9)]" />
              </div>
            )}
          </>
        )}

        {/* ─── SPIRIT GUIDE (Puppy) ─────────────────────────────────────── */}
        <div
          className={`absolute z-20 ${missionComplete ? 'animate-happy-bounce' : 'animate-idle-bounce'}`}
          style={{ left:`${puppyPosition.x}%`, top:`${puppyPosition.y}%`, transform:'translate(-50%,-50%)', width:36, height:36 }}
        >
          <div className="absolute inset-0 bg-cyan-400 rounded-full blur-[10px] opacity-30 animate-pulse" />
          <div className="w-full h-full bg-slate-800 rounded-full border border-cyan-500/60 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.25)]">
            <div className="absolute top-2.5 left-2 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse" />
            <div className="absolute top-2.5 right-2 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse" />
            <div className="absolute bottom-2 w-3 h-1.5 bg-slate-600 rounded-full" />
          </div>
          {missionComplete && (
            <div className="absolute -top-10 whitespace-nowrap text-cyan-100 font-medium bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full shadow-lg text-[10px] border border-cyan-800/50 animate-bounce tracking-wider uppercase">
              {currentMission === 1 ? 'Bond Strengthened' : currentMission === 2 ? 'Spirit Calmed' : currentMission === 3 ? 'Artifact Secured' : 'Path Opened'}
            </div>
          )}
        </div>

        {/* ─── PLAYER ───────────────────────────────────────────────────── */}
        <div
          className="absolute z-30"
          style={{ left:`${playerPosition.x}%`, top:`${playerPosition.y}%`, transform:'translate(-50%,-50%)', width:34, height:34 }}
        >
          <div className="absolute inset-0 bg-slate-400/10 rounded-full blur-md" />
          <div className="w-full h-full bg-slate-900 rounded-full border border-slate-600 shadow-[0_4px_16px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col items-center justify-end">
            <div className="w-6 h-6 bg-slate-700 rounded-full mt-1" />
            <div className="w-full h-3 bg-slate-800" />
          </div>
        </div>
      </div>

      {/* ── SCREEN-SPACE OVERLAYS (fixed to viewport, on top of map) ─────── */}

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none z-40"
        style={{ background:'radial-gradient(ellipse at center, transparent 30%, rgba(2,6,23,0.85) 100%)' }} />

      {/* Top cyan atmospheric glow */}
      <div className="absolute inset-0 pointer-events-none z-40"
        style={{ background:'radial-gradient(circle at 70% 5%, rgba(8,145,178,0.08) 0%, transparent 50%)' }} />

      {/* Floating fireflies (screen-space) */}
      <AmbientParticles />
    </div>
  );
};
