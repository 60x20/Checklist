// All Todos: binds todo data to unique ids, used to access todo data

// allTodos cached to avoid unnecessary parsing, hence faster
export let cachedAllTodos = returnAllTodos();

function setAllTodos(arrayOfTodoDatas) {
  // array indexes are used as references to Todos, so indexes MUST NOT change
  localStorage.setItem('todos', JSON.stringify(arrayOfTodoDatas));

  cachedAllTodos = arrayOfTodoDatas; // keeping cached version in sync
}

export function validateAllTodos() {
  if (!returnAllTodos()) {
    setAllTodos([]);
  }
}

function returnAllTodos() {
  return JSON.parse(localStorage.getItem('todos'));
}

export function addToAllTodos(todoDescription, todoType = 'checkbox') {
  const localAllTodos = returnAllTodos();
  localAllTodos.push({ description: todoDescription, type: todoType });
  setAllTodos(localAllTodos);
  return localAllTodos.length - 1; // returns the ID assigned to todoDescription
}

export function updateTodoString(id, todoString) {
  const localAllTodos = returnAllTodos();
  localAllTodos[id] = todoString;
  setAllTodos(localAllTodos);
}

export function updateTodoType(id, todoType) {
  const localAllTodos = returnAllTodos();
  localAllTodos[id].type = todoType;
  setAllTodos(localAllTodos);
}
