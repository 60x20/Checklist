import { returnTodosTemplate } from "./todosTemplateHelpers";

function setYearEntry(year, toDoData) {
  localStorage.setItem(year, JSON.stringify(toDoData));
}

function returnYearEntry(year) {
  return JSON.parse(localStorage.getItem(year));
}

// make sure date exists in the localStorage
export function validateToDoData(year, month, day) {
  if (!returnYearEntry(year)) {
    setYearEntry(year, []); // array for months
  }

  const yearEntry = returnYearEntry(year);

  if (!yearEntry[month]) {
    yearEntry[month] = []; // array for days
  }

  if (!yearEntry[month][day]) {
    yearEntry[month][day] = {}; // key-value pairs are used
    for (const todoId of returnTodosTemplate()) {
      // instead of equalizing to an empty object, use the latest one
      yearEntry[month][day][todoId] = 0;
    }

    // if any time unit doesn't exist, day will be recreated, if all exist won't; so it's only set here
    setYearEntry(year, yearEntry);
  }
}

export function returnTodoData(year, month, day) {
  const yearEntry = returnYearEntry(year);
  return yearEntry[month][day];
}