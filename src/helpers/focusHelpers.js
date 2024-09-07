export function focusOnFirstLinkInsideVisualizer() {
  const firstLink = document.querySelector('#visualizer a');
  if (firstLink) firstLink.focus();
}

export function focusOnFirstMenuItem() {
  const menuItem = document.querySelector('#menu a, #menu button');
  if (menuItem) menuItem.focus();
}

