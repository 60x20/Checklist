import { createContext, useCallback, useMemo, useState } from "react";

export const menuStateContext = createContext();

// memoization might be unnecessary
const MenuStateProvider = ({ children }) => {
  const [menuState, setMenuState] = useState(false);
  
  // since recreated on every rerender, memoized; thanks to this react won't think provider value changed
  const toggleMenuState = useCallback(() => {
    setMenuState(!menuState);
  }, [menuState]);

  // memoized so that value has the same value
  const menuStateBundle = useMemo(() => ({
    menuState,
    toggleMenuState
  }), [menuState]);

  return ( 
    <menuStateContext.Provider value={menuStateBundle}>
      {children}
    </menuStateContext.Provider>
  );
}
 
export default MenuStateProvider;