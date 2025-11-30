import { dayInMs } from './returnCurrentDate';

// helpers
import { assertCondition } from './utils';

// types
import type { Weekday } from './todosTemplateHelpers';

const weekdayFormatter = createFormatter({ weekday: 'long' });
export const weekdayDayMonthFormatter = createFormatter({
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});
export const dayMonthTruncFormatter = createFormatter({
  day: 'numeric',
  month: 'short',
});
export const dayMonthYearTruncFormatter = createFormatter({
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});
export const monthFormatter = createFormatter({ month: 'long' });
export const monthYearTruncFormatter = createFormatter({
  month: 'short',
  year: 'numeric',
});
function createFormatter(options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(navigator.language, options);
}

export interface FullDateInt {
  year: number;
  month: number;
  day: number;
}
interface FullDateStr {
  year: string;
  month: string;
  day: string;
}
export interface ValidDateStr {
  year: YYYY;
  month: MM;
  day: DD;
}
const validDefaultDate: ValidDateStr = {
  year: '2000' as YYYY,
  month: '01',
  day: '01',
};
const {
  year: defaultYYYY,
  month: defaultMM,
  day: defaultDD,
} = validDefaultDate;
export function validateUnitsFromDate({
  year,
  month,
  day,
}: FullDateStr): ValidDateStr {
  // validation, in case the date is not in the desired format

  // fallback to a valid value to ensure validity
  const extractedYear = extractYear(year) ?? defaultYYYY;
  const extractedMonth = extractMonth(month) ?? defaultMM;
  const extractedDay = extractDay(day) ?? defaultDD;

  const isValid = checkDateValidity({
    year: extractedYear,
    month: extractedMonth,
    day: extractedDay,
  });
  return isValid
    ? { year: extractedYear, month: extractedMonth, day: extractedDay }
    : validDefaultDate;
}

type Digits = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
/** a year in the range `'0001'-'9999'` */
// type YYYY = Exclude<`${Digits}${Digits}${Digits}${Digits}`, '0000'>;
type YYYY = string & { _brand: 'YYYY' }; // branded instead since too complex
/** a month in the range `'01'-'12'` */
type MM = Exclude<`0${Digits}`, '00'> | '10' | '11' | '12';
/** a day in the range `'01'-'31'` */
type DD = Exclude<`${'0' | '1' | '2'}${Digits}`, '00'> | '30' | '31';
/** a date in the format `YYYY-MM-DD` */
export type DateAsYMD = `${YYYY}-${MM}-${DD}`;
// should be greedy, otherwise data will be lost
const yearRegex = /\d{4}|\d{2}/;
const monthRegex = /\d{1,2}/;
const dayRegex = /\d{1,2}/;
/** @returns a year in the range `'0001'-'9999'` or `null` as a failure */
export function extractYear(year: string): YYYY | null {
  const yearRegexResult = yearRegex.exec(year)?.[0];
  if (yearRegexResult) {
    const extractedYear = yearRegexResult.padStart(4, '20');
    if (Number(extractedYear) !== 0) return extractedYear as YYYY; // year 0 doesn't exist
  }
  return null; // null is preferred to ensure failure is handled even with optional parameters
}
/** @returns a month in the range `'01'-'12'` or `null` as a failure */
export function extractMonth(month: string): MM | null {
  const monthRegexResult = monthRegex.exec(month)?.[0];
  if (monthRegexResult) {
    const extractedMonth = monthRegexResult.padStart(2, '0');
    if (Number(extractedMonth) >= 1 && Number(extractedMonth) <= 12)
      return extractedMonth as MM;
  }
  return null; // null is preferred to ensure failure is handled even with optional parameters
}
/** @returns a day in the range `'01'-'31'` or `null` as a failure */
function extractDay(day: string): DD | null {
  const dayRegexResult = dayRegex.exec(day)?.[0];
  if (dayRegexResult) {
    const extractedDay = dayRegexResult.padStart(2, '0');
    if (Number(extractedDay) >= 1 && Number(extractedDay) <= 31)
      return extractedDay as DD;
  }
  return null; // null is preferred to ensure failure is handled even with optional parameters
}

// date input is used instead of Date.parse for validation, because Date.parse is lenient
// for example (Feb 31): Date.parse('2000-02-31') === Date.parse('2000-03-02')
// Date.parse considers 'Feb 31' as 'Feb 29 + 2 days'
const dateInput = document.createElement('input');
dateInput.type = 'date';
dateInput.required = true; // so that empty dates are invalid
// expect an already valid date to ensure the date is likely to be valid
// to be able to check the validity of non-full dates, allow omission with defaults
export function checkDateValidity({
  year = defaultYYYY,
  month = defaultMM,
  day = defaultDD,
}: Partial<ValidDateStr>) {
  dateInput.value = `${year}-${month}-${day}`; // assigns '', if invalid
  const isValid = dateInput.checkValidity();
  return isValid;
}

const dateForSunday = new Date('2000-01-02').valueOf();
export function returnWeekdayFromSunday(day: number) {
  return weekdayFormatter.format(new Date(dateForSunday + day * dayInMs));
}

export function returnWeekday({ year, month, day }: ValidDateStr): Weekday {
  const weekday = new Date(`${year}-${month}-${day}`).getDay();
  assertCondition(!isNaN(weekday), 'returnWeekday always gets a valid date');
  return weekday as Weekday;
}
