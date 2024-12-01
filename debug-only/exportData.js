function parseAndReturnLocalStorage() {
  const localStorageParsed = {};
  for (const key in localStorage)
    localStorageParsed[key] = JSON.parse(localStorage.getItem(key));
  return JSON.stringify(localStorageParsed);
}
