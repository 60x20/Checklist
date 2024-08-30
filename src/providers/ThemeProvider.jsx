import { createContext, useEffect, useState } from "react";

export const themeContext = createContext();
// helpers
import { colorSchemeMediaQuery } from "../helpers/themeHelpers";

function isDarkPreferred() {
  return colorSchemeMediaQuery.matches;
}

const bodyClassList = document.body.classList;

const ThemeProvider = ({ children }) => {
  const [preferenceForDark, setPreferenceForDark] = useState(isDarkPreferred);
  function togglePreferenceForDark() {
    setPreferenceForDark(!preferenceForDark);
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