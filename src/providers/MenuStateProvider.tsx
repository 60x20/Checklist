import { createContext, useCallback, useState } from 'react';
import useSafeContext from '../custom-hooks/useSafeContext';

// types
import type ChildrenProp from '../custom-types/ChildrenProp';

const menuStateContext = createContext<MenuStateContext | null>(null);

export interface MenuStateContext {
  menuState: boolean;
  toggleMenuState: () => void;
  closeTheMenu: () => void;
}

function MenuStateProvider({ children }: ChildrenProp) {
  const [menuState, setMenuState] = useState(false);
  function toggleMenuState() {
    setMenuState(!menuState);
  }
  const closeTheMenu = useCallback(() => {
    setMenuState(false);
  }, []); // memoized to avoid unnecessary re-attaching

  return (
    <menuStateContext.Provider
      value={{ menuState, toggleMenuState, closeTheMenu }}
    >
      {children}
    </menuStateContext.Provider>
  );
}

export function useMenuStateContext() {
  return useSafeContext(menuStateContext);
}

export default MenuStateProvider;
