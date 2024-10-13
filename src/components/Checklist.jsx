import { memo, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";

// font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
const MemoizedFontAwesomeIcon = memo((props) => <FontAwesomeIcon {...props} />);

// contexts
import { currentDateContext } from "../providers/CurrentDateProvider";
import { allDataClearedContext } from "../providers/AllDataClearedProvider";
import { requestedDateValidatedContext } from "../providers/RequestedDateValidatedProvider";
import { todayClearedContext } from "../providers/TodayClearedProvider";
import { refContext } from "../providers/RefProvider";

// helpers
import { addToTodosTemplate, removeFromTodosTemplate, updateTypeOnTodosTemplate } from "../helpers/todosTemplateHelpers";
import { addToAllTodos, updateTodoString, returnCachedTodoDescription } from "../helpers/allTodosHelpers";
import { returnTodoData, validateTodoData, addToTodoData, removeFromTodoData, updateTodoValue, updateTodoType } from "../helpers/todoDataHelpers";
import { dayMonthTruncFormatter, weekdayDayMonthFormatter } from "../helpers/validateUnitsFromDate";
import { shouldUseAutoFocus } from "../helpers/keyboardDetection";
import { capitalizeString } from "../helpers/utils";

// custom hooks
import changeDocumentTitle from "../custom-hooks/changeDocumentTitle";

const mainTitle = 'Checklist'; // will be put in document.title
const addSubtitleToDocumentTitle = changeDocumentTitle.bind(globalThis, mainTitle);

const Checklist = () => {
  const { year, month, day } = useContext(requestedDateValidatedContext);
  const { allDataCleared } = useContext(allDataClearedContext); // when changes, new data will be brought
  const { todayCleared } = useContext(todayClearedContext); // when changes, new data will be brought

  const dateRequested = new Date([year, month, day].join('-'));

  // converted into numbers so that they are considered array indexes
  const monthAsInt = parseInt(month, 10);
  const unitsAsInt = useMemo(() => [parseInt(year, 10), monthAsInt, parseInt(day, 10)], [day, month, year]); // used as dependency

  addSubtitleToDocumentTitle(dayMonthTruncFormatter.format(dateRequested)); // adding date to the title
  
  // for closing all helper menus
  const helperMenuClosersRef = useRef({});
  function closeAllHelpers() {
    Object.values(helperMenuClosersRef.current).forEach((closer) => closer());
  }

  // state updater created in Todos passed to its sibling (= CreateTodo) using ref
  const refForUpdateCurrentTodoData = useRef();

  return (<div id="checklist" className="column-container" tabIndex="-1"
    // keydown preferred, so that when browser popup gets closed, possible keyUps don't trigger closing
    onKeyDown={(e) => { if (e.key === 'Escape') closeAllHelpers(); }}
  >
    <h1><time dateTime={`${year}-${month}-${day}`}>{weekdayDayMonthFormatter.format(dateRequested)}</time></h1>
    <CreateTodo { ...{unitsAsInt, year, month, day, refForUpdateCurrentTodoData} } />
    {/* with key: re-create State / re-use Effect, so that the logic is sequential and race conditions are avoided */}
    {/* if data is cleared, clean-up and keep the state and localStorage in sync, otherwise old data will be seen */}
    <Todos key={ [unitsAsInt, allDataCleared, todayCleared].join('-') } 
      { ...{day, month, year, unitsAsInt, helperMenuClosersRef, refForUpdateCurrentTodoData} }
    />
  </div>);
};
 
export default Checklist;

const CreateTodo = memo(({ unitsAsInt, year, month, day, refForUpdateCurrentTodoData }) => {
  // when mounts, focus on the create todo button; button preferred instead of input to avoid virtual keyboard
  const { refs: { createTodoRef }, helpers: { resetValueOfCreateTodo } } = useContext(refContext);

  const currentDate = useContext(currentDateContext);
  const isToday = currentDate.YMD === [year, month, day].join('-');

  // currentTodoData should be in sync with localStorage entry
  function addToCurrentTodoDataAndSync(todoIdToAdd) {
    addToTodoData(todoIdToAdd, ...unitsAsInt);
    refForUpdateCurrentTodoData.current({ action: 'ADD', todoId: todoIdToAdd });
  }

  // handlers
  function createTodoHandler(e) {
    e.preventDefault();
    const submittedFormData = new FormData(e.currentTarget);
    const formDataReadable = Object.fromEntries(submittedFormData.entries());
    const todoString = String(formDataReadable.todoName);
    const idAssigned = addToAllTodos(todoString); // should be in sync with localStorage entry
    if (isToday) { // if currentDate removes/adds a todo, template should adapt
      addToTodosTemplate(idAssigned, 'checkbox');
    }
    addToCurrentTodoDataAndSync(idAssigned);

    resetValueOfCreateTodo(); // value is reset on submit to make known value is added
  }

  return (<form onSubmit={createTodoHandler}>
    {/* create-todo gets focus, shouldn't be re-created (keys shouldn't be used here) */}
    <input autoFocus={shouldUseAutoFocus} id="create-todo" ref={createTodoRef} type="text" name="todoName" required
      title="task to add"
      autoComplete="off"
    />
    <button>create</button>
  </form>);
});

const Todos = ( {day, month, year, unitsAsInt, helperMenuClosersRef, refForUpdateCurrentTodoData} ) => {
  // localStorage entry cached to avoid parsing; used to initialize local states, avoiding hoisting the state up and re-rendering
  const cachedTodoData = useRef();

  // only the tasks used, since values locally managed
  const [currentTodoData, updateCurrentTodoData] = useReducer(reducerForCurrrentTodoData, {}, reducerForCurrrentTodoData);
  function reducerForCurrrentTodoData (prevData, { action = 'SYNC', todoId } = {}) {
    switch (action) {
      // keeping cache in sync; value and type used for initialization
      case 'ADD': return cachedTodoData.current = { ...prevData, [todoId]: { value: '', type: 'checkbox' } };
      case 'REMOVE': {
        const latestData = {...prevData};
        delete latestData[todoId];
        return cachedTodoData.current = latestData; // keeping cache in sync
      };
      case 'SYNC': {
        // syncing with localStorage entry initally or when the key changes
        validateTodoData(...unitsAsInt); // if it doesn't exist create it
        return cachedTodoData.current = returnTodoData(...unitsAsInt); // keeping cache in sync
      };
    }
  }

  useEffect(() => {
    refForUpdateCurrentTodoData.current = updateCurrentTodoData;
  }, []);

  // for rendering todos
  const currentTodoTasks = Object.keys(currentTodoData); // by default, components are rendered in ascending order by ID
  // TODO: ordering can be changed by changing the way this array is created, without avoiding memoization of components

  return (<ul className="column-container" id="todos">
    { currentTodoTasks.map((todoId) => (
      <Todo 
        // since parent has a key with date, it's unnecessary to pass it here; when date changes uncontrolled inputs will reset
        key={todoId}
        { ...{updateCurrentTodoData, day, month, year, unitsAsInt, todoId, helperMenuClosersRef, cachedTodoData} }
      />)
    ) }
  </ul>);
};
 
const Todo = memo(({ updateCurrentTodoData, day, month, year, unitsAsInt, todoId, helperMenuClosersRef, cachedTodoData }) => {
  const currentDate = useContext(currentDateContext);
  const isToday = currentDate.YMD === [year, month, day].join('-');

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

  // todo value and type locally managed
  const [todoValue, setTodoValue] = useState(cachedTodoData.current[todoId].value);
  const [todoType, setTodoType] = useState(cachedTodoData.current[todoId].type);

  // todo description (allTodos[todoId]) locally managed
  const [todoDescription, setTodoDescription] = useState(() => returnCachedTodoDescription(todoId));

  // currentTodoData should be in sync with localStorage entry
  function removeFromCurrentTodoDataAndSync() {
    removeFromTodoData(todoId, ...unitsAsInt);
    updateCurrentTodoData({ action: 'REMOVE', todoId });
  }

  // todoDescription should be in sync with localStorage entry
  function updateTodoStringAndSync(todoString) {
    updateTodoString(todoId, todoString);
    setTodoDescription(todoString);
  }
  // for performance optimization, todoValue locally managed, hence only in sync with localStorage (not with currentTodoData)
  function updateAndSyncTodoValue(value) {
    updateTodoValue(todoId, ...unitsAsInt, value);
    setTodoValue(value);
  }
  function resetAndSyncTodoValue() {
    updateAndSyncTodoValue('');
  }
  // for performance optimization, todoType locally managed
  function updateAndSyncTodoType(type) {
    updateTodoType(todoId, ...unitsAsInt, type);
    setTodoType(type);
  }

  // handlers
  function removeFromTodoHandler(e) {
    if (isToday) { // if currentDate removes/adds a todo, template should adapt
      removeFromTodosTemplate(todoId);
    }
    removeFromCurrentTodoDataAndSync();

    focusWhenHelperMenuCloses(); // move focus to the nearest element
  }
  function updateTodoCheckedHandler(e) {
    const checked = Number(e.currentTarget.checked); // boolean converted into 0 and 1 to save memory
    updateAndSyncTodoValue(checked);
  }
  function updateTodoValueHandler(e) {
    const newValue = e.currentTarget.value;
    updateAndSyncTodoValue(newValue);
  }
  function updateTodoTypeHandler(e) {
    const newType = e.currentTarget.selectedOptions[0].value;
    if (isToday) { // if type changes, template should adapt
      updateTypeOnTodosTemplate(todoId, newType);
    }
    updateAndSyncTodoType(newType);

    resetAndSyncTodoValue(); // it's reset so that old value doesn't appear (otherwise checkbox => text: innerText === 1)

    closeHelperMenu(); // close the helper menu
    focusOnCurrentMenuToggler(); // move focus to the current todoToggler
  }
  function updateTodoStringHandler(e) {
    e.preventDefault();
    const submittedFormData = new FormData(e.currentTarget);
    const formDataReadable = Object.fromEntries(submittedFormData.entries());
    const todoString = String(formDataReadable.todoName);
    updateTodoStringAndSync(todoString);
    
    closeHelperMenu(); // close the helper menu
    focusOnCurrentMenuToggler(); // move focus to the current todoToggler
  }

  return (<li className="column-container todo" ref={todoRef}>
    <div className="main-with-others-grouped-row-container">
      <h3 className="main-item styled-as-p">{todoDescription}</h3>
      <div className="helper-wrapper flex-container"> {/* bundles the elements so that they get wrapped at once */}
        <TodoState { ...{todoValue, todoType, updateTodoCheckedHandler, updateTodoValueHandler} } />
        <button
          className="toggler-with-icon helper-menu-toggler"
          onClick={() => toggleHelperState()}
          title={helperState ? "Close helpers." : "Open helpers."}
          type="button"
          aria-haspopup="menu"
          aria-expanded={helperState}
        >
          <MemoizedFontAwesomeIcon icon={helperState ? faXmark : faBars} />
       </button>
      </div>
    </div>
    { helperState ?
    <TodoHelpers { ...{todoId, updateTodoStringHandler, todoType, updateTodoTypeHandler, removeFromTodoHandler, closeHelperMenu, helperMenuClosersRef} } />
    : false }
  </li>);
});

const TodoState = ({ todoValue, todoType, updateTodoCheckedHandler, updateTodoValueHandler }) => {
  const isTypeCheckbox = todoType === 'checkbox';
  const isTypeNumber = todoType === 'number';
  return (<input name="todo-state" type={todoType}
    onChange={isTypeCheckbox ? updateTodoCheckedHandler : updateTodoValueHandler}
    { ...(isTypeCheckbox ? {checked: todoValue} : {value: todoValue}) } // checkboxes use 'checked' attribute instead of 'value'
    { ...(isTypeNumber ? {step: 'any'} : {}) }
    title={isTypeCheckbox
      ? `Mark as ${!todoValue ? 'done' : 'undone'}.`
      : `Enter ${capitalizeString(todoType)}.`
    }
  />);
};

const TodoHelpers = ({ todoId, updateTodoStringHandler, todoType, updateTodoTypeHandler, removeFromTodoHandler, closeHelperMenu, helperMenuClosersRef }) => {
  useEffect(() => { // store the helperMenu closer in ref, will be used to close all at once
    helperMenuClosersRef.current[todoId] = closeHelperMenu; // since always set to false, old func with old scope is ok to use
    return () => { delete helperMenuClosersRef.current[todoId]; };
  }, [])

  // when any of the helpers are used, helper menu should be closed
  // focus should be managed when menu closes or opens
  return (<div className="row-container helpers" role="menu" aria-orientation="horizontal">
    <form onSubmit={updateTodoStringHandler}>
      {/* focus on first focusable item when mounts */}
      <input autoFocus type="text" name="todoName" required 
        title="new task description"
      />
      <button>update todo</button>
    </form>
    <select onChange={updateTodoTypeHandler} value={todoType}>
      <option value="checkbox">Checkbox</option>
      <option value="text">Text</option>
      <option value="number">Number</option>
      <option value="time">Time</option>
    </select>
    <button onClick={removeFromTodoHandler} type="button">remove</button>
  </div>);
};
