// font awesome
import {
  faSun,
  faMoon,
  faCircleHalfStroke,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

export const colorSchemeMediaQuery = matchMedia('(prefers-color-scheme: dark)');

export function isDarkPreferred() {
  return colorSchemeMediaQuery.matches;
}

export type ThemeMode = 0 | 1 | 2;

export function returnThemeEntry(): ThemeMode | null {
  const themeEntry = localStorage.getItem('theme');
  if (themeEntry !== null) return JSON.parse(themeEntry) as ThemeMode;
  return null;
}

export function changeThemeModeEntry(themeMode: ThemeMode) {
  localStorage.setItem('theme', JSON.stringify(themeMode));
}

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export function returnThemeMode(themeMode: ThemeMode | number | null) {
  switch (themeMode) {
    case 1:
      return 1; // light
    case 2:
      return 2; // dark
    default:
      return 0; // auto, also a fallback (if it's null, or bigger than 2)
  }
}

type ThemeModeData = Record<ThemeMode, ThemeModeDatum>;
interface ThemeModeDatum {
  asWord: string;
  icon: IconDefinition;
  preferenceForDark: boolean;
}

export const themeModeData: ThemeModeData = {
  0: {
    asWord: 'auto',
    icon: faCircleHalfStroke,
    get preferenceForDark() {
      return isDarkPreferred();
    },
  },
  1: {
    asWord: 'light',
    icon: faSun,
    preferenceForDark: false,
  },
  2: {
    asWord: 'dark',
    icon: faMoon,
    preferenceForDark: true,
  },
};
