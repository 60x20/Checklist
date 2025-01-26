// todosTemplate: todos that were used recently, used as a template for vacant dates

import type { ID, TodoType, TodoValueType } from './allTodosHelpers';
import type { DayTodoData, LocalTodoData } from './todoDataHelpers';

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
type TodosTemplate = Record<ID, TemplateTodoData> & DayTodoData;
// TemplateTodoData can be converted into TodoData by deleting the frequency
type TransferableTodoData = LocalTodoData & { frequency?: Frequency };

// todosTemplate cached to avoid unnecessary parsing
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export let cachedTodosTemplate = returnTodosTemplate()!; // though the value can be initially null, it's validated before use

function updateTodosTemplate(ObjectOfIds: TodosTemplate) {
  localStorage.setItem('todos-template', JSON.stringify(ObjectOfIds));

  cachedTodosTemplate = ObjectOfIds; // keeping cached version in sync
}

export function validateTodosTemplate() {
  if (!returnTodosTemplate()) {
    updateTodosTemplate({});
  }
}

function returnTodosTemplate(): TodosTemplate | null {
  const todosTemplateEntry = localStorage.getItem('todos-template');
  if (todosTemplateEntry !== null)
    return JSON.parse(todosTemplateEntry) as TodosTemplate;
  return null;
}
function returnValidTodosTemplate(): TodosTemplate {
  const todosTemplateEntry = returnTodosTemplate();
  if (todosTemplateEntry !== null) return todosTemplateEntry;
  throw new Error(`"TodosTemplate" isn't valid`);
}

export function returnTodosTemplateForWeekday(weekday: Weekday) {
  const localTodosTemplate = returnValidTodosTemplate();
  const todosTemplateForWeekday: DayTodoData = {};
  for (const todoId in localTodosTemplate) {
    if (localTodosTemplate[todoId].frequency[weekday]) {
      const transferableTodoData: TransferableTodoData = {
        ...localTodosTemplate[todoId],
      };
      delete transferableTodoData.frequency; // frequency only stored in todosTemplate entry
      todosTemplateForWeekday[todoId] = transferableTodoData;
    }
  }
  return todosTemplateForWeekday;
}

const frequencyEveryDay: Frequency = [1, 1, 1, 1, 1, 1, 1];
export const frequencyNever: Frequency = [0, 0, 0, 0, 0, 0, 0];
export function addToTodosTemplate(
  id: ID,
  frequency: Frequency = frequencyEveryDay,
  type: TodoType = 'checkbox',
) {
  const localTodosTemplate = returnValidTodosTemplate();
  localTodosTemplate[id] = {
    value: returnInitialValueForType(type),
    frequency,
  };
  updateTodosTemplate(localTodosTemplate);
}

// keep value and type in sync, otherwise types might disagree:
// (type: number, value: 0) => (type: text, value: 0 (instead of ''))
export function updateValueOnTodosTemplate(id: ID, type: TodoType) {
  const localTodosTemplate = returnValidTodosTemplate();
  localTodosTemplate[id].value = returnInitialValueForType(type);
  updateTodosTemplate(localTodosTemplate);
}

function returnInitialValueForType(type: TodoType): TodoValueType {
  switch (type) {
    case 'number':
    case 'checkbox':
      return 0;
    case 'time':
    case 'text':
      return '';
  }
}

export function updateFrequencyOnTodosTemplate(id: ID, frequency: Frequency) {
  const localTodosTemplate = returnValidTodosTemplate();
  localTodosTemplate[id].frequency = frequency;
  updateTodosTemplate(localTodosTemplate);
}

export function removeFromTodosTemplate(idToRemove: ID) {
  const localTodosTemplate = returnValidTodosTemplate();
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete localTodosTemplate[idToRemove];
  updateTodosTemplate(localTodosTemplate);
}

export function isTodoInTodosTemplate(todoId: ID) {
  return todoId in cachedTodosTemplate;
}
