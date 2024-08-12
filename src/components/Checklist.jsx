import { useContext, useEffect, useState, useReducer } from "react";
import { useParams } from "react-router-dom";

// contexts
import { currentDateContext } from "../providers/CurrentDateProvider";
import { amountOfClearsContext } from "../providers/AmountOfClearsProvider";

// helpers
import validateUnitsFromDate from "../helpers/validateUnitsFromDate";
import { addToTodosTemplate, removeFromTodosTemplate } from "../helpers/todosTemplateHelpers";
import { returnAllTodos, addToAllTodos, updateTodoString } from "../helpers/allTodosHelpers";
import { returnTodoData, validateToDoData, addToTodoData, removeFromTodoData, updateTodoState } from "../helpers/todoDataHelpers";

const Checklist = () => {
  const requestedDateAsParams = useParams();
  const requestedDate = validateUnitsFromDate(requestedDateAsParams);
  const { year, month, day } = requestedDate;

  const currentDate = useContext(currentDateContext);
  const { amountOfClears } = useContext(amountOfClearsContext);

  // converted into numbers so that they are considered array indexes
  const unitsAsInt = [parseInt(year, 10), parseInt(month, 10), parseInt(day, 10)];

  const [currentToDoData, setCurrentToDoData] = useState({});

  // bring the stored data of date, or if it doesn't exist create it
  // if data is cleared, clean-up and keep the state and localStorage in sync, otherwise old data will be seen
  useEffect(() => {
    validateToDoData(...unitsAsInt);
    setCurrentToDoData(returnTodoData(...unitsAsInt));
  }, [day, month, year, amountOfClears]);

  // used when allTodos gets updated; this is used instead of a state because allTodos is always in sync with localStorage
  const forceRender = useReducer(i => i + 1, 0)[1];
  
  // for rendering todos
  const allTodos = returnAllTodos();
  const currentToDoDataAsArray = Object.entries(currentToDoData);
  
  // currentToDoData should be in sync with localStorage entry
  function addToCurrentToDoDataAndSync(todoId) {
    addToTodoData(todoId, ...unitsAsInt)
    setCurrentToDoData({...currentToDoData, [todoId]: 0});
  }
  function removeFromCurrentToDoDataAndSync(todoId) {
    removeFromTodoData(todoId, ...unitsAsInt)
    const dataRemovedVersion = {...currentToDoData};
    delete dataRemovedVersion[todoId];
    setCurrentToDoData(dataRemovedVersion);
  }
  function updateAndSyncTodoState(todoIdUpdate, checked) {
    updateTodoState(todoIdUpdate, checked, ...unitsAsInt);
    const dataUpdatedVersion = {...currentToDoData};
    dataUpdatedVersion[todoIdUpdate] = checked;
    setCurrentToDoData(dataUpdatedVersion);
  }

  // handlers
  function createTodoHandler(e) {
    e.preventDefault();
    const submittedFormData = new FormData(e.currentTarget);
    const formDataReadable = Object.fromEntries(submittedFormData.entries());
    const todoString = String(formDataReadable.todoName);
    const idAssigned = addToAllTodos(todoString);
    if (currentDate.YMD === [year, month, day].join('-')) {
      // if currentDate removes/adds a todo, template should adapt
      addToTodosTemplate(idAssigned);
    }
    addToCurrentToDoDataAndSync(idAssigned);
  }
  function removeFromTodoHandler(e) {
    const todoIdToRemove = e.currentTarget.dataset.idToRemove;
    if (currentDate.YMD === [year, month, day].join('-')) {
      // if currentDate removes/adds a todo, template should adapt
      removeFromTodosTemplate(todoIdToRemove);
    }
    removeFromCurrentToDoDataAndSync(todoIdToRemove);
  }
  function updateTodoHandler(e) {
    e.preventDefault();
    const submittedFormData = new FormData(e.currentTarget);
    const formDataReadable = Object.fromEntries(submittedFormData.entries());
    const todoString = String(formDataReadable.todoName);
    const todoIdToUpdate = e.currentTarget.dataset.idToUpdate;
    updateTodoString(todoIdToUpdate, todoString);
    forceRender();
  }
  function updateTodoStateHandler(e) {
    const todoIdUpdate = e.currentTarget.dataset.idToUpdate;
    const checked = e.currentTarget.checked;
    updateAndSyncTodoState(todoIdUpdate, checked);
  }

  return (
    <div id="checklist">
      {`${day}-${month}-${year}`}
      <form onSubmit={createTodoHandler}>
        <input type="text" name="todoName" required />
        <button>create</button>
      </form>
      { currentToDoDataAsArray.map((array, i) => {
        const [ todoId, checked ] = array;
        return (
          <div key={i}>
            <p>{allTodos[todoId]}</p>
            <form data-id-to-update={todoId} onSubmit={updateTodoHandler}>
              <input type="text" name="todoName" required />
              <button>update todo</button>
            </form>
            <button onClick={removeFromTodoHandler} type="button" data-id-to-remove={todoId}>remove</button>
            <input name="todo-state" type="checkbox" data-id-to-update={todoId} onChange={updateTodoStateHandler} checked={checked} />
          </div>
        )
      }) }
    </div>
  );
}
 
export default Checklist;