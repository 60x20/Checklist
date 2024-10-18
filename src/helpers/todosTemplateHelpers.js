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

export function addToTodosTemplate(id, type = 'checkbox') {
  const localTodosTemplate = returnTodosTemplate();
  localTodosTemplate[id] = { value: '', type };
  setTodosTemplate(localTodosTemplate);
}

export function updateTypeOnTodosTemplate(id, type) {
  const localTodosTemplate = returnTodosTemplate();
  localTodosTemplate[id].type = type;
  setTodosTemplate(localTodosTemplate);
}

export function removeFromTodosTemplate(idToRemove) {
  const localTodosTemplate = returnTodosTemplate();
  delete localTodosTemplate[idToRemove];
  setTodosTemplate(localTodosTemplate);
}