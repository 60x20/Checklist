// todosTemplate: todos that used lastly, used as a template for vacant dates

function setTodosTemplate(arrayOfIds) {
  localStorage.setItem('todos-template', JSON.stringify(arrayOfIds));
}

export function validateTodosTemplate() {
  if (!localStorage.getItem('todos-template')) {
    setTodosTemplate([]);
  }
}

export function returnTodosTemplate() {
  return JSON.parse(localStorage.getItem('todos-template'));
}

export function addToTodosTemplate(id) {
  const todosTemplate = returnTodosTemplate();
  todosTemplate.push(id);
  setTodosTemplate(todosTemplate);
}

export function removeFromTodosTemplate(idToRemove) {
  const todosTemplate = returnTodosTemplate();
  // TODO: array indexes might be used for faster lookup
  const filteredTodosTemplate = todosTemplate.filter((id) => id !== idToRemove);
  setTodosTemplate(filteredTodosTemplate);
}