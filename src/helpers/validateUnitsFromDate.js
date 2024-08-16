// should be greedy, otherwise data will be lost
const yearRegex = /\d{4}|\d{2}/;
const monthRegex = /\d{1,2}/;
const dayRegex = /\d{1,2}/;

// input date is used instead of Date.parse, because Date.parse is lenient
const dateInput = document.createElement('input');
dateInput.type = 'date';

export function validateUnitsFromDate({ year, month, day }) {
  // validation, in case the date is not in the desired format (failsafe)
  const validatedYear = validateYear(year);
  const validatedMonth = validateMonth(month);
  const validatedDay = validateDay(day);
  const isValid = validateDate(validatedYear, validatedMonth, validatedDay);
  return isValid 
    ? { year: validatedYear, month: validatedMonth, day: validatedDay }
    : { year: '2000', month: '01', day: '01' }
  ;
}

export function validateYear(year) {
  const yearRegexResult = year.match(yearRegex)?.[0];
  const validatedYear = yearRegexResult ? yearRegexResult.padStart(4, '20') : NaN;
  return validatedYear;
}
export function validateMonth(month) {
  const monthRegexResult = month.match(monthRegex)?.[0];
  const validatedMonth = monthRegexResult ? monthRegexResult.padStart(2, '0') : NaN;
  return validatedMonth >= 1 && validatedMonth <= 12
    ? validatedMonth
    : NaN
  ;
}
export function validateDay(day) {
  const dayRegexResult = day.match(dayRegex)?.[0];
  const validatedDay = dayRegexResult ? dayRegexResult.padStart(2, '0') : NaN;
  return validatedDay >= 1 && validatedDay <= 31
    ? validatedDay
    : NaN
  ;
}
export function validateDate(year = '2000', month = '01', day = '01') {
  dateInput.value = [year, month, day].join('-'); // returns '', if invalid
  const isValid = Boolean(dateInput.value);
  return isValid;
}