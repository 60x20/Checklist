import { createContext, useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

// helpers
import { returnCurrentDate } from "../helpers/returnCurrentDate";

export const currentDateContext = createContext();
const CurrentDateProvider = ({ children }) => {
  const navigate = useNavigate();

  const [currentDate, setCurrentDateState] = useState(returnCurrentDate);
  function refreshCurrentDate() {
    const latestDate = returnCurrentDate();
    // since returnCurentDate returns an object, validation is done manually
    if (latestDate.YMD !== currentDate.YMD) {
      setCurrentDateState(latestDate);
      // if currentDate changes, go to the new date
      navigate(latestDate.YMD.replaceAll('-', '/'));
    };
  }

  // interval that checks to see if current date has changed
  useEffect(() => {
    // since currentDate gets changed, if we don't re-set the interval with the new refreshCurrentDate, we'll be using the older version
    const intervalID = setInterval(refreshCurrentDate, 30e3);
    // clean-up: clear the previous refresher, so that there's 1 refresher at a time
    return clearInterval.bind(globalThis, intervalID);
  }, [currentDate]);

  // when the app renders for the first time, go to current date
  useEffect(() => {
    // do it only once per date, otherwise url won't be changeable
    if (sessionStorage.getItem(currentDate.YMD) !== 'true') {
      sessionStorage.setItem(currentDate.YMD, 'true');
      navigate(currentDate.YMD.replaceAll('-', '/'));
    }
  }, []);
  
  return (
    <currentDateContext.Provider value={ currentDate }>
      { children }
    </currentDateContext.Provider>
  );
}
 
export default CurrentDateProvider;