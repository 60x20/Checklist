// All years: years that have an entry in the local storage

export type AllYears = number[];

function updateAllYears(arrayOfYears: AllYears) {
  localStorage.setItem('years', JSON.stringify(arrayOfYears));
}

export function validateAllYears() {
  if (!returnAllYears()) {
    updateAllYears([]);
  }
}

function returnAllYears(): AllYears | null {
  const yearsEntry = localStorage.getItem('years');
  if (yearsEntry !== null) return JSON.parse(yearsEntry);
  return null;
}
export function returnValidAllYears(): AllYears {
  const yearsEntry = returnAllYears();
  if (yearsEntry !== null) return yearsEntry;
  throw new Error(`"AllYears" isn't valid`);
}

export function addToAllYears(year: number) {
  const allYears = returnValidAllYears();
  allYears.push(year);
  updateAllYears(allYears);
}
