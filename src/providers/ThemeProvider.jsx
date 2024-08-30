import { createContext, useEffect, useState } from "react";

// helpers
import { colorSchemeMediaQuery, changeThemeModeEntry, returnThemeMode, returnThemeEntry } from "../helpers/themeHelpers";

function isDarkPreferred() {
  return colorSchemeMediaQuery.matches;
}
export const themeContext = createContext();

const bodyClassList = document.body.classList;

const ThemeProvider = ({ children }) => {
  const [preferenceForDark, setPreferenceForDark] = useState(isDarkPreferred);
  function togglePreferenceForDark() {
    setPreferenceForDark(!preferenceForDark);
  const [themeMode, setThemeMode] = useState(() => returnThemeMode(returnThemeEntry()));
  function toggleThemeMode() {
    const nextThemeMode = returnThemeMode(themeMode + 1);
    changeThemeModeEntry(nextThemeMode);
    setThemeMode(nextThemeMode);
  }

  // detect changes
  useEffect(() => {
    const changePreferenceFromEvent = (e) => setPreferenceForDark(e.matches);
    colorSchemeMediaQuery.addEventListener('change', changePreferenceFromEvent);
    return () => colorSchemeMediaQuery.removeEventListener('change', changePreferenceFromEvent);
  }, []);

  preferenceForDark ? bodyClassList.add('dark-theme') : bodyClassList.remove('dark-theme');

  return (
    <themeContext.Provider value={{ preferenceForDark, togglePreferenceForDark }}>
      {children}
    </themeContext.Provider>
  );
}
 
export default ThemeProvider;