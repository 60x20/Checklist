// All ToDos: binds todo string to unique ids, used to access todo strings

// allTodos cached to avoid unnecessary parsing, hence faster
export const allTodos = {};
allTodos.cache = returnAllTodos();

function setAllTodos(arrayOfTodoStrings) {
  // array indexes are used as references to ToDos, so indexes MUST NOT change
  localStorage.setItem('todos', JSON.stringify(arrayOfTodoStrings));

  allTodos.cache = arrayOfTodoStrings; // keeping cached version in sync
}

export function validateAllTodos() {
  if (!returnAllTodos()) {
    setAllTodos([]);
  }
}

function returnAllTodos() {
  return JSON.parse(localStorage.getItem('todos'));
}

export function addToAllTodos(todoString) {
  const localAllTodos = returnAllTodos();
  localAllTodos.push(todoString);
  setAllTodos(localAllTodos);
  // returns the ID assigned to todoString
  return localAllTodos.length - 1;
}

export function updateTodoString(id, todoString) {
  const localAllTodos = returnAllTodos();
  localAllTodos[id] = todoString;
  setAllTodos(localAllTodos);
}