/**
 * @todo
 * IndexedDB might be used instead of LocalStorage, due to how structured the data is
 * and this might help with localization of state
 */

// helpers
import { assertCondition } from './utils';
import {
  returnTodosTemplateForWeekday,
  type Weekday,
} from './todosTemplateHelpers';
import { addToAllYears } from './allYearsHelpers';
import type { ID, TodoType, TodoTypeValueMap } from './allTodosHelpers';

// since the type is stored globally and can change without local values adapting, types and values might disagree
// though, this only happens when reading from the store; when writing, make sure types and values agree
export interface LocalTodoData<Type extends TodoType = TodoType> {
  value: TodoTypeValueMap[Type];
}

type Nullish = null | undefined; // helpful if indexes might be undefined or null due to JSON.stringify
export type DayTodoData = Record<ID, LocalTodoData>;
type MonthTodoData = (DayTodoData | Nullish)[]; // there are vacant indexes, so that days and indexes match
type YearTodoData = (MonthTodoData | Nullish)[]; // there are vacant indexes, so that months and indexes match
type ValidMonthTodoData = DayTodoData[]; // can be used if a specific date (year-month-day) is validated
type ValidYearTodoData = ValidMonthTodoData[]; // can be used if a specific date (year-month-day) is validated

function updateYearEntry(year: number, todoData: YearTodoData) {
  localStorage.setItem(String(year), JSON.stringify(todoData));
}

export function returnYearEntry(year: number): YearTodoData | null {
  const yearEntry = localStorage.getItem(String(year));
  if (yearEntry !== null) return JSON.parse(yearEntry) as YearTodoData;
  return null;
}
function returnValidYearEntry(year: number): ValidYearTodoData {
  // if year entry, along with month and day, is already validated, prefer this version to avoid nullish return
  const yearEntry = returnYearEntry(year);
  assertCondition(yearEntry !== null, 'Year entry always saved properly');
  return yearEntry as ValidYearTodoData; // validated before use
}

// make sure date exists in the localStorage
export function validateTodoData(
  year: number,
  month: number,
  day: number,
  weekday: Weekday,
) {
  // make sure it's not null
  if (!returnYearEntry(year)) {
    updateYearEntry(year, []); // array for months
    addToAllYears(year);
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const yearEntry = returnYearEntry(year)!; // the previous logic validates the entry

  if (!yearEntry[month]) {
    yearEntry[month] = []; // array for days
  }

  if (
    !yearEntry[month][day] || // if empty, initialize it
    !Object.keys(yearEntry[month][day]).length // if it's an empty object, try the template, it might be populated
  ) {
    // use the latest one (might return an empty object)
    yearEntry[month][day] = returnTodosTemplateForWeekday(weekday);

    // if any time unit doesn't exist, day will be recreated, if all of them exist, it won't, so it's only updated here
    updateYearEntry(year, yearEntry);
  }
}

export function returnTodoData(year: number, month: number, day: number) {
  const yearEntry = returnValidYearEntry(year);
  return yearEntry[month][day];
}

export function addToTodoData(
  todoId: ID,
  year: number,
  month: number,
  day: number,
  type: TodoType = 'checkbox',
) {
  const yearEntry = returnValidYearEntry(year);
  switch (type) {
    case 'number':
    case 'checkbox':
      yearEntry[month][day][todoId] = { value: 0 };
      break;
    case 'time':
    case 'text':
      yearEntry[month][day][todoId] = { value: '' };
      break;
  }
  updateYearEntry(year, yearEntry);
}

export function removeFromTodoData(
  todoId: ID,
  year: number,
  month: number,
  day: number,
) {
  const yearEntry = returnValidYearEntry(year);
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete yearEntry[month][day][todoId];
  updateYearEntry(year, yearEntry);
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function updateTodoValue<Type extends TodoType = never>(
  todoId: ID,
  year: number,
  month: number,
  day: number,
  // make sure value is according to the type, and type is always passed
  value: NoInfer<TodoTypeValueMap[Type]>,
) {
  const yearEntry = returnValidYearEntry(year);
  yearEntry[month][day][todoId].value = value;
  updateYearEntry(year, yearEntry);
}

export function resetTodoData(year: number, month: number, day: number) {
  const yearEntry = returnValidYearEntry(year);
  yearEntry[month][day] = {};
  updateYearEntry(year, yearEntry);
}
