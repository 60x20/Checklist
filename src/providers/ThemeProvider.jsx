import { createContext, useEffect, useReducer, useState } from "react";

// helpers
import { colorSchemeMediaQuery, changeThemeModeEntry, returnThemeMode, themeModeData, returnThemeEntry } from "../helpers/themeHelpers";

export const themeContext = createContext();

const bodyClassList = document.body.classList;

const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(() => returnThemeMode(returnThemeEntry()));
  function toggleThemeMode() {
    const nextThemeMode = returnThemeMode(themeMode + 1);
    changeThemeModeEntry(nextThemeMode);
    setThemeMode(nextThemeMode);
  }

  // if theme mode or preference changes, preference will adapt (variable preferred over useEffect to avoid extra re-renders)
  const [preferenceChanged, increasePreferenceChanged] = useReducer((prev) => prev + 1, '', () => themeModeData[themeMode].preferenceForDark);
  const preferenceForDark = themeModeData[themeMode].preferenceForDark;

  // detect changes if auto
  useEffect(() => {
    if (themeMode === 0) {
      const changePreferenceFromEvent = () => increasePreferenceChanged();
      colorSchemeMediaQuery.addEventListener('change', changePreferenceFromEvent);
      return () => colorSchemeMediaQuery.removeEventListener('change', changePreferenceFromEvent);
    }
  }, [themeMode]);

  preferenceForDark ? bodyClassList.add('dark-theme') : bodyClassList.remove('dark-theme');

  return (<themeContext.Provider value={{ preferenceForDark, themeMode, toggleThemeMode }}>
    {children}
  </themeContext.Provider>);
}
 
export default ThemeProvider;