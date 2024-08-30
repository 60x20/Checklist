import { createContext, useState } from "react";

export const createTodoFocusContext = createContext();

// used as a variable to avoid unnecessary renderings when it kills itself
let createTodoFocusLocal = false;
function createTodoShouldBeFocused() {
  createTodoFocusLocal = true;
}
export function shouldFocusOnCreateTodo() {
  // when used, automatically kills itself for subsequent invocations
  return [createTodoFocusLocal, createTodoFocusLocal = false][0];
}

const CreateTodoFocusProvider = ({ children }) => {
  // state used to force-render
  const [createTodoFocusState, setCreateTodoFocusState] = useState(0);
  function changeCreateTodoFocusState() {
    createTodoShouldBeFocused(); // make sure state is true
    setCreateTodoFocusState((prev) => prev + 1); // make sure consumer renders
  }

  return (
    <createTodoFocusContext.Provider value={{ createTodoFocusState, changeCreateTodoFocusState }}>
      {children}
    </createTodoFocusContext.Provider>
  );
}
 
export default CreateTodoFocusProvider;