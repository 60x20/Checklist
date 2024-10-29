import { createContext, useCallback, useState, useSyncExternalStore } from "react";

// helpers
import { colorSchemeMediaQuery, changeThemeModeEntry, returnThemeMode, themeModeData, returnThemeEntry, isDarkPreferred } from "../helpers/themeHelpers";

export const themeContext = createContext();

const bodyClassList = document.body.classList;

const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(() => returnThemeMode(returnThemeEntry()));
  function toggleThemeMode() {
    const nextThemeMode = returnThemeMode(themeMode + 1);
    changeThemeModeEntry(nextThemeMode);
    setThemeMode(nextThemeMode);
  }
  
  // detect theme preferences if auto
  const subscribeToThemeChangeHandler = useCallback((handler) => { // memoized to avoid unnecessary re-attaching
    if (themeMode === 0) {
      colorSchemeMediaQuery.addEventListener('change', handler);
      return () => colorSchemeMediaQuery.removeEventListener('change', handler);
    }
  }, [themeMode]);
  useSyncExternalStore(subscribeToThemeChangeHandler, isDarkPreferred);
  
  // if theme mode or preference changes, preference will adapt (variable preferred over useEffect to avoid extra re-renders)
  const preferenceForDark = themeModeData[themeMode].preferenceForDark;

  preferenceForDark ? bodyClassList.add('dark-theme') : bodyClassList.remove('dark-theme');

  return (<themeContext.Provider value={{ preferenceForDark, themeMode, toggleThemeMode }}>
    {children}
  </themeContext.Provider>);
};
 
export default ThemeProvider;