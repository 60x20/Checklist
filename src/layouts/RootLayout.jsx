import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Menu from "../components/Menu";
import { createContext, useState } from "react";
import Footer from "../components/Footer";
import Main from "../components/Main";

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