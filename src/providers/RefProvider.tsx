import { createContext, useRef } from 'react';

// helpers
import { shouldUseAutoFocus } from '../helpers/keyboardDetection';
import useSafeContext from '../custom-hooks/useSafeContext';

// types
import ChildrenProp from '../custom-types/ChildrenProp';

const refContext = createContext<RefContext | null>(null);

interface RefContext {
  refs: {
    [elementRef: string]: React.RefObject<HTMLElement>;
  };
  helpers: {
    [helperFunc: string]: () => void;
  };
}

// reset value
// function resetValueFromEl(el) {
//   if (el) el.value = '';
// }
// function resetValueFromRef(ref) {
//   resetValueFromEl(ref.current);
// }

// focus
function focusFromEl(el: Element | null) {
  if (el instanceof HTMLElement) el.focus();
}
export function focusFromRef(ref: React.RefObject<HTMLElement>) {
  focusFromEl(ref.current);
}
export function refCallbackForFocusOnMount(el: HTMLElement | null) {
  // preferred over Effect to avoid flickers

  // if refCallback isn't re-created, react will avoid re-attaching it; therefore it only runs on mount/unmount, but not re-render
  // since refCallback runs with null on unmount, before you focus make sure it's not null
  focusFromEl(el);
}
function focusOnFirstItemFromEl(el: HTMLElement) {
  // asserted since compound selectors aren't inferred well
  const firstItem = el.querySelector('a, button, input');
  focusFromEl(firstItem);
}
export function focusOnFirstItemFromRef(ref: React.RefObject<HTMLElement>) {
  if (ref.current) focusOnFirstItemFromEl(ref.current);
}
export function refCallbackToFocusOnFirstItemOnMount(el: HTMLElement | null) {
  if (el) focusOnFirstItemFromEl(el); // might be null since react executes the callback when element unmounts
}
export function focusOnLastItemFromRef(ref: React.RefObject<HTMLElement>) {
  if (!ref.current) return;
  const allItems = ref.current.querySelectorAll('a, button, input');
  const lastItem = allItems[allItems.length - 1];
  focusFromEl(lastItem);
}

const RefProvider = ({ children }: ChildrenProp) => {
  const createTodoRef = useRef<HTMLInputElement>(null);
  function focusOnCreateTodo() {
    // avoid focusing on editable regions on mobile since it causes an annoying visual keyboard
    if (shouldUseAutoFocus) focusFromRef(createTodoRef);
  }

  const visualizerRef = useRef<HTMLElement>(null);
  function focusOnFirstItemInsideVisualizer() {
    focusOnFirstItemFromRef(visualizerRef);
  }

  const menuTogglerRef = useRef<HTMLButtonElement>(null);
  function focusOnMenuToggler() {
    focusFromRef(menuTogglerRef);
  }

  const footerRef = useRef<HTMLElement>(null);

  const valueToProvide: RefContext = {
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
    },
  };

  return <refContext.Provider value={valueToProvide}>{children}</refContext.Provider>;
};

export function useRefContext() {
  return useSafeContext(refContext);
}

export default RefProvider;
