// All years: years that have an entry in the local storage

// helpers
import { assertCondition } from './utils';

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
  if (yearsEntry !== null) return JSON.parse(yearsEntry) as AllYears;
  return null;
}
export function returnValidAllYears(): AllYears {
  const yearsEntry = returnAllYears();
  assertCondition(yearsEntry !== null, `"AllYears" isn't valid`);
  return yearsEntry;
}

export function addToAllYears(year: number) {
  const allYears = returnValidAllYears();
  allYears.push(year);
  updateAllYears(allYears);
}
