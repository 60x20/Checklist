import { createContext, useEffect, useState } from "react";

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
  const [preferenceForDark, setPreferenceForDark] = useState(() => themeModeData[themeMode].preferenceForDark);
  // if theme mode changes, preference should adapt
  useEffect(() => {
    setPreferenceForDark(themeModeData[themeMode].preferenceForDark);
  }, [themeMode])

  // detect changes if auto
  useEffect(() => {
    if (themeMode === 0) {
      const changePreferenceFromEvent = (e) => setPreferenceForDark(e.matches);
      colorSchemeMediaQuery.addEventListener('change', changePreferenceFromEvent);
      return () => colorSchemeMediaQuery.removeEventListener('change', changePreferenceFromEvent);
    }
  }, [themeMode]);

  preferenceForDark ? bodyClassList.add('dark-theme') : bodyClassList.remove('dark-theme');

  return (
    <themeContext.Provider value={{ preferenceForDark, themeMode, toggleThemeMode }}>
      {children}
    </themeContext.Provider>
  );
}
 
export default ThemeProvider;