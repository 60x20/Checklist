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

  // detect changes
  useEffect(() => {
    const changePreferenceFromEvent = (e) => setPreferenceForDark(e.matches);
    colorSchemeMediaQuery.addEventListener('change', changePreferenceFromEvent);
    return () => colorSchemeMediaQuery.removeEventListener('change', changePreferenceFromEvent);
  }, []);

  preferenceForDark ? bodyClassList.add('dark-theme') : bodyClassList.remove('dark-theme');

  return (
    <themeContext.Provider value={{ preferenceForDark }}>
      {children}
    </themeContext.Provider>
  );
}
 
export default ThemeProvider;