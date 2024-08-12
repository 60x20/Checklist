import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// contexts
import { currentDateContext } from "../providers/CurrentDateProvider";

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

  const [currentToDoData, setCurrentToDoData] = useState({});

  // bring the stored data of date, or if it doesn't exist create it
  useEffect(() => {
    validateToDoData(...unitsAsInt);
    setCurrentToDoData(returnTodoData(...unitsAsInt));
  }, [day, month, year]);

  // converted into numbers so that they are considered array indexes
  const unitsAsInt = [parseInt(year, 10), parseInt(month, 10), parseInt(day, 10)];
  
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
  }
  function updateTodoStateHandler(e) {
    const todoIdUpdate = e.currentTarget.dataset.idToUpdate;
    const checked = e.currentTarget.checked;
    updateAndSyncTodoState(todoIdUpdate, checked);
  }

  // for rendering todos
  const allTodos = returnAllTodos();
  const currentToDoDataAsArray = Object.entries(currentToDoData);

  return (
    <div id="checklist">
      {`${day}-${month}-${year}`}
      {/* <CreateToDo /> */}
      <form onSubmit={createTodoHandler}>
        <input type="text" name="todoName" required />
        <button>create</button>
      </form>
      { currentToDoDataAsArray.map((array, i) => {
        // todos[todoId]
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