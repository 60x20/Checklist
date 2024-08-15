// All years: years that have an entry in the local storage

function setAllYears(arrayOfYears) {
  localStorage.setItem('years', JSON.stringify(arrayOfYears));
}

export function validateAllYears() {
  if (!returnAllYears()) {
    setAllYears([]);
  }
}

export function returnAllYears() {
  return JSON.parse(localStorage.getItem('years'));
}

export function addToAllYears(year) {
  const allYears = returnAllYears();
  allYears.push(year);
  setAllYears(allYears);
}