// todosTemplate: todos that used lastly, used as a template for vacant dates

function setTodosTemplate(ObjectOfIds) {
  localStorage.setItem('todos-template', JSON.stringify(ObjectOfIds));
}

export function validateTodosTemplate() {
  if (!localStorage.getItem('todos-template')) {
    setTodosTemplate({});
  }
}

export function returnTodosTemplate() {
  return JSON.parse(localStorage.getItem('todos-template'));
}

export function addToTodosTemplate(id) {
  const todosTemplate = returnTodosTemplate();
  todosTemplate[id] = 0;
  setTodosTemplate(todosTemplate);
}

export function removeFromTodosTemplate(idToRemove) {
  const todosTemplate = returnTodosTemplate();
  delete todosTemplate[idToRemove];
  setTodosTemplate(todosTemplate);
}