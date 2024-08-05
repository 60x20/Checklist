// should be greedy, otherwise data will be lost
const yearRegex = /\d{4}|\d{2}/;
const monthRegex = /\d{1,2}/;
const dayRegex = /\d{1,2}/;
export default function validateUnitsFromDate(date) {
  // validation, in case the date is not in the desired format
  let { year, month, day } = date;
  
  const yearRegexResult = year.match(yearRegex)?.[0] || '1';
  year = yearRegexResult.padStart(4, '20');
  
  const monthRegexResult = month.match(monthRegex)?.[0] || '1';
  month = monthRegexResult.padStart(2, '0');
  
  const dayRegexResult = day.match(dayRegex)?.[0] || '1';
  day = dayRegexResult.padStart(2, '0');

  return { year, month, day };
}