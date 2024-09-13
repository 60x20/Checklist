import { createContext, useReducer } from "react";

export const todayClearedContext = createContext();

const TodayClearedProvider = ({ children }) => {
  // inform the children, if clear occurs; let them clean-up

  // instead of true-false, numbers used, with this approach there won't be unnecessary re-renderings
  const [todayCleared, increaseTodayCleared] = useReducer((prev) => prev + 1, 0);

  return ( 
    <todayClearedContext.Provider value={{ todayCleared, increaseTodayCleared }}>
      {children}
    </todayClearedContext.Provider>
  );
}
 
export default TodayClearedProvider;