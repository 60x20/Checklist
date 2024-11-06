// populating for easier performance auditing

function populateDate(population = 1000, year = 2024, month = 1, day = 1) {
  const yearEntry = JSON.parse(localStorage.getItem(year));
  const newDayData = [];
  newDayData.length = population;
  newDayData.fill(0);
  yearEntry[month][day] = { ...newDayData };
  localStorage.setItem(year, JSON.stringify(yearEntry));
}

function populateAllTodos(population = 1000, text = 'text') {
  const todosEntry = JSON.parse(localStorage.getItem('todos'));
  const newTodos = [];
  newTodos.length = population;
  newTodos.fill(text);
  const populatedTodos = todosEntry.concat(newTodos);
  localStorage.setItem('todos', JSON.stringify(populatedTodos));
}
