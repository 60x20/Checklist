import { dayInMs } from './returnCurrentDate';

// helpers
import { parseDecimal } from './utils';

// types
import { Weekday } from './todosTemplateHelpers';

const weekdayFormatter = createFormatter({ weekday: 'long' });
export const weekdayDayMonthFormatter = createFormatter({ weekday: 'long', day: 'numeric', month: 'long' });
export const dayMonthTruncFormatter = createFormatter({ day: 'numeric', month: 'short' });
export const dayMonthYearTruncFormatter = createFormatter({ day: 'numeric', month: 'short', year: 'numeric' });
export const monthFormatter = createFormatter({ month: 'long' });
export const monthYearTruncFormatter = createFormatter({ month: 'short', year: 'numeric' });
function createFormatter(options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(navigator.language, options);
}

// should be greedy, otherwise data will be lost
const yearRegex = /\d{4}|\d{2}/;
const monthRegex = /\d{1,2}/;
const dayRegex = /\d{1,2}/;

// date input is used instead of Date.parse for validation, because Date.parse is lenient
// for example (Feb 31): Date.parse('2000-02-31') === Date.parse('2000-03-02')
// Date.parse considers 'Feb 31' as 'Feb 29 + 2 days'
const dateInput = document.createElement('input');
dateInput.type = 'date';
dateInput.required = true; // so that empty dates are invalid

export interface FullDate {
  year: string;
  month: string;
  day: string;
}
export function validateUnitsFromDate({ year, month, day }: FullDate): FullDate {
  // validation, in case the date is not in the desired format (failsafe)
  const extractedYear = extractYear(year);
  const extractedMonth = extractMonth(month);
  const extractedDay = extractDay(day);
  const isValid = validateDate(extractedYear, extractedMonth, extractedDay);
  return isValid
    ? { year: extractedYear, month: extractedMonth, day: extractedDay }
    : { year: '2000', month: '01', day: '01' };
}

export function extractYear(year: string) {
  const yearRegexResult = year.match(yearRegex)?.[0];
  if (yearRegexResult) {
    const extractedYear = yearRegexResult.padStart(4, '20');
    if (parseDecimal(extractedYear) !== 0) return extractedYear;
  }
  return '';
}
export function extractMonth(month: string) {
  const monthRegexResult = month.match(monthRegex)?.[0];
  if (monthRegexResult) {
    const extractedMonth = monthRegexResult.padStart(2, '0');
    if (parseDecimal(extractedMonth) >= 1 && parseDecimal(extractedMonth) <= 12) return extractedMonth;
  }
  return '';
}
export function extractDay(day: string) {
  const dayRegexResult = day.match(dayRegex)?.[0];
  if (dayRegexResult) {
    const extractedDay = dayRegexResult.padStart(2, '0');
    if (parseDecimal(extractedDay) >= 1 && parseDecimal(extractedDay) <= 31) return extractedDay;
  }
  return '';
}

export function validateDate(year: string = '2000', month: string = '01', day: string = '01') {
  if (year === '' || month === '' || day === '') return false;
  dateInput.value = [year, month, day].join('-'); // returns '', if invalid
  const isValid = dateInput.checkValidity();
  return isValid;
}

const dateForSunday = new Date('2000-01-02').valueOf();
export function returnWeekdayFromSunday(day: number) {
  return weekdayFormatter.format(new Date(dateForSunday + day * dayInMs));
}

export function returnWeekday(year: string, month: string, day: string): Weekday {
  const weekday = new Date([year, month, day].join('-')).getDay();
  if (isNaN(weekday)) throw new Error('not a weekday');
  return weekday as Weekday;
}
