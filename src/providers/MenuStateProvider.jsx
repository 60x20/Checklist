import { createContext, useCallback, useEffect, useState } from "react";
import { focusOnMenuToggler } from "../helpers/focusHelpers";

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
      if (e.key === 'Escape') {
        focusOnMenuToggler();
        closeTheMenu(); // focusing on menu toggler does not close the menu, even if it trigges blur
      };
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