import { useContext, useEffect, useReducer, useState } from "react";

// font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

// contexts
import { currentDateContext } from "../providers/CurrentDateProvider";
import { allDataClearedContext } from "../providers/AllDataClearedProvider";
import { requestedDateValidatedContext } from "../providers/RequestedDateValidatedProvider";
import { todayClearedContext } from "../providers/TodayClearedProvider";
import { refContext } from "../providers/RefProvider";

// helpers
import { addToTodosTemplate, removeFromTodosTemplate } from "../helpers/todosTemplateHelpers";
import { returnAllTodos, addToAllTodos, updateTodoString } from "../helpers/allTodosHelpers";
import { returnTodoData, validateToDoData, addToTodoData, removeFromTodoData, updateTodoState } from "../helpers/todoDataHelpers";
import { monthNames } from "../helpers/validateUnitsFromDate";

// custom hooks
function useLocalStateFromProp(prop, otherDependencies = []) {
  // initialize to prop, and if prop changes, adapt; otherwise keep using the local version
  // helpful if global state used locally, so that local changes won't cause re-render (though global changes are still impactful)

  // prop might be old if it changes inside Effect, but since used as a dependency, new one will always be used
  // other dependencies can be used to force the usage of prop
  // for example, a reset function can change prop from 0 => 0, which wouldn't trigger Effect
  const [localState, setLocalState] = useState(prop);
  useEffect(() => {
    setLocalState(prop);
  }, [prop, ...otherDependencies])

  return [localState, setLocalState];
}

const Checklist = () => {
  // when mounts, focus on the create todo input
  const { refs: { createTodoRef }, helpers: { focusOnCreateTodo, resetValueOfCreateTodo } } = useContext(refContext);
  useEffect(() => {
    focusOnCreateTodo();
  }, []);

  const { year, month, day } = useContext(requestedDateValidatedContext);
  const currentDate = useContext(currentDateContext);
  const { allDataCleared } = useContext(allDataClearedContext); // when changes, new data will be brought
  const { todayCleared } = useContext(todayClearedContext); // when changes, new data will be brought

  // converted into numbers so that they are considered array indexes
  const unitsAsInt = [parseInt(year, 10), parseInt(month, 10), parseInt(day, 10)];

  const [currentToDoData, syncCurrentToDoDataWithLocalStorage] = useReducer(() => returnTodoData(...unitsAsInt), {});

  // bring the stored data of date, or if it doesn't exist create it
  // if data is cleared, clean-up and keep the state and localStorage in sync, otherwise old data will be seen
  useEffect(() => {
    validateToDoData(...unitsAsInt);
    syncCurrentToDoDataWithLocalStorage();
  }, [day, month, year, allDataCleared, todayCleared]);

  // keeping allTodos in sync with localStorage
  const [ allTodos, setAllTodos ] = useState([]);
  // initialize to entry, and if entry gets cleared, adapt to changes
  useEffect(() => {
    setAllTodos(returnAllTodos());
  }, [allDataCleared]);

  // currentToDoData should be in sync with localStorage entry
  function addToCurrentToDoDataAndSync(todoId) {
    addToTodoData(todoId, ...unitsAsInt);
    syncCurrentToDoDataWithLocalStorage();
  }

  // allTodos should be in sync with localStorage entry
  function addToAllTodosAndSync(todoString) {
    const idAssigned = addToAllTodos(todoString);
    setAllTodos([...allTodos, todoString]);
    return idAssigned;
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

    resetValueOfCreateTodo(); // Value is reset on submit to make known value is added
  }

  // for rendering todos
  const currentToDoDataAsArray = Object.entries(currentToDoData);

  return (
    <div id="checklist" className="column-container" tabIndex="-1">
      <h1><time dateTime={`${year}-${month}-${day}`}>{`${day} ${monthNames[parseInt(month, 10)]} ${year}`}</time></h1>
      <form onSubmit={createTodoHandler}>
        {/* create-todo gets focus, shouldn't be re-created (keys shouldn't be used here) */}
        <input id="create-todo" ref={createTodoRef} type="text" name="todoName" required
          title="task to add"
        />
        <button>create</button>
      </form>
      { currentToDoDataAsArray.map((array) => {
        const [ todoId, checked ] = array;
        return (
          <Todo 
            // todoId is concatenated with date, so that if data changes, uncontrolled inputs will be reset
            key={year + month + day + todoId}
            helperBundle={{syncCurrentToDoDataWithLocalStorage, allTodos, day, month, year, unitsAsInt, currentDate, todoId, checked, todayCleared}}
          />
        );
      }) }
    </div>
  );
}
 
export default Checklist;

const Todo = ({helperBundle: {syncCurrentToDoDataWithLocalStorage, allTodos, day, month, year, unitsAsInt, currentDate, todoId, checked, todayCleared}}) => {
  // for the appearance of helpers (individually)
  const [helperState, setHelperState] = useState(false); // by default helper closed
  function toggleHelperState() {
    setHelperState(!helperState);
  }
  function closeHelperMenu() {
    setHelperState(false);
  }

  // global state used locally, so that local changes won't cause re-render (though global changes are still impactful)
  // todayCleared is a dependency, because it might change 'checked' from 0 => 0, which wouldn't trigger effect
  const [localChecked, setLocalChecked] = useLocalStateFromProp(checked, [todayCleared]);
  
  // since allTodos[todoId] is only changed here, and nowhere else, it's safe to only use global state initially, local value will always be the latest
  const [localTodoDescription, setLocalTodoDescription] = useState(allTodos[todoId]);

  // currentToDoData should be in sync with localStorage entry
  function removeFromCurrentToDoDataAndSync(todoId) {
    removeFromTodoData(todoId, ...unitsAsInt);
    syncCurrentToDoDataWithLocalStorage();
  }
  // for performance optimization, todoState locally managed, hence only in sync with localStorgae (not with currentTodoData)
  function updateAndSyncTodoState(todoIdUpdate, checked) {
    updateTodoState(todoIdUpdate, checked, ...unitsAsInt);
  }

  // for performance optimization, allTodos[todoId] locally managed, hence only in sync with localStorgae (not with allTodos)
  function updateTodoStringAndSync(todoIdToUpdate, todoString) {
    updateTodoString(todoIdToUpdate, todoString);
    setLocalTodoDescription(todoString);
  }

  // handlers
  function removeFromTodoHandler(e) {
    const todoIdToRemove = e.currentTarget.dataset.idToRemove;
    if (currentDate.YMD === [year, month, day].join('-')) {
      // if currentDate removes/adds a todo, template should adapt
      removeFromTodosTemplate(todoIdToRemove);
    }
    removeFromCurrentToDoDataAndSync(todoIdToRemove);
  }
  function updateTodoStateHandler(e) {
    const todoIdUpdate = e.currentTarget.dataset.idToUpdate;
    // boolean converted into 0 and 1 to save memory
    const checked = Number(e.currentTarget.checked);
    updateAndSyncTodoState(todoIdUpdate, checked);

    setLocalChecked(checked);
  }
  function updateTodoStringHandler(e) {
    e.preventDefault();
    const submittedFormData = new FormData(e.currentTarget);
    const formDataReadable = Object.fromEntries(submittedFormData.entries());
    const todoString = String(formDataReadable.todoName);
    const todoIdToUpdate = e.currentTarget.dataset.idToUpdate;
    updateTodoStringAndSync(todoIdToUpdate, todoString);
    
    closeHelperMenu(); // close the helper menu
  }

  return (
    <div className="column-container todo">
      <div className="main-with-others-grouped-row-container">
        <p className="main-item">{localTodoDescription}</p>
        <input name="todo-state" type="checkbox" data-id-to-update={todoId} onChange={updateTodoStateHandler} checked={localChecked}
          title={`Mark as ${!localChecked ? 'done' : 'undone'}.`}
        />
        <button
          className="toggler-with-icon"
          onClick={() => toggleHelperState()}
          title={helperState ? "Close helpers." : "Open helpers."}
          type="button"
        >
          <FontAwesomeIcon icon={helperState ? faXmark : faBars} />
        </button>
      </div>
      { helperState ?
      <TodoHelpers helperBundle={{todoId, updateTodoStringHandler, removeFromTodoHandler}} />
      : false }
    </div>
  );
}

const TodoHelpers = ({helperBundle: {todoId, updateTodoStringHandler, removeFromTodoHandler}}) => {
  useEffect(() => {
    // focus();
  }, []);

  return (<>
  <div className="row-container helpers">
    {/* when any of the helpers are used, helper menu should be closed */}
    {/* focus should be managed when menu closes or opens */}
    <form data-id-to-update={todoId} onSubmit={updateTodoStringHandler}>
      <input size="10" type="text" name="todoName" required 
        title="new task description"
      />
      <button>update todo</button>
    </form>
    <button onClick={removeFromTodoHandler} type="button" data-id-to-remove={todoId}>remove</button>
  </div>
  </>);
}
