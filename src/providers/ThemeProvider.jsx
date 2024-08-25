import { createContext, useEffect, useState } from "react";

export const themeContext = createContext();

const colorSchemeMediaQuery = matchMedia('(prefers-color-scheme: dark)');
function isDarkPreferred() {
  return colorSchemeMediaQuery.matches;
}

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

  return (
    <themeContext.Provider value={{ preferenceForDark, togglePreferenceForDark }}>
      {children}
    </themeContext.Provider>
  );
}
 
export default ThemeProvider;