
import { useEffect } from 'react';
import { FarmGame } from './components/FarmGame';
import { useFarmStore } from './game/useFarmStore';

const App = () => {
  const tick = useFarmStore((s) => s.tick);

  useEffect(() => {
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [tick]);

  return <FarmGame />;
};

export default App;
