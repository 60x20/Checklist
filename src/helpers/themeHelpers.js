export const colorSchemeMediaQuery = matchMedia('(prefers-color-scheme: dark)');

function isDarkPreferred() {
  return colorSchemeMediaQuery.matches;
}

export function returnThemeEntry() {
  return JSON.parse(localStorage.getItem('theme'));
}

export function changeThemeModeEntry(value) {
  localStorage.setItem('theme', JSON.stringify(value));
}

export function returnThemeMode(mode) {
  switch (mode) {
    case 1: return 1; // light
    case 2: return 2; // dark
    default: return 0; // auto, also a fallback (if it's undefined, or bigger than 2)
  }
}

export const themeModeData = ({
  0: {
    asWord: 'auto',
    get preferenceForDark() {
      return isDarkPreferred();
    }
  },
  1: {
    asWord: 'light',
    preferenceForDark: false,
  },
  2: {
    asWord: 'dark',
    preferenceForDark: true,
  },
})
