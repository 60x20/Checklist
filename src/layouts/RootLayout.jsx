import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createContext, useState } from "react";
export const menuStateContext = createContext();

const RootLayout = () => {
  const [menuState, setMenuState] = useState(false);
  
  function toggleMenuState() {
    setMenuState(!menuState);
  }
  return ( 
    <menuStateContext.Provider value={{ menuState, toggleMenuState }}>
      <Navbar />
      <Outlet />
    </menuStateContext.Provider>
  );
}
 
export default RootLayout;