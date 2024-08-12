import { validateTodosTemplate } from "../helpers/todosTemplateHelpers";
import { validateAllTodos } from "../helpers/allTodosHelpers";

export default function resetAllData() {
  localStorage.clear();
  validateTodosTemplate();
  validateAllTodos();
}