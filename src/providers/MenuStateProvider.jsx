import { createContext, useState } from "react";

export const menuStateContext = createContext();

const MenuStateProvider = ({ children }) => {
  const [menuState, setMenuState] = useState(false);
  function toggleMenuState() {
    setMenuState(!menuState);
  }

  return ( 
    <menuStateContext.Provider value={{ menuState, toggleMenuState }}>
      {children}
    </menuStateContext.Provider>
  );
}
 
export default MenuStateProvider;