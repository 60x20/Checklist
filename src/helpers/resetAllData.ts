import { validateEntriesAndSyncCache } from './validateEntries';

function resetAllData() {
  localStorage.clear();
  validateEntriesAndSyncCache(); // validate so entries can still be read and ensure cache is in sync
}

export function confirmToResetAllData() {
  const confirmed = window.confirm(
    'Are you sure you want to permanently delete all your data? This action cannot be undone.',
  );
  if (confirmed) resetAllData();
  return confirmed;
}
