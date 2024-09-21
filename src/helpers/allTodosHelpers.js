// All ToDos: binds todo string to unique ids, used to access todo strings

function setAllTodos(arrayOfTodoStrings) {
  // array indexes are used as references to ToDos, so indexes MUST NOT change
  localStorage.setItem('todos', JSON.stringify(arrayOfTodoStrings));
}

export function validateAllTodos() {
  if (!returnAllTodos()) {
    setAllTodos([]);
  }
}

function returnAllTodos() {
  return JSON.parse(localStorage.getItem('todos'));
}

export function returnTodoDescription(todoId) {
  return returnAllTodos()[todoId];
}

export function addToAllTodos(todoString) {
  const allTodos = returnAllTodos();
  allTodos.push(todoString);
  setAllTodos(allTodos);
  // returns the ID assigned to todoString
  return allTodos.length - 1;
}

export function updateTodoString(id, todoString) {
  const allTodos = returnAllTodos();
  allTodos[id] = todoString;
  setAllTodos(allTodos);
}