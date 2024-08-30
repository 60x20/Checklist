export const colorSchemeMediaQuery = matchMedia('(prefers-color-scheme: dark)');


export function returnThemeEntry() {
  return JSON.parse(localStorage.getItem('theme'));
}

export function returnThemeMode(mode) {
  switch (mode) {
    case 1: return 1; // light
    case 2: return 2; // dark
    default: return 0; // auto, also a fallback (if it's undefined, or bigger than 2)
  }
}

