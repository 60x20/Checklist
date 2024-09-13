import { createContext, useReducer } from "react";

export const allDataClearedContext = createContext();

const AllDataClearedProvider = ({ children }) => {
  // inform the children, if clear occurs; let them clean-up

  // instead of true-false, numbers used, with this approach there won't be unnecessary re-renderings
  const [allDataCleared, increaseAllDataCleared] = useReducer((prev) => prev + 1, 0);

  return ( 
    <allDataClearedContext.Provider value={{ allDataCleared, increaseAllDataCleared }}>
      {children}
    </allDataClearedContext.Provider>
  );
}
 
export default AllDataClearedProvider;
