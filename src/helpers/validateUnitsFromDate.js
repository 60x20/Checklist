export const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// should be greedy, otherwise data will be lost
const yearRegex = /\d{4}|\d{2}/;
const monthRegex = /\d{1,2}/;
const dayRegex = /\d{1,2}/;

// input date is used instead of Date.parse, because Date.parse is lenient
const dateInput = document.createElement('input');
dateInput.type = 'date';

export function validateUnitsFromDate({ year, month, day }) {
  // validation, in case the date is not in the desired format (failsafe)
  const extractedYear = extractYear(year);
  const extractedMonth = extractMonth(month);
  const extractedDay = extractDay(day);
  const isValid = validateDate(extractedYear, extractedMonth, extractedDay);
  return isValid 
    ? { year: extractedYear, month: extractedMonth, day: extractedDay }
    : { year: '2000', month: '01', day: '01' }
  ;
}

export function extractYear(year) {
  const yearRegexResult = year.match(yearRegex)?.[0];
  const extractedYear = yearRegexResult ? yearRegexResult.padStart(4, '20') : NaN;
  return extractedYear;
}
export function extractMonth(month) {
  const monthRegexResult = month.match(monthRegex)?.[0];
  const extractedMonth = monthRegexResult ? monthRegexResult.padStart(2, '0') : NaN;
  return extractedMonth >= 1 && extractedMonth <= 12
    ? extractedMonth
    : NaN
  ;
}
export function extractDay(day) {
  const dayRegexResult = day.match(dayRegex)?.[0];
  const extractedDay = dayRegexResult ? dayRegexResult.padStart(2, '0') : NaN;
  return extractedDay >= 1 && extractedDay <= 31
    ? extractedDay
    : NaN
  ;
}
export function validateDate(year = '2000', month = '01', day = '01') {
  dateInput.value = [year, month, day].join('-'); // returns '', if invalid
  const isValid = Boolean(dateInput.value);
  return isValid;
}