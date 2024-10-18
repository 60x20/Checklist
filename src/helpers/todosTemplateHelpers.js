// todosTemplate: todos that used lastly, used as a template for vacant dates

// todosTemplate cached to avoid unnecessary parsing
export const todosTemplate = {};
todosTemplate.cache = returnTodosTemplate();

function setTodosTemplate(ObjectOfIds) {
  localStorage.setItem('todos-template', JSON.stringify(ObjectOfIds));

  todosTemplate.cache = ObjectOfIds; // keeping cached version in sync
}

export function validateTodosTemplate() {
  if (!localStorage.getItem('todos-template')) {
    setTodosTemplate({});
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
export function addToTodosTemplate(id, type = 'checkbox', frequency = frequencyEveryDay) {
  const localTodosTemplate = returnTodosTemplate();
  localTodosTemplate[id] = { value: '', type, frequency };
  setTodosTemplate(localTodosTemplate);
}

export function updateTypeOnTodosTemplate(id, type) {
  const localTodosTemplate = returnTodosTemplate();
  localTodosTemplate[id].type = type;
  setTodosTemplate(localTodosTemplate);
}

export function updateIndividualFrequencyOnTodosTemplate(id, dayIndex, dayState) {
  const localTodosTemplate = returnTodosTemplate();
  localTodosTemplate[id].frequency[dayIndex] = dayState;
  setTodosTemplate(localTodosTemplate);
}

export function removeFromTodosTemplate(idToRemove) {
  const localTodosTemplate = returnTodosTemplate();
  delete localTodosTemplate[idToRemove];
  setTodosTemplate(localTodosTemplate);
}