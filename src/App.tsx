
import { GameScreen } from './screens/GameScreen';
import { GameUI } from './ui/GameUI';

const App = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900">
      <GameUI />
      <GameScreen />
    </div>
  );
};

export default App;
