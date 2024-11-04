import { createContext, useState, useEffect, useCallback } from "react";

import { redirect, useNavigate } from "react-router-dom";

// helpers
import { returnCurrentDate } from "../helpers/returnCurrentDate";
function getTodayVisited() {
  return JSON.parse(localStorage.getItem('today-visited'));
}
function updateTodayVisited(newDate) {
  // by storing only the current date, instead of all the dates, we're cleaning up
  localStorage.setItem('today-visited', JSON.stringify(newDate));
}

// loaders
export function redirectToCurrentDateLoader() { // when the app renders for the first time, go to current date
  // do it only once per date, otherwise url won't be changeable
  // localStorage preferred over sessionStorage, so that when links opened in new tab, this doesn't trigger
  const currentDate = returnCurrentDate();
  if (getTodayVisited() !== currentDate.YMD) {
    updateTodayVisited(currentDate.YMD);
    return redirect(currentDate.YMD.replaceAll('-', '/'));
  }
  return null;
}

export const currentDateContext = createContext();
const CurrentDateProvider = ({ children }) => {
  const navigate = useNavigate();

  const [currentDate, setCurrentDateState] = useState(returnCurrentDate);
  const refreshCurrentDate = useCallback(() => { // memoized to avoid unnecessary re-attaching
    const latestDate = returnCurrentDate();
    // since returnCurrentDate returns an object, validation is done manually
    if (latestDate.YMD !== currentDate.YMD) {
      setCurrentDateState(latestDate);
      navigate(latestDate.YMD.replaceAll('-', '/')); // if currentDate changes, go to the new date
      updateTodayVisited(latestDate.YMD); // if currentDate changes, update todayVisited entry, so that url is changeable
    }
  }, [currentDate, navigate]);

  // interval that checks to see if current date has changed
  useEffect(() => {
    // since currentDate gets changed, if we don't re-set the interval with the new refreshCurrentDate, we'll be using the older version
    const intervalID = setInterval(refreshCurrentDate, 3e3);
    // clean-up: clear the previous refresher, so that there's 1 refresher at a time
    return clearInterval.bind(globalThis, intervalID);
  }, [refreshCurrentDate]);

  return (<currentDateContext.Provider value={ currentDate }>
    { children }
  </currentDateContext.Provider>);
};
 
export default CurrentDateProvider;