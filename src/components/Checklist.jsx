import { memo, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";

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
import { addToAllTodos, updateTodoString, returnTodoDescription } from "../helpers/allTodosHelpers";
import { returnTodoData, validateTodoData, addToTodoData, removeFromTodoData, updateTodoState, returnTodoTaskValue } from "../helpers/todoDataHelpers";
import { monthNames } from "../helpers/validateUnitsFromDate";

// custom hooks
import { useEffectDuringRender } from "../helpers/customHooks";

const Checklist = () => {
  const { year, month, day } = useContext(requestedDateValidatedContext);
  const { allDataCleared } = useContext(allDataClearedContext); // when changes, new data will be brought
  const { todayCleared } = useContext(todayClearedContext); // when changes, new data will be brought

  // converted into numbers so that they are considered array indexes; memoized since used as dependency
  const unitsAsInt = useMemo(() => [parseInt(year, 10), parseInt(month, 10), parseInt(day, 10)], [day, month, year]);

  // day must be validated before usage (otherwise since reducer uses the latest scope, it might request an unvalidated date) 
  useEffectDuringRender(() => {
    // validate during render, since accessed during render or during Effect in children
    validateTodoData(...unitsAsInt);
  }, [day, month, year, allDataCleared, todayCleared]);
 
  // bring the stored data of date, or if it doesn't exist create it
  // if data is cleared, clean-up and keep the state and localStorage in sync, otherwise old data will be seen
  const [currentTodoData, updateCurrentTodoData] = useReducer((prevData, { action, todoId }) => {
    switch (action) {
      case 'ADD': return {...prevData, [todoId]: ''}; // dummy value used, since values locally managed
      case 'REMOVE': {
        const latestData = {...prevData};
        delete latestData[todoId];
        return latestData;
      };
      case 'SYNC': return returnTodoData(...unitsAsInt);
    }
  }, {}); // only the tasks used, since values locally managed
  useEffect(() => {
    updateCurrentTodoData({ action: 'SYNC' });
  }, [day, month, year, allDataCleared, todayCleared]);

  // for rendering todos
  const todoOrderRef = useRef([]);
  const currentTodoTasks = Object.keys(currentTodoData);

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
      <CreateTodo { ...{unitsAsInt, updateCurrentTodoData, year, month, day} } />
      { currentTodoTasks.map((todoId, order) => {
        return (
          <Todo 
            // todoId is concatenated with date, so that if data changes, uncontrolled inputs will be reset
            key={year + month + day + todoId}
            { ...{updateCurrentTodoData, day, month, year, unitsAsInt, todoId, todayCleared, todoOrderRef, order, helperMenuClosersRef} }
          />
        );
      }) }
    </div>
  );
};
 
export default Checklist;

const CreateTodo = memo(({ unitsAsInt, updateCurrentTodoData, year, month, day }) => {
  // when mounts, focus on the create todo button; button preferred instead of input to avoid virtual keyboard
  const { refs: { createTodoRef, createTodoButtonRef }, helpers: { focusOnCreateTodoButton, resetValueOfCreateTodo } } = useContext(refContext);
  useEffect(() => {
    focusOnCreateTodoButton();
  }, []);

  const currentDate = useContext(currentDateContext);

  // currentTodoData should be in sync with localStorage entry
  function addToCurrentTodoDataAndSync(todoId) {
    addToTodoData(todoId, ...unitsAsInt);
    updateCurrentTodoData({ action: 'ADD', todoId});
  }

  // handlers
  function createTodoHandler(e) {
    e.preventDefault();
    const submittedFormData = new FormData(e.currentTarget);
    const formDataReadable = Object.fromEntries(submittedFormData.entries());
    const todoString = String(formDataReadable.todoName);
    const idAssigned = addToAllTodos(todoString); // should be in sync with localStorage entry
    if (currentDate.YMD === [year, month, day].join('-')) {
      // if currentDate removes/adds a todo, template should adapt
      addToTodosTemplate(idAssigned);
    }
    addToCurrentTodoDataAndSync(idAssigned);

    resetValueOfCreateTodo(); // value is reset on submit to make known value is added
  }

  return (
    <form onSubmit={createTodoHandler}>
      {/* create-todo gets focus, shouldn't be re-created (keys shouldn't be used here) */}
      <input id="create-todo" ref={createTodoRef} type="text" name="todoName" required
        title="task to add"
        autoComplete="off"
      />
      <button ref={createTodoButtonRef}>create</button>
    </form>
  )
});

const Todo = memo(({ updateCurrentTodoData, day, month, year, unitsAsInt, todoId, todayCleared, todoOrderRef, order, helperMenuClosersRef }) => {
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

  // todo value locally managed
  const [checked, setChecked] = useState(() => returnTodoTaskValue(...unitsAsInt, todoId) ?? 0); // can be null
  useEffect(() => {
    // can be null due to effect executing later than validation; fallback added to avoid "changing to uncontrolled"
    // in which case, after effect executes todo will unmount
    setChecked(returnTodoTaskValue(...unitsAsInt, todoId) ?? 0);
  }, [todayCleared]); // if today gets cleared, localChecked should adapt
  
  // todo description (allTodos[todoId]) locally managed
  const [todoDescription, setTodoDescription] = useState(() => returnTodoDescription(todoId));

  // currentTodoData should be in sync with localStorage entry
  function removeFromCurrentTodoDataAndSync(todoId) {
    removeFromTodoData(todoId, ...unitsAsInt);
    updateCurrentTodoData({ action: 'REMOVE', todoId});
  }
  // for performance optimization, todoState locally managed, hence only in sync with localStorgae (not with currentTodoData)
  function updateAndSyncTodoState(todoIdUpdate, checked) {
    updateTodoState(todoIdUpdate, checked, ...unitsAsInt);
  }

  // todoDescription should be in sync with localStorage entry
  function updateTodoStringAndSync(todoIdToUpdate, todoString) {
    updateTodoString(todoIdToUpdate, todoString);
    setTodoDescription(todoString);
  }

  // handlers
  function removeFromTodoHandler(e) {
    const todoIdToRemove = e.currentTarget.dataset.idToRemove;
    if (currentDate.YMD === [year, month, day].join('-')) {
      // if currentDate removes/adds a todo, template should adapt
      removeFromTodosTemplate(todoIdToRemove);
    }
    removeFromCurrentTodoDataAndSync(todoIdToRemove);

    focusWhenHelperMenuCloses(); // move focus to the nearest element
  }
  function updateTodoStateHandler(e) {
    const todoIdUpdate = e.currentTarget.dataset.idToUpdate;
    // boolean converted into 0 and 1 to save memory
    const checked = Number(e.currentTarget.checked);
    updateAndSyncTodoState(todoIdUpdate, checked);

    setChecked(checked);
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
        <p className="main-item">{todoDescription}</p>
        <input name="todo-state" type="checkbox" data-id-to-update={todoId} onChange={updateTodoStateHandler} checked={checked}
          title={`Mark as ${!checked ? 'done' : 'undone'}.`}
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
      <TodoHelpers { ...{todoId, updateTodoStringHandler, removeFromTodoHandler, closeHelperMenu, helperMenuClosersRef} } />
      : false }
    </div>
  );
});

const TodoHelpers = ({ todoId, updateTodoStringHandler, removeFromTodoHandler, closeHelperMenu, helperMenuClosersRef }) => {
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

// TODO: Localize state even further
// instead of initializing a local state to a prop, try localizing the prop
// for example, instead of getting "checked" from the parent, which is a more error prone way, get it locally using Effect
// this way memoization will be easier, errors related to prop changing after initialization won't happen