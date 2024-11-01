import { createContext, useCallback, useState } from "react";

export const menuStateContext = createContext();

const MenuStateProvider = ({ children }) => {
  const [menuState, setMenuState] = useState(false);
  function toggleMenuState() {
    setMenuState(!menuState);
  }
  const closeTheMenu = useCallback(() => setMenuState(false), []); // memoized to avoid unnecessary re-attaching

  return (<menuStateContext.Provider value={{ menuState, toggleMenuState, closeTheMenu }}>
    {children}
  </menuStateContext.Provider>);
};
 
export default MenuStateProvider;