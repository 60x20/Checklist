// All Todos: binds todo data to unique ids, used to access todo data

// helpers
import { assertCondition } from './utils';

import type { BooleanAsNum } from './todosTemplateHelpers';

// allTodos cached to avoid unnecessary parsing, hence faster
// validate since the value can be initially null
validateAllTodos();
export let cachedAllTodos = returnValidAllTodos();

export interface TodoTypeValueMap {
  checkbox: BooleanAsNum;
  number: number;
  time: string;
  text: string;
}
export type TodoType = keyof TodoTypeValueMap;
export type TodoValueType = TodoTypeValueMap[TodoType];
export type CheckboxValueType = TodoTypeValueMap['checkbox'];
interface GlobalTodoData {
  description: string;
  type: TodoType;
}
type TodoDescription = GlobalTodoData['description'];
// array indexes are used as references to Todos, so indexes MUST NOT change
export type ID = number;
type AllTodos = GlobalTodoData[];

function updateAllTodos(arrayOfTodoData: AllTodos) {
  localStorage.setItem('todos', JSON.stringify(arrayOfTodoData));
}
function updateAllTodosAndCache(arrayOfTodoData: AllTodos) {
  updateAllTodos(arrayOfTodoData);

  cachedAllTodos = arrayOfTodoData; // keeping cached version in sync
}

function validateAllTodos() {
  if (!returnAllTodos()) updateAllTodos([]);
}
export function validateAllTodosAndSyncCache() {
  if (!returnAllTodos()) updateAllTodosAndCache([]);
}

function returnAllTodos(): AllTodos | null {
  const allTodosEntry = localStorage.getItem('todos');
  if (allTodosEntry !== null) return JSON.parse(allTodosEntry) as AllTodos;
  return null;
}
function returnValidAllTodos(): AllTodos {
  const allTodosEntry = returnAllTodos();
  assertCondition(allTodosEntry !== null, `"AllTodos" always saved properly`);
  return allTodosEntry;
}

export function addToAllTodosAndCache(
  todoDescription: TodoDescription,
  todoType: TodoType = 'checkbox',
): ID {
  const localAllTodos = returnValidAllTodos();
  localAllTodos.push({ description: todoDescription, type: todoType });
  updateAllTodosAndCache(localAllTodos);
  return localAllTodos.length - 1; // returns the ID assigned to todoDescription
}

export function updateTodoDescriptionAndCache(
  id: ID,
  todoDescription: TodoDescription,
) {
  const localAllTodos = returnValidAllTodos();
  localAllTodos[id].description = todoDescription;
  updateAllTodosAndCache(localAllTodos);
}

export function updateTodoTypeAndCache(id: ID, todoType: TodoType) {
  const localAllTodos = returnValidAllTodos();
  localAllTodos[id].type = todoType;
  updateAllTodosAndCache(localAllTodos);
}
