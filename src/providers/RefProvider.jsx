import { createContext, useRef } from "react";

export const refContext = createContext();

function focusFromEl(el) {
  if (el) el.focus();
}
function focusFromRef(ref) {
  focusFromEl(ref.current);
}
function focusOnFirstItemFromRef(ref) {
  if (!ref.current) return;
  const firstItem = ref.current.querySelector('a, button, input');
  focusFromEl(firstItem);
}
function focusOnLastItemFromRef(ref) {
  if (!ref.current) return;
  const allItems = ref.current.querySelectorAll('a, button, input');
  const lastItem = allItems[allItems.length - 1];
  focusFromEl(lastItem);
}

const RefProvider = ({ children }) => {
  const createTodoRef = useRef();
  function focusOnCreateTodo() {
    focusFromRef(createTodoRef);
  }

  const menuRef = useRef();
  function focusOnFirstMenuItem() {
    focusOnFirstItemFromRef(menuRef);
  }
  function focusOnLastMenuItem() {
    focusOnLastItemFromRef(menuRef);
  }

  const visualizerRef = useRef();
  function focusOnFirstItemInsideVisualizer() {
    focusOnFirstItemFromRef(visualizerRef);
  }

  const menuTogglerRef = useRef();
  function focusOnMenuToggler() {
    focusFromRef(menuTogglerRef);
  }

  const valueToProvide = {
    refs: {
      createTodoRef,
      menuRef,
      visualizerRef,
      menuTogglerRef,
    },
    helpers: {
      focusOnCreateTodo,
      focusOnFirstMenuItem,
      focusOnLastMenuItem,
      focusOnFirstItemInsideVisualizer,
      focusOnMenuToggler,
    }
  }

  return (
    <refContext.Provider value={valueToProvide}>
      {children}
    </refContext.Provider>
  );
}
 
export default RefProvider;