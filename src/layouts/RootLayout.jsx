import { Outlet } from "react-router-dom";
import { createContext, useEffect, useState } from "react";

// components
import Navbar from "../components/Navbar";
import Menu from "../components/Menu";
import Main from "../components/Main";
import Footer from "../components/Footer";

// helpers
import returnCurrentDate from "../helpers/returnCurrentDate";
export const menuStateContext = createContext();

const RootLayout = () => {
  const [menuState, setMenuState] = useState(false);
  
  function toggleMenuState() {
    setMenuState(!menuState);
  }
  return ( 
    <menuStateContext.Provider value={{ menuState, toggleMenuState }}>
      <Navbar />
      <Main>
        <Menu />
        <Outlet />
      </Main>
      <Footer />
    </menuStateContext.Provider>
  );
}
 
export default RootLayout;