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
export interface FullDateStr {
  year: string;
  month: string;
  day: string;
}
export function validateUnitsFromDate({
  year,
  month,
  day,
}: FullDateStr): FullDateStr {
  // validation, in case the date is not in the desired format (failsafe)
  const extractedYear = extractYear(year);
  const extractedMonth = extractMonth(month);
  const extractedDay = extractDay(day);
  const isValid = validateDate({
    year: extractedYear,
    month: extractedMonth,
    day: extractedDay,
  });
  return isValid
    ? { year: extractedYear, month: extractedMonth, day: extractedDay }
    : { year: '2000', month: '01', day: '01' };
}

// should be greedy, otherwise data will be lost
const yearRegex = /\d{4}|\d{2}/;
const monthRegex = /\d{1,2}/;
const dayRegex = /\d{1,2}/;
/** @returns a year in the range `'0001'-'9999'` or `''` as a failure */
export function extractYear(year: string) {
  const yearRegexResult = yearRegex.exec(year)?.[0];
  if (yearRegexResult) {
    const extractedYear = yearRegexResult.padStart(4, '20');
    if (Number(extractedYear) !== 0) return extractedYear; // year 0 doesn't exist
  }
  return ''; /** @todo maybe return `null` or `string | ''` to make the failure more obvious */
}
/** @returns a month in the range `'01'-'12'` or `''` as a failure */
export function extractMonth(month: string) {
  const monthRegexResult = monthRegex.exec(month)?.[0];
  if (monthRegexResult) {
    const extractedMonth = monthRegexResult.padStart(2, '0');
    if (Number(extractedMonth) >= 1 && Number(extractedMonth) <= 12)
      return extractedMonth;
  }
  return ''; /** @todo maybe return `null` or `string | ''` to make the failure more obvious */
}
/** @returns a day in the range `'01'-'31'` or `''` as a failure */
function extractDay(day: string) {
  const dayRegexResult = dayRegex.exec(day)?.[0];
  if (dayRegexResult) {
    const extractedDay = dayRegexResult.padStart(2, '0');
    if (Number(extractedDay) >= 1 && Number(extractedDay) <= 31)
      return extractedDay;
  }
  return ''; /** @todo maybe return `null` or `string | ''` to make the failure more obvious */
}

// date input is used instead of Date.parse for validation, because Date.parse is lenient
// for example (Feb 31): Date.parse('2000-02-31') === Date.parse('2000-03-02')
// Date.parse considers 'Feb 31' as 'Feb 29 + 2 days'
const dateInput = document.createElement('input');
dateInput.type = 'date';
dateInput.required = true; // so that empty dates are invalid
export function validateDate({
  year = '2000',
  month = '01',
  day = '01',
}: Partial<FullDateStr>) {
  if (year === '' || month === '' || day === '') return false;
  dateInput.value = `${year}-${month}-${day}`; // assigns '', if invalid
  const isValid = dateInput.checkValidity();
  return isValid;
}

const dateForSunday = new Date('2000-01-02').valueOf();
export function returnWeekdayFromSunday(day: number) {
  return weekdayFormatter.format(new Date(dateForSunday + day * dayInMs));
}

export function returnWeekday({ year, month, day }: FullDateStr): Weekday {
  const weekday = new Date(`${year}-${month}-${day}`).getDay();
  assertCondition(!isNaN(weekday), 'returnWeekday always gets a valid date');
  return weekday as Weekday;
}
