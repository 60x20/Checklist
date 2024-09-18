// populating for easier performance auditing
function populateLocalStorage(population = 1000, year = 2024, month = 1, day = 1) {
  const yearEntry = JSON.parse(localStorage[year]);
  const newDayData = [];
  newDayData.length = population;
  newDayData.fill(0);
  yearEntry[month][day] = ({...newDayData});
  localStorage.setItem(year, JSON.stringify(yearEntry));
}
