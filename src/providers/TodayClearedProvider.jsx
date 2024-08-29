import { createContext, useState } from "react";

export const todayClearedContext = createContext();

const TodayClearedProvider = ({ children }) => {
  // inform the children, if clear occurs; let them clean-up

  // instead of true-false, numbers used, with this approach there won't be unnecessary re-renderings
  const [todayCleared, setTodayCleared] = useState(0);
  function increaseTodayCleared() {
    setTodayCleared((prevAmount) => prevAmount + 1);
  }

  return ( 
    <todayClearedContext.Provider value={{ todayCleared, increaseTodayCleared }}>
      {children}
    </todayClearedContext.Provider>
  );
}
 
export default TodayClearedProvider;