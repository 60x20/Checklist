import { returnTodosTemplate } from "./todosTemplateHelpers";

// make sure date exists in the localStorage
export function validateToDoData(year, month, day) {
  if (!localStorage.getItem(year)) {
    localStorage.setItem(year, JSON.stringify([])); // array for months
  }

  const yearEntry = JSON.parse(localStorage.getItem(year));

  if (!yearEntry[month]) {
    yearEntry[month] = []; // array for days
  }

  if (!yearEntry[month][day]) {
    yearEntry[month][day] = {}; // key-value pairs are used
    for (const todoId of returnTodosTemplate()) {
      // instead of equalizing to an empty object, use the latest one
      yearEntry[month][day][todoId] = 0;
    }

    // if any the time unit doesn't exist, day will be recreated, if all exist won't; so it's only set here
    localStorage.setItem(year, JSON.stringify(yearEntry));
  }
}

export function returnTodoData(year, month, day) {
  const yearEntry = JSON.parse(localStorage.getItem(year));
  return yearEntry[month][day];
}