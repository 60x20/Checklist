export const dayInMs = 1000 * 60 * 60 * 24;

// types
import type { DateAsYMD } from './validateUnitsFromDate';

function returnDate(date: Date): DateAsYMD {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // month is zero-indexed
  const day = String(date.getDate()).padStart(2, '0');

  return [year, month, day].join('-') as DateAsYMD;
}

export function returnCurrentDate() {
  const currentDate = new Date();
  return returnDate(currentDate);
}

export function returnDateFromToday(day: number) {
  const currentDate = Date.now();
  const relativeDate = new Date(currentDate + day * dayInMs);
  return returnDate(relativeDate);
}
