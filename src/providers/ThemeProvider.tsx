import {
  createContext,
  useCallback,
  useState,
  useSyncExternalStore,
} from 'react';

// helpers
import {
  colorSchemeMediaQuery,
  changeThemeModeEntry,
  returnThemeMode,
  themeModeData,
  returnThemeEntry,
  isDarkPreferred,
  type ThemeMode,
} from '../helpers/themeHelpers';

// types
import type ChildrenProp from '../custom-types/ChildrenProp';

// custom hooks
import useSafeContext from '../custom-hooks/useSafeContext';

const themeContext = createContext<ThemeContext | null>(null);

interface ThemeContext {
  preferenceForDark: boolean;
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
}

const bodyClassList = document.body.classList;

export default function ThemeProvider({ children }: ChildrenProp) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() =>
    returnThemeMode(returnThemeEntry()),
  );
  function toggleThemeMode() {
    const nextThemeMode = returnThemeMode(themeMode + 1);
    changeThemeModeEntry(nextThemeMode);
    setThemeMode(nextThemeMode);
  }

  // detect theme preferences if auto; memoized to avoid unnecessary re-attaching
  const subscribeToThemeChangeHandler = useCallback(
    (handler: () => void) => {
      if (themeMode === 0) {
        colorSchemeMediaQuery.addEventListener('change', handler);
        return () => {
          colorSchemeMediaQuery.removeEventListener('change', handler);
        };
      }
      return () => undefined; // return a dummy callback to satisfy function signature
    },
    [themeMode],
  );
  useSyncExternalStore(subscribeToThemeChangeHandler, isDarkPreferred);

  // if theme mode or preference changes, preference will adapt (variable preferred over useEffect to avoid extra re-renders)
  const preferenceForDark = themeModeData[themeMode].preferenceForDark;

  if (preferenceForDark) bodyClassList.add('dark-theme');
  else bodyClassList.remove('dark-theme');

  return (
    <themeContext.Provider
      value={{ preferenceForDark, themeMode, toggleThemeMode }}
    >
      {children}
    </themeContext.Provider>
  );
}

export function useThemeContext() {
  return useSafeContext(themeContext);
}
