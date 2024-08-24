export function focusOnFirstLinkInsideVisualizer() {
  const firstLink = document.querySelector('#visualizer a');
  if (firstLink) firstLink.focus();
}

export function focusOnCreateTodoInsideChecklist() {
  const createTodo = document.querySelector('#checklist #create-todo');
  if (createTodo) createTodo.focus();
}