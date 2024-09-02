export function focusOnFirstLinkInsideVisualizer() {
  const firstLink = document.querySelector('#visualizer a');
  if (firstLink) firstLink.focus();
}

export function focusOnCreateTodoInsideChecklist() {
  const createTodo = document.querySelector('#checklist #create-todo');
  if (createTodo) createTodo.focus();
}

export function focusOnFirstMenuItem() {
  const menuItem = document.querySelector('#menu a, #menu button');
  if (menuItem) menuItem.focus();
}

export function focusOnMenuToggler() {
  const menuToggler = document.querySelector('#menu-toggler');
  if (menuToggler) menuToggler.focus();
}