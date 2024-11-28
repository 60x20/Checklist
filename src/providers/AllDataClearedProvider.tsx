import { createContext } from 'react';

// custom hooks
import useForceRender from '../custom-hooks/useForceRender';
import useSafeContext from '../custom-hooks/useSafeContext';

// types
import ChildrenProp from '../custom-types/ChildrenProp';

const allDataClearedContext = createContext<AllDataClearedContext | null>(null);

interface AllDataClearedContext {
  allDataCleared: number;
  increaseAllDataCleared: React.DispatchWithoutAction;
}

const AllDataClearedProvider = ({ children }: ChildrenProp) => {
  // inform the children, if clear occurs; let them clean-up

  const [allDataCleared, increaseAllDataCleared] = useForceRender();

  return (
    <allDataClearedContext.Provider value={{ allDataCleared, increaseAllDataCleared }}>
      {children}
    </allDataClearedContext.Provider>
  );
};

export function useAllDataClearedContext() {
  return useSafeContext(allDataClearedContext);
}

export default AllDataClearedProvider;
