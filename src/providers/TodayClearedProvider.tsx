import { createContext } from 'react';

// custom hooks
import useForceRender from '../custom-hooks/useForceRender';

export const todayClearedContext = createContext();

const TodayClearedProvider = ({ children }) => {
  // inform the children, if clear occurs; let them clean-up

  const [todayCleared, increaseTodayCleared] = useForceRender();

  return (
    <todayClearedContext.Provider value={{ todayCleared, increaseTodayCleared }}>
      {children}
    </todayClearedContext.Provider>
  );
};

export default TodayClearedProvider;
