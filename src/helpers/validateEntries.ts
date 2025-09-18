// validators
import { validateAllTodos } from './allTodosHelpers';
import { validateAllYears } from './allYearsHelpers';
import { validateTodosTemplate } from './todosTemplateHelpers';

/** validates localStorage entries, which is necessary for rendering */
export function validateEntries() {
  validateTodosTemplate();
  validateAllTodos();
  validateAllYears();
}
