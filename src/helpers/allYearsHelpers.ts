// All years: years that have an entry in the local storage

// helpers
import { assertCondition } from './utils';
import type { YearInt } from './validateUnitsFromDate';

export type AllYears = YearInt[];

function updateAllYears(arrayOfYears: AllYears) {
  localStorage.setItem('years', JSON.stringify(arrayOfYears));
}

// validate before it can be accessed so it's always valid
validateAllYears();
export function validateAllYears() {
  if (!returnAllYears()) updateAllYears([]);
}

function returnAllYears(): AllYears | null {
  const yearsEntry = localStorage.getItem('years');
  if (yearsEntry !== null) return JSON.parse(yearsEntry) as AllYears;
  return null;
}
export function returnValidAllYears(): AllYears {
  const yearsEntry = returnAllYears();
  assertCondition(yearsEntry !== null, `"AllYears" always saved properly`);
  return yearsEntry;
}

export function addToAllYears(year: YearInt) {
  const allYears = returnValidAllYears();
  allYears.push(year);
  updateAllYears(allYears);
}
