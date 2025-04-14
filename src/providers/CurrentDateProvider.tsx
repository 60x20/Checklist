import { createContext, useState, useEffect } from 'react';

import { redirect, useNavigate } from 'react-router-dom';

// types
import type ChildrenProp from '../custom-types/ChildrenProp';

// helpers
import {
  type DateWithFormats,
  returnCurrentDate,
} from '../helpers/returnCurrentDate';
import useSafeContext from '../custom-hooks/useSafeContext';
function getTodayVisited(): string | null {
  const todayVisitedEntry = localStorage.getItem('today-visited');
  if (todayVisitedEntry !== null)
    return JSON.parse(todayVisitedEntry) as string;
  return null;
}
function updateTodayVisited(newDate: string) {
  // by storing only the current date, instead of all the dates, we're cleaning up
  localStorage.setItem('today-visited', JSON.stringify(newDate));
}

// loaders
export function redirectToCurrentDateLoader() {
  // when the app renders for the first time, go to current date
  // do it only once per date, otherwise url won't be changeable
  // localStorage preferred over sessionStorage, so that when links opened in new tab, this doesn't trigger
  const currentDate = returnCurrentDate();
  if (getTodayVisited() !== currentDate.YMD) {
    updateTodayVisited(currentDate.YMD);
    return redirect(currentDate.YMD.replaceAll('-', '/'));
  }
  return null;
}

const currentDateContext = createContext<DateWithFormats | null>(null);

export default function CurrentDateProvider({ children }: ChildrenProp) {
  const navigate = useNavigate();

  const [currentDate, setCurrentDateState] = useState(returnCurrentDate);

  // interval that checks to see if current date has changed
  useEffect(() => {
    function refreshCurrentDate() {
      const latestDate = returnCurrentDate();
      // since returnCurrentDate returns an object, validation is done manually
      if (latestDate.YMD !== currentDate.YMD) {
        setCurrentDateState(latestDate);
        navigate(latestDate.YMD.replaceAll('-', '/')); // if currentDate changes, go to the new date
        updateTodayVisited(latestDate.YMD); // if currentDate changes, update todayVisited entry, so that url is changeable
      }
    }

    // since currentDate gets changed, if we don't re-set the interval with the new refreshCurrentDate, we'll be using the older version
    const intervalID = setInterval(refreshCurrentDate, 3e3);
    // clean-up: clear the previous refresher, so that there's 1 refresher at a time
    return () => {
      clearInterval(intervalID);
    };
  }, [currentDate.YMD, navigate]);

  return (
    <currentDateContext.Provider value={currentDate}>
      {children}
    </currentDateContext.Provider>
  );
}

export function useCurrentDateContext() {
  return useSafeContext(currentDateContext);
}
