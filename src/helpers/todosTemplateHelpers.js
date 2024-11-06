// todosTemplate: todos that used lastly, used as a template for vacant dates

// todosTemplate cached to avoid unnecessary parsing
export let cachedTodosTemplate = returnTodosTemplate();

function updateTodosTemplate(ObjectOfIds) {
  localStorage.setItem('todos-template', JSON.stringify(ObjectOfIds));

  cachedTodosTemplate = ObjectOfIds; // keeping cached version in sync
}

export function validateTodosTemplate() {
  if (!localStorage.getItem('todos-template')) {
    updateTodosTemplate({});
  }
}

function returnTodosTemplate() {
  return JSON.parse(localStorage.getItem('todos-template'));
}

export function returnTodosTemplateForWeekday(weekday) {
  const localTodosTemplate = returnTodosTemplate();
  const todosTemplateForWeekday = {};
  for (const todoId in localTodosTemplate) {
    if (localTodosTemplate[todoId].frequency[weekday]) {
      delete localTodosTemplate[todoId].frequency; // frequency only stored in todoTemplate entry
      todosTemplateForWeekday[todoId] = localTodosTemplate[todoId];
    }
  }
  return todosTemplateForWeekday;
}

const frequencyEveryDay = [1, 1, 1, 1, 1, 1, 1];
export const frequencyNever = [0, 0, 0, 0, 0, 0, 0];
export function addToTodosTemplate(id, frequency = frequencyEveryDay) {
  const localTodosTemplate = returnTodosTemplate();
  localTodosTemplate[id] = { value: '', frequency };
  updateTodosTemplate(localTodosTemplate);
}

export function updateFrequencyOnTodosTemplate(id, frequency) {
  const localTodosTemplate = returnTodosTemplate();
  localTodosTemplate[id].frequency = frequency;
  updateTodosTemplate(localTodosTemplate);
}

export function removeFromTodosTemplate(idToRemove) {
  const localTodosTemplate = returnTodosTemplate();
  delete localTodosTemplate[idToRemove];
  updateTodosTemplate(localTodosTemplate);
}

export function isTodoInTodosTemplate(todoId) {
  return todoId in cachedTodosTemplate;
}
