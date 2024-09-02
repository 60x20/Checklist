import { createContext, useCallback, useEffect, useState } from "react";

export const menuStateContext = createContext();

const MenuStateProvider = ({ children }) => {
  const [menuState, setMenuState] = useState(false);
  function toggleMenuState() {
    setMenuState(!menuState);
  }
  // memoized because used as a dependency
  const closeTheMenu = useCallback(() => {
    setMenuState(false);
  }, [setMenuState]);

  // close the menu when escape pressed (for accessibility)
  useEffect(() => {
    const closeMenuHandler = (e) => {
      if (e.key === 'Escape') closeTheMenu();
    };

    // if closed, remove the event listener; if opened, add the event listener
    if (menuState) {
      document.addEventListener('keyup', closeMenuHandler);
      return () => document.removeEventListener('keyup', closeMenuHandler);
    }
  }, [menuState]);

  return ( 
    <menuStateContext.Provider value={{ menuState, toggleMenuState, closeTheMenu }}>
      {children}
    </menuStateContext.Provider>
  );
}
 
export default MenuStateProvider;