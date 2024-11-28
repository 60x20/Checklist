import { createContext } from 'react';

// custom hooks
import useForceRender from '../custom-hooks/useForceRender';
import useSafeContext from '../custom-hooks/useSafeContext';

// types
import ChildrenProp from '../custom-types/ChildrenProp';

const todayClearedContext = createContext<TodayClearedContext | null>(null);

interface TodayClearedContext {
  todayCleared: number;
  increaseTodayCleared: React.DispatchWithoutAction;
}

const TodayClearedProvider = ({ children }: ChildrenProp) => {
  // inform the children, if clear occurs; let them clean-up

  const [todayCleared, increaseTodayCleared] = useForceRender();

  return (
    <todayClearedContext.Provider value={{ todayCleared, increaseTodayCleared }}>
      {children}
    </todayClearedContext.Provider>
  );
};

export function useTodayClearedContext() {
  return useSafeContext(todayClearedContext);
}

export default TodayClearedProvider;
