import { memo, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";

// font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

// contexts
import { currentDateContext } from "../providers/CurrentDateProvider";
import { allDataClearedContext } from "../providers/AllDataClearedProvider";
import { requestedDateValidatedContext } from "../providers/RequestedDateValidatedProvider";
import { todayClearedContext } from "../providers/TodayClearedProvider";
import { refContext, focusOnFirstItemFromRef } from "../providers/RefProvider";

// helpers
import { addToTodosTemplate, removeFromTodosTemplate } from "../helpers/todosTemplateHelpers";
import { addToAllTodos, updateTodoString, returnTodoDescription } from "../helpers/allTodosHelpers";
import { returnTodoData, validateTodoData, addToTodoData, removeFromTodoData, updateTodoState, returnTodoTaskValue } from "../helpers/todoDataHelpers";
import { monthNames } from "../helpers/validateUnitsFromDate";

const Checklist = () => {
  const { year, month, day } = useContext(requestedDateValidatedContext);
  const { allDataCleared } = useContext(allDataClearedContext); // when changes, new data will be brought
  const { todayCleared } = useContext(todayClearedContext); // when changes, new data will be brought

  // converted into numbers so that they are considered array indexes; memoized since used as dependency
  const unitsAsInt = useMemo(() => [parseInt(year, 10), parseInt(month, 10), parseInt(day, 10)], [day, month, year]);

  // re-create State / re-use Effect, so that the logic is sequential and race conditions are avoided
  // if data is cleared, clean-up and keep the state and localStorage in sync, otherwise old data will be seen
  return (<div id="checklist" className="column-container" tabIndex="-1"
    // keydown preferred, so that when browser popup gets closed, possible keyUps don't trigger closing
    onKeyDown={(e) => { if (e.key === 'Escape') closeAllHelpers(); }}
  >
    <h1><time dateTime={`${year}-${month}-${day}`}>{`${day} ${monthNames[parseInt(month, 10)]} ${year}`}</time></h1>
    <CreateTodo { ...{unitsAsInt, updateCurrentTodoData, year, month, day} } />
    <Todos key={ [unitsAsInt, allDataCleared, todayCleared].join('-') } 
      { ...{day, month, year, unitsAsInt} }
    />
  </div>);
};
 
export default Checklist;

const Todos = ( {day, month, year, unitsAsInt} ) => {
  // only the tasks used, since values locally managed
  const [currentTodoData, updateCurrentTodoData] = useReducer(reducerForCurrrentTodoData, {}, reducerForCurrrentTodoData);
  function reducerForCurrrentTodoData (prevData, { action = 'SYNC', todoId } = {}) {
    switch (action) {
      case 'ADD': return {...prevData, [todoId]: ''}; // dummy value used, since values locally managed
      case 'REMOVE': {
        const latestData = {...prevData};
        delete latestData[todoId];
        return latestData;
      };
      case 'SYNC': {
        // syncing with localStorage entry initally or when the key changes
        validateTodoData(...unitsAsInt); // if it doesn't exist create it
        return returnTodoData(...unitsAsInt);
      };
    }
  }

  // for rendering todos
  const currentTodoTasks = Object.keys(currentTodoData); // by default, components are rendered in ascending order by ID
  // TODO: ordering can be changed by changing the way this array is created, without avoiding memoization of components

  // for closing all helper menus
  const helperMenuClosersRef = useRef({});
  function closeAllHelpers() {
    Object.values(helperMenuClosersRef.current).forEach((closer) => closer());
  }

  return (<ul className="column-container" id="todos">
    { currentTodoTasks.map((todoId) => (
      <Todo 
        // since parent has a key with date, it's unnecessary to pass it here; when date changes uncontrolled inputs will reset
        key={todoId}
        { ...{updateCurrentTodoData, day, month, year, unitsAsInt, todoId, helperMenuClosersRef} }
      />)
    ) }
  </ul>);
};
 
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
    updateCurrentTodoData({ action: 'ADD', todoId });
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

  return (<form onSubmit={createTodoHandler}>
    {/* create-todo gets focus, shouldn't be re-created (keys shouldn't be used here) */}
    <input id="create-todo" ref={createTodoRef} type="text" name="todoName" required
      title="task to add"
      autoComplete="off"
    />
    <button ref={createTodoButtonRef}>create</button>
  </form>);
});

const Todo = memo(({ updateCurrentTodoData, day, month, year, unitsAsInt, todoId, helperMenuClosersRef }) => {
  const currentDate = useContext(currentDateContext);

  // for easier focus management
  const todoRef = useRef();

  // for the appearance of helpers (individually)
  const [helperState, setHelperState] = useState(false); // by default helper closed
  function toggleHelperState() {
    setHelperState(!helperState);
  }
  function closeHelperMenu() {
    setHelperState(false);
  }
  const { helpers: { focusOnCreateTodo } } = useContext(refContext);
  function focusOnCurrentMenuToggler() {
    const currentTodo = todoRef.current;
    currentTodo.querySelector('.helper-menu-toggler').focus();
  }
  function focusWhenHelperMenuCloses() {
    const currentTodo = todoRef.current;
    const nextTodo = currentTodo.nextElementSibling;
    if (nextTodo) return nextTodo.querySelector('.helper-menu-toggler').focus(); // first try next, since replaces the removed todo
    const prevTodo = currentTodo.previousElementSibling;
    if (prevTodo) return prevTodo.querySelector('.helper-menu-toggler').focus(); // then try previous
    focusOnCreateTodo(); // last resort
  }

  // todo value locally managed
  const [checked, setChecked] = useState(() => returnTodoTaskValue(...unitsAsInt, todoId));
  
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
    focusOnCurrentMenuToggler(); // move focus to the current todoToggler
  }

  return (<li className="column-container todo" ref={todoRef}>
    <div className="main-with-others-grouped-row-container">
      <h3 className="main-item styled-as-p">{todoDescription}</h3>
      <input name="todo-state" type="checkbox" data-id-to-update={todoId} onChange={updateTodoStateHandler} checked={checked}
        title={`Mark as ${!checked ? 'done' : 'undone'}.`}
      />
      <button
        className="toggler-with-icon helper-menu-toggler"
        onClick={() => toggleHelperState()}
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
  </li>);
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

  return (<div className="row-container helpers" ref={helperMenuRef} role="menu" aria-orientation="horizontal">
    {/* when any of the helpers are used, helper menu should be closed */}
    {/* focus should be managed when menu closes or opens */}
    <form data-id-to-update={todoId} onSubmit={updateTodoStringHandler}>
      <input size="10" type="text" name="todoName" required 
        title="new task description"
      />
      <button>update todo</button>
    </form>
    <button onClick={removeFromTodoHandler} type="button" data-id-to-remove={todoId}>remove</button>
  </div>);
};

// TODO: validation happening on parent, child locally retrieving data is error prone
// state might be hoisted