// All Todos: binds todo data to unique ids, used to access todo data

import { BooleanAsNum } from './todosTemplateHelpers';

// allTodos cached to avoid unnecessary parsing, hence faster
export let cachedAllTodos = returnAllTodos();

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

  cachedAllTodos = arrayOfTodoData; // keeping cached version in sync
}

export function validateAllTodos() {
  if (!returnAllTodos()) {
    updateAllTodos([]);
  }
}

function returnAllTodos(): AllTodos {
  const allTodosEntry = localStorage.getItem('todos');
  if (allTodosEntry !== null) return JSON.parse(allTodosEntry);
  throw new Error(`"AllTodos" isn't valid`);
}

export function addToAllTodos(
  todoDescription: TodoDescription,
  todoType: TodoType = 'checkbox',
): ID {
  const localAllTodos = returnAllTodos();
  localAllTodos.push({ description: todoDescription, type: todoType });
  updateAllTodos(localAllTodos);
  return localAllTodos.length - 1; // returns the ID assigned to todoDescription
}

export function updateTodoDescription(
  id: ID,
  todoDescription: TodoDescription,
) {
  const localAllTodos = returnAllTodos();
  localAllTodos[id].description = todoDescription;
  updateAllTodos(localAllTodos);
}

export function updateTodoType(id: ID, todoType: TodoType) {
  const localAllTodos = returnAllTodos();
  localAllTodos[id].type = todoType;
  updateAllTodos(localAllTodos);
}
