import { createContext } from "react";

// custom hooks
import useForceRender from "../custom-hooks/useForceRender";

export const allDataClearedContext = createContext();

const AllDataClearedProvider = ({ children }) => {
  // inform the children, if clear occurs; let them clean-up

  const [allDataCleared, increaseAllDataCleared] = useForceRender();

  return (<allDataClearedContext.Provider value={{ allDataCleared, increaseAllDataCleared }}>
    {children}
  </allDataClearedContext.Provider>);
};
 
export default AllDataClearedProvider;
