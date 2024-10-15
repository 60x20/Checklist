import { createContext, useCallback, useContext, useEffect, useState } from "react";

export const menuStateContext = createContext();

// contexts
import { refContext } from "./RefProvider";

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
  const { helpers: { focusOnMenuToggler } } = useContext(refContext);
  useEffect(() => {
    const closeMenuHandler = (e) => {
      if (e.key === 'Escape') {
        focusOnMenuToggler();
        closeTheMenu(); // focusing on menu toggler does not close the menu, even if it trigges blur
      };
    };

    // if closed, remove the event listener; if opened, add the event listener
    if (menuState) {
      // keydown used instead of keyup, so that when a browser popup closed with esc, menu won't close
      document.addEventListener('keydown', closeMenuHandler);
      return () => document.removeEventListener('keydown', closeMenuHandler);
    }
  }, [menuState]);

  return (<menuStateContext.Provider value={{ menuState, toggleMenuState, closeTheMenu }}>
    {children}
  </menuStateContext.Provider>);
};
 
export default MenuStateProvider;