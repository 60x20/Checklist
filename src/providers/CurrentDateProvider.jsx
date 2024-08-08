import { createContext, useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

// helpers
import returnCurrentDate from "../helpers/returnCurrentDate";

export const currentDateContext = createContext();
const CurrentDateProvider = ({ children }) => {
  const [currentDate, setCurrentDateState] = useState(returnCurrentDate);
  function refreshCurrentDate() {
    const latestDate = returnCurrentDate();
    // since returnCurentDate returns an object, validation is done manually
    if (latestDate.YMD !== currentDate.YMD) {
      setCurrentDateState(latestDate);
    };
  }

  // interval that checks to see if current date has changed
  useEffect(
    () => {
      // since currentDate gets changed, if we don't re-set the interval with the new refreshCurrentDate, we'll be using the older version
      const intervalID = setInterval(refreshCurrentDate, 5000);
      // clean-up: clear the previous refresher, so that there's 1 refresher at a time
      return clearInterval.bind(globalThis, intervalID);
    }, [currentDate]
  );

  // initially go to current date, then if currentDate changes, go to the new date
  const navigate = useNavigate();
  useEffect(() => {
    navigate(currentDate.YMD.replaceAll('-', '/'));
  }, [currentDate]);
  return (
    <currentDateContext.Provider value={ currentDate }>
      { children }
    </currentDateContext.Provider>
  );
}
 
export default CurrentDateProvider;