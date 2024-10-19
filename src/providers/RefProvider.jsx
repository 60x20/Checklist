import { createContext, useRef } from "react";

// helpers
import { shouldUseAutoFocus } from "../helpers/keyboardDetection";

export const refContext = createContext();

// reset value
function resetValueFromEl(el) {
  if (el) el.value = '';
}
function resetValueFromRef(ref) {
  resetValueFromEl(ref.current);
}

// focus
function focusFromEl(el) {
  if (el) el.focus();
}
export function focusFromRef(ref) {
  focusFromEl(ref.current);
}
export function refCallbackForFocusOnMount(el) { // preferred over Effect to avoid flickers
  // if refCallback isn't re-created, react will avoid re-attaching it; therefore it only runs on mount/unmount, but not re-render
  // since refCallback runs with null on unmount, before you focus make sure it's not null
  focusFromEl(el);
}
function focusOnFirstItemFromEl(el) {
  const firstItem = el.querySelector('a, button, input');
  focusFromEl(firstItem);
}
export function focusOnFirstItemFromRef(ref) {
  if (ref.current) focusOnFirstItemFromEl(ref.current);
}
export function refCallbackToFocusOnFirstItemOnMount(el) {
  if (el) focusOnFirstItemFromEl(el); // might be null since react executes the callback when element unmounts
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
    // avoid focusing on editable regions on mobile since it causes an annoying visual keyboard
    if (shouldUseAutoFocus) focusFromRef(createTodoRef);
  }
  function resetValueOfCreateTodo() {
    resetValueFromRef(createTodoRef);
  }

  const visualizerRef = useRef();
  function focusOnFirstItemInsideVisualizer() {
    focusOnFirstItemFromRef(visualizerRef);
  }

  const menuTogglerRef = useRef();
  function focusOnMenuToggler() {
    focusFromRef(menuTogglerRef);
  }

  const footerRef = useRef();

  const valueToProvide = {
    refs: {
      createTodoRef,
      visualizerRef,
      menuTogglerRef,
      footerRef,
    },
    helpers: {
      focusOnCreateTodo,
      focusOnFirstItemInsideVisualizer,
      focusOnMenuToggler,
      resetValueOfCreateTodo,
    }
  }

  return (<refContext.Provider value={valueToProvide}>
    {children}
  </refContext.Provider>);
};
 
export default RefProvider;