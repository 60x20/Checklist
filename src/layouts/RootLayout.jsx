import { Outlet } from "react-router-dom";
import { createContext, useEffect, useState } from "react";

// components
import Navbar from "../components/Navbar";
import Menu from "../components/Menu";
import Main from "../components/Main";
import Footer from "../components/Footer";

// helpers
import returnCurrentDate from "../helpers/returnCurrentDate";

// contexts
export const menuStateContext = createContext();
export const currentDateContext = createContext();

const RootLayout = () => {
  const [menuState, setMenuState] = useState(false);
  function toggleMenuState() {
    setMenuState(!menuState);
  }

  const [currentDate, setCurrentDateState] = useState(returnCurrentDate);
  function refreshCurrentDate() {
    const latestDate = returnCurrentDate();
    // since returnCurentDate returns an object, validation is done manually
    if (latestDate.YMD !== currentDate.YMD) {
      setCurrentDateState(latestDate);
    };
  }

  useEffect(
    () => {
      // since currentDate gets changed, if we bind the func, we'll be using the older version, so rebind everytime it changes
      const refreshRegularly = setInterval.bind(globalThis, refreshCurrentDate, 5000);
      const intervalID = refreshRegularly();
      // clean-up: clear the previous refresher, so that there's 1 refresher at a time
      return clearInterval.bind(globalThis, intervalID);
    }, [currentDate]
  );

  return ( 
    <menuStateContext.Provider value={{ menuState, toggleMenuState }}>
      <currentDateContext.Provider value={{ currentDate }}>
        <Navbar />
        <Main>
          <Menu />
          <Outlet />
        </Main>
        <Footer />
      </currentDateContext.Provider>
    </menuStateContext.Provider>
  );
}

export default RootLayout;