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