
import { GameScreen } from './screens/GameScreen';
import { MainMenu } from './screens/MainMenu';
import { MissionSelect } from './screens/MissionSelect';
import { PetProfile } from './screens/PetProfile';
import { GameUI } from './ui/GameUI';
import { useGameStore } from './game/systems/useGameStore';

const App = () => {
  const currentScreen = useGameStore((state) => state.currentScreen);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900 font-sans">
      {currentScreen === 'menu' && <MainMenu />}
      {currentScreen === 'missions' && <MissionSelect />}
      {currentScreen === 'pets' && <PetProfile />}
      {currentScreen === 'game' && (
        <>
          <GameUI />
          <GameScreen />
        </>
      )}
    </div>
  );
};

export default App;
