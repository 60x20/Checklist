// validators
import { validateAllTodosAndSyncCache } from './allTodosHelpers';
import { validateAllYears } from './allYearsHelpers';
import { validateTodosTemplateAndSyncCache } from './todosTemplateHelpers';

/** validates localStorage entries, which is necessary for rendering */
export function validateEntries() {
  validateTodosTemplateAndSyncCache();
  validateAllTodosAndSyncCache();
  validateAllYears();
}
