import { createContext, useEffect, useState } from "react";

export const menuStateContext = createContext();

const MenuStateProvider = ({ children }) => {
  const [menuState, setMenuState] = useState(false);
  function toggleMenuState() {
    setMenuState(!menuState);
  }
  function closeTheMenu() {
    setMenuState(false);
  }

  // close the menu when escape pressed (for accessibility)
  useEffect(() => {
    const closeMenuHandler = (e) => {
      if (e.key === 'Escape') closeTheMenu();
    };
    document.addEventListener('keyup', closeMenuHandler);
    return () => document.removeEventListener('keyup', closeMenuHandler);
  }, []);

  return ( 
    <menuStateContext.Provider value={{ menuState, toggleMenuState }}>
      {children}
    </menuStateContext.Provider>
  );
}
 
export default MenuStateProvider;