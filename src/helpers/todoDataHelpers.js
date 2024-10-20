// TODO: IndexedDB might be used instead of LocalStorage, due to how structured the data is
// and this might help with localization of state

import { returnTodosTemplateForWeekday } from "./todosTemplateHelpers";
import { addToAllYears } from "./allYearsHelpers";

function setYearEntry(year, toDoData) {
  localStorage.setItem(year, JSON.stringify(toDoData));
}

export function returnYearEntry(year) {
  return JSON.parse(localStorage.getItem(year));
}

// make sure date exists in the localStorage
export function validateTodoData(year, month, day, weekday) {
  if (!returnYearEntry(year)) {
    setYearEntry(year, []); // array for months
    addToAllYears(year);
  }

  const yearEntry = returnYearEntry(year);

  if (!yearEntry[month]) {
    yearEntry[month] = []; // array for days
  }

  if (!yearEntry[month][day] || // if empty, initialize it
    !Object.keys(yearEntry[month][day]).length // if it's an empty object, try the template, it might be populated
  ) {
    // use the latest one (might return an empty object)
    yearEntry[month][day] = returnTodosTemplateForWeekday(weekday); // key-value pairs are used

    // if any time unit doesn't exist, day will be recreated, if all exist won't; so it's only set here
    setYearEntry(year, yearEntry);
  }
}

export function returnTodoData(year, month, day) {
  const yearEntry = returnYearEntry(year);
  return yearEntry[month][day];
}

export function addToTodoData(todoId, year, month, day, type = 'checkbox') {
  const yearEntry = returnYearEntry(year);
  yearEntry[month][day][todoId] = { value: '', type };
  setYearEntry(year, yearEntry);
}

export function removeFromTodoData(todoId, year, month, day) {
  const yearEntry = returnYearEntry(year);
  delete yearEntry[month][day][todoId];
  setYearEntry(year, yearEntry);
}

export function updateTodoValue(todoId, year, month, day, value) {
  const yearEntry = returnYearEntry(year);
  yearEntry[month][day][todoId].value = value;
  setYearEntry(year, yearEntry);
}

export function updateTodoType(todoId, year, month, day, type) {
  const yearEntry = returnYearEntry(year);
  yearEntry[month][day][todoId].type = type;
  setYearEntry(year, yearEntry);
}

export function resetTodoData(year, month, day) {
  const yearEntry = returnYearEntry(year);
  yearEntry[month][day] = {};
  setYearEntry(year, yearEntry);
}