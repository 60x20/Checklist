import { validateTodosTemplate } from "../helpers/todosTemplateHelpers";
import { validateAllTodos } from "../helpers/allTodosHelpers";
import { validateAllYears } from "./allYearsHelpers";

export default function resetAllData() {
  localStorage.clear();
  validateTodosTemplate();
  validateAllTodos();
  validateAllYears();
}