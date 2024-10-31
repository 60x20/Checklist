import { validateTodosTemplate } from "../helpers/todosTemplateHelpers";
import { validateAllTodos } from "../helpers/allTodosHelpers";
import { validateAllYears } from "./allYearsHelpers";

function resetAllData() {
  localStorage.clear();
  validateTodosTemplate();
  validateAllTodos();
  validateAllYears();
}

export function confirmToResetAllData() {
  const confirmed = window.confirm('Are you sure you want to permanently delete all your data? This action cannot be undone.');
  if (confirmed) resetAllData();
  return confirmed;
}