import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

// contexts
import { currentDateContext } from "../providers/CurrentDateProvider";
import { amountOfClearsContext } from "../providers/AmountOfClearsProvider";

// helpers
import { validateUnitsFromDate } from "../helpers/validateUnitsFromDate";
import { addToTodosTemplate, removeFromTodosTemplate } from "../helpers/todosTemplateHelpers";
import { returnAllTodos, addToAllTodos, updateTodoString } from "../helpers/allTodosHelpers";
import { returnTodoData, validateToDoData, addToTodoData, removeFromTodoData, updateTodoState } from "../helpers/todoDataHelpers";

const Checklist = () => {
  const requestedDateAsParams = useParams();
  const { year, month, day } = validateUnitsFromDate(requestedDateAsParams);

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
  
  // keeping allTodos in sync with localStorage
  const [ allTodos, setAllTodos ] = useState(returnAllTodos);;
  // if entry gets cleared, adapt to changes
  useEffect(() => {
    setAllTodos(returnAllTodos());
  }, [amountOfClears]);

  // for rendering todos
  const currentToDoDataAsArray = Object.entries(currentToDoData);

  // for the appearance of helpers (individually)
  const [helpersState, setHelpersState] = useState({}); // by default every helper is falsy (undefined)
  function updateHelperState(todoId, value) {
    setHelpersState({...helpersState, [todoId]: value});
  }
  function toggleHelperState(todoId) {
    updateHelperState(todoId, !helpersState[todoId]);
  }
  function closeHelperState(todoId) {
    updateHelperState(todoId, false);
  }
  function closeAllHelpers() {
    setHelpersState({});
  }
  
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
    setCurrentToDoData({...currentToDoData, [todoIdUpdate]: checked});
  }

  // allTodos should be in sync with localStorage entry
  function addToAllTodosAndSync(todoString) {
    const idAssigned = addToAllTodos(todoString);
    setAllTodos([...allTodos, todoString]);
    return idAssigned;
  }
  function updateTodoStringAndSync(todoIdToUpdate, todoString) {
    updateTodoString(todoIdToUpdate, todoString);
    const todosUpdatedVersion = [...allTodos];
    todosUpdatedVersion[todoIdToUpdate] = todoString;
    setAllTodos(todosUpdatedVersion);
  }
  
  // handlers
  function createTodoHandler(e) {
    e.preventDefault();
    const submittedFormData = new FormData(e.currentTarget);
    const formDataReadable = Object.fromEntries(submittedFormData.entries());
    const todoString = String(formDataReadable.todoName);
    const idAssigned = addToAllTodosAndSync(todoString);
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
    updateTodoStringAndSync(todoIdToUpdate, todoString);
    
    closeHelperState(todoIdToUpdate); // close the helper menu
  }
  function updateTodoStateHandler(e) {
    const todoIdUpdate = e.currentTarget.dataset.idToUpdate;
    // boolean converted into 0 and 1 to save memory
    const checked = Number(e.currentTarget.checked);
    updateAndSyncTodoState(todoIdUpdate, checked);
  }

  return (
    <div id="checklist" className="column-container" tabIndex="0" onKeyUp={e => e.key === 'Escape' ? closeAllHelpers() : ''}>
      <h3>{`${day}-${month}-${year}`}</h3>
      <form onSubmit={createTodoHandler}>
        {/* reset text-input's value if date changes */}
        <input id="create-todo" key={year + month + day} type="text" name="todoName" required />
        <button>create</button>
      </form>
      { currentToDoDataAsArray.map((array) => {
        const [ todoId, checked ] = array;
        return (
          // todoId is concatenated with date, so that if data changes, uncontrolled inputs will be reset
          <div className="column-container todo" key={year + month + day + todoId}>
            <div className="row-container todo-data">
              <p>{allTodos[todoId]}</p>
              <input name="todo-state" type="checkbox" data-id-to-update={todoId} onChange={updateTodoStateHandler} checked={checked} />
              <button
                className="toggler"
                onClick={() => toggleHelperState(todoId)}
                title={helpersState[todoId] ? "Close helpers" : "Open helpers"}
                type="button"
              >
                <FontAwesomeIcon icon={helpersState[todoId] ? faXmark : faBars} />
              </button>
            </div>
            { helpersState[todoId] ?
            <div className="row-container helpers">
              {/* when any of the helpers are used, helper menu should be closed */}
              <form data-id-to-update={todoId} onSubmit={updateTodoHandler}>
                <input size="10" type="text" name="todoName" required />
                <button>update todo</button>
              </form>
              <button onClick={removeFromTodoHandler} type="button" data-id-to-remove={todoId}>remove</button>
            </div> : false }
          </div>
        )
      }) }
    </div>
  );
}
 
export default Checklist;