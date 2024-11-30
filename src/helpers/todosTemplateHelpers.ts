// todosTemplate: todos that used lastly, used as a template for vacant dates

import { ID } from './allTodosHelpers';
import { DayTodoData, LocalTodoData } from './todoDataHelpers';

export type BooleanAsNum = 0 | 1;

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Frequency = [
  BooleanAsNum,
  BooleanAsNum,
  BooleanAsNum,
  BooleanAsNum,
  BooleanAsNum,
  BooleanAsNum,
  BooleanAsNum,
];
type TemplateTodoData = LocalTodoData & { frequency: Frequency };
interface TodosTemplate extends DayTodoData {
  [id: number]: TemplateTodoData;
}
// TemplateTodoData can be converted into TodoData by deleting the frequency
type TransferableTodoData = LocalTodoData & { frequency?: Frequency };

// todosTemplate cached to avoid unnecessary parsing
export let cachedTodosTemplate = returnTodosTemplate();

function updateTodosTemplate(ObjectOfIds: TodosTemplate) {
  localStorage.setItem('todos-template', JSON.stringify(ObjectOfIds));

  cachedTodosTemplate = ObjectOfIds; // keeping cached version in sync
}

export function validateTodosTemplate() {
  if (!localStorage.getItem('todos-template')) {
    updateTodosTemplate({});
  }
}

function returnTodosTemplate(): TodosTemplate {
  const todosTemplateEntry = localStorage.getItem('todos-template');
  if (todosTemplateEntry !== null) return JSON.parse(todosTemplateEntry);
  throw new Error(`"TodosTemplate" isn't valid`);
}

export function returnTodosTemplateForWeekday(weekday: Weekday) {
  const localTodosTemplate = returnTodosTemplate();
  const todosTemplateForWeekday: DayTodoData = {};
  for (const todoId in localTodosTemplate) {
    if (localTodosTemplate[todoId].frequency[weekday]) {
      const transferableTodoData: TransferableTodoData = { ...localTodosTemplate[todoId] };
      delete transferableTodoData.frequency; // frequency only stored in todosTemplate entry
      todosTemplateForWeekday[todoId] = transferableTodoData;
    }
  }
  return todosTemplateForWeekday;
}

const frequencyEveryDay: Frequency = [1, 1, 1, 1, 1, 1, 1];
export const frequencyNever: Frequency = [0, 0, 0, 0, 0, 0, 0];
export function addToTodosTemplate(id: ID, frequency: Frequency = frequencyEveryDay) {
  const localTodosTemplate = returnTodosTemplate();
  localTodosTemplate[id] = { value: '', frequency };
  updateTodosTemplate(localTodosTemplate);
}

export function updateFrequencyOnTodosTemplate(id: ID, frequency: Frequency) {
  const localTodosTemplate = returnTodosTemplate();
  localTodosTemplate[id].frequency = frequency;
  updateTodosTemplate(localTodosTemplate);
}

export function removeFromTodosTemplate(idToRemove: ID) {
  const localTodosTemplate = returnTodosTemplate();
  delete localTodosTemplate[idToRemove];
  updateTodosTemplate(localTodosTemplate);
}

export function isTodoInTodosTemplate(todoId: ID) {
  return todoId in cachedTodosTemplate;
}
