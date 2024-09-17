import { useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";

// font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

// contexts
import { currentDateContext } from "../providers/CurrentDateProvider";
import { allDataClearedContext } from "../providers/AllDataClearedProvider";
import { requestedDateValidatedContext } from "../providers/RequestedDateValidatedProvider";
import { todayClearedContext } from "../providers/TodayClearedProvider";
import { refContext, focusOnFirstItemFromRef, focusFromEl } from "../providers/RefProvider";

// helpers
import { addToTodosTemplate, removeFromTodosTemplate } from "../helpers/todosTemplateHelpers";
import { returnAllTodos, addToAllTodos, updateTodoString } from "../helpers/allTodosHelpers";
import { returnTodoData, validateToDoData, addToTodoData, removeFromTodoData, updateTodoState } from "../helpers/todoDataHelpers";
import { monthNames } from "../helpers/validateUnitsFromDate";

// custom hooks
import { useEffectDuringRender } from "../helpers/customHooks";

const Checklist = () => {
  const { year, month, day } = useContext(requestedDateValidatedContext);
  const { allDataCleared } = useContext(allDataClearedContext); // when changes, new data will be brought
  const { todayCleared } = useContext(todayClearedContext); // when changes, new data will be brought

  // converted into numbers so that they are considered array indexes
  const unitsAsInt = [parseInt(year, 10), parseInt(month, 10), parseInt(day, 10)];

  const [currentToDoDataChanged, increaseCurrentToDoDataChanged] = useReducer((prev) => prev + 1, 0);
  // bring the stored data of date, or if it doesn't exist create it
  // if data is cleared, clean-up and keep the state and localStorage in sync, otherwise old data will be seen
  useEffectDuringRender(() => {
    validateToDoData(...unitsAsInt);
  }, [day, month, year, allDataCleared, todayCleared]); // don't validate if todo data changes, otherwise every todo can't be removed
  const currentToDoData = useMemo(() => {
    return returnTodoData(...unitsAsInt);
  }, [day, month, year, allDataCleared, todayCleared, currentToDoDataChanged]);

  // keeping allTodos in sync with localStorage
  const [allTodosChanged, increaseAllTodosChanged] = useReducer((prev) => prev + 1, 0);
  // initialize to entry, and if entry gets cleared, adapt to changes
  const allTodos = useMemo(() => returnAllTodos(), [day, month, year, allDataCleared, allTodosChanged]);

  // for rendering todos
  const todoOrderRef = useRef([]);
  const currentToDoDataAsArray = Object.entries(currentToDoData);

  // for closing all helper menus
  const helperMenuClosersRef = useRef({});
  function closeAllHelpers() {
    Object.values(helperMenuClosersRef.current).forEach((closer) => closer());
  }

  return (
    <div id="checklist" className="column-container" tabIndex="-1"
      // keydown preferred, so that when browser popup gets closed, possible keyUps don't trigger closing
      onKeyDown={(e) => { if (e.key === 'Escape') closeAllHelpers(); }}
    >
      <h1><time dateTime={`${year}-${month}-${day}`}>{`${day} ${monthNames[parseInt(month, 10)]} ${year}`}</time></h1>
      <CreateTodo helperBundle={{ unitsAsInt, increaseCurrentToDoDataChanged, year, month, day, increaseAllTodosChanged }} />
      { currentToDoDataAsArray.map((array, order) => {
        const [ todoId, checked ] = array;
        return (
          <Todo 
            // todoId is concatenated with date, so that if data changes, uncontrolled inputs will be reset
            key={year + month + day + todoId}
            helperBundle={{increaseCurrentToDoDataChanged, allTodos, day, month, year, unitsAsInt, todoId, checked, todayCleared, todoOrderRef, order, helperMenuClosersRef}}
          />
        );
      }) }
    </div>
  );
};
 
export default Checklist;

const CreateTodo = ({ helperBundle: { unitsAsInt, increaseCurrentToDoDataChanged, year, month, day, increaseAllTodosChanged }}) => {
  // when mounts, focus on the create todo input
  const { refs: { createTodoRef }, helpers: { focusOnCreateTodo, resetValueOfCreateTodo } } = useContext(refContext);
  useEffect(() => {
    focusOnCreateTodo();
  }, []);

  const currentDate = useContext(currentDateContext);

  // currentToDoData should be in sync with localStorage entry
  function addToCurrentToDoDataAndSync(todoId) {
    addToTodoData(todoId, ...unitsAsInt);
    increaseCurrentToDoDataChanged();
  }

  // allTodos should be in sync with localStorage entry
  function addToAllTodosAndSync(todoString) {
    const idAssigned = addToAllTodos(todoString);
    increaseAllTodosChanged();
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

    resetValueOfCreateTodo(); // value is reset on submit to make known value is added
  }

  return (
    <form onSubmit={createTodoHandler}>
      {/* create-todo gets focus, shouldn't be re-created (keys shouldn't be used here) */}
      <input id="create-todo" ref={createTodoRef} type="text" name="todoName" required
        title="task to add"
      />
      <button>create</button>
    </form>
  )
};

const Todo = ({helperBundle: {increaseCurrentToDoDataChanged, allTodos, day, month, year, unitsAsInt, todoId, checked, todayCleared, todoOrderRef, order, helperMenuClosersRef}}) => {
  const currentDate = useContext(currentDateContext);

  // for the appearance of helpers (individually)
  const [helperState, setHelperState] = useState(false); // by default helper closed
  function toggleHelperState() {
    setHelperState(!helperState);
  }
  function closeHelperMenu() {
    setHelperState(false);
  }
  const refCallbackForToggler = useCallback((el) => todoOrderRef.current[order] = el, [order]); // memoized to avoid re-attaching
  // when the order changes, the previous callback gets called with the older order, nullifying the entry
  // but since this cleanup happens before recent callback gets executed, null entries will be filled correctly
  function returnRelativeTodoToggler(n = 0) {
    return todoOrderRef.current[order + n]; // n = 0: current; n = 1: next; n = -1: previous;
  }
  const { helpers: { focusOnCreateTodo } } = useContext(refContext);
  function focusWhenHelperMenuCloses() {
    const nextTodoToggler = returnRelativeTodoToggler(1);
    if (nextTodoToggler) return nextTodoToggler.focus();
    const prevTodoToggler = returnRelativeTodoToggler(-1);
    if (prevTodoToggler) return prevTodoToggler.focus();
    focusOnCreateTodo(); // last resort
  }

  // global state used locally, so that local changes won't cause re-render (though global changes are still impactful due to key prop)
  const [localChecked, setLocalChecked] = useState(checked);
  useEffect(() => {
    setLocalChecked(checked);
  }, [todayCleared]); // if today gets cleared, localChecked should adapt
  
  // since allTodos[todoId] is only changed here, and nowhere else, it's safe to only use global state initially, local value will always be the latest
  const [localTodoDescription, setLocalTodoDescription] = useState(allTodos[todoId]);

  // currentToDoData should be in sync with localStorage entry
  function removeFromCurrentToDoDataAndSync(todoId) {
    removeFromTodoData(todoId, ...unitsAsInt);
    increaseCurrentToDoDataChanged();
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

    focusWhenHelperMenuCloses(); // move focus to the nearest element
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
    focusFromEl(returnRelativeTodoToggler()); // move focus to the current todoToggler
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
          ref={refCallbackForToggler}
          title={helperState ? "Close helpers." : "Open helpers."}
          type="button"
          aria-haspopup="menu"
          aria-expanded={helperState}
        >
          <FontAwesomeIcon icon={helperState ? faXmark : faBars} />
        </button>
      </div>
      { helperState ?
      <TodoHelpers helperBundle={{todoId, updateTodoStringHandler, removeFromTodoHandler, closeHelperMenu, helperMenuClosersRef}} />
      : false }
    </div>
  );
};

const TodoHelpers = ({helperBundle: {todoId, updateTodoStringHandler, removeFromTodoHandler, closeHelperMenu, helperMenuClosersRef}}) => {
  const helperMenuRef = useRef();

  useEffect(() => {
    focusOnFirstItemFromRef(helperMenuRef);
  }, []); // when mounts focus on the first item

  // store the helperMenu closer in ref, will be used to close all at once
  useEffect(() => {
    helperMenuClosersRef.current[todoId] = closeHelperMenu; // because value to set is always false, old func with old scope is ok to use
    return () => { delete helperMenuClosersRef.current[todoId]; };
  }, [])

  return (<>
  <div className="row-container helpers" ref={helperMenuRef} role="menu" aria-orientation="horizontal">
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
};
