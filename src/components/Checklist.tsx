import {
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

// font awesome
import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
const MemoizedFontAwesomeIcon = memo((props: FontAwesomeIconProps) => (
  <FontAwesomeIcon {...props} />
));

// contexts
import { useCurrentDateContext } from '../providers/CurrentDateProvider';
import { useAllDataClearedContext } from '../providers/AllDataClearedProvider';
import { useRequestedDateValidatedContext } from '../providers/RequestedDateValidatedProvider';
import { useTodayClearedContext } from '../providers/TodayClearedProvider';
import {
  focusFromRef,
  focusOnFirstItemFromRef,
  useRefContext,
} from '../providers/RefProvider';

// helpers
import {
  cachedTodosTemplate,
  addToTodosTemplate,
  removeFromTodosTemplate,
  isTodoInTodosTemplate,
  frequencyNever,
  updateFrequencyOnTodosTemplate,
  type Frequency,
  type Weekday,
  type BooleanAsNum,
  updateValueOnTodosTemplate,
} from '../helpers/todosTemplateHelpers';
import {
  cachedAllTodos,
  addToAllTodos,
  updateTodoDescription,
  updateTodoType,
  type ID,
  type TodoType,
  type TodoValueType,
  type TodoTypeValueMap,
  type CheckboxValueType,
} from '../helpers/allTodosHelpers';
import {
  returnTodoData,
  validateTodoData,
  addToTodoData,
  removeFromTodoData,
  updateTodoValue,
  type DayTodoData,
} from '../helpers/todoDataHelpers';
import {
  dayMonthTruncFormatter,
  returnWeekday,
  returnWeekdayFromSunday,
  weekdayDayMonthFormatter,
} from '../helpers/validateUnitsFromDate';
import { shouldUseAutoFocus } from '../helpers/keyboardDetection';
import {
  assertCondition,
  avoidNaNWithEmptyString,
  capitalizeString,
  isArrTruthy,
} from '../helpers/utils';

// custom hooks
import useDocumentTitle from '../custom-hooks/useDocumentTitle';

// types
type HelperMenuClosers = Record<ID, () => void>;

/** will be put in document.title */
const mainTitle = 'Checklist';
const addSubtitleToDocumentTitle = useDocumentTitle.bind(globalThis, mainTitle);

export default function Checklist() {
  const { year, month, day } = useRequestedDateValidatedContext();
  assertCondition(
    year !== undefined && month !== undefined && day !== undefined,
    'Checklist only renders if url includes a year, month and a day',
  );
  const { allDataCleared } = useAllDataClearedContext(); // when changes, new data will be brought
  const { todayCleared } = useTodayClearedContext(); // when changes, new data will be brought

  const dateRequested = new Date([year, month, day].join('-'));

  // converted into numbers so that they are considered array indexes
  /** @todo rename to unitsYMDAsInt */
  const unitsAsInt: [number, number, number] = useMemo(
    () => [Number(year), Number(month), Number(day)],
    [day, month, year],
  ); // used as dependency

  addSubtitleToDocumentTitle(dayMonthTruncFormatter.format(dateRequested)); // adding date to the title

  // for closing all helper menus
  const helperMenuClosersRef = useRef<HelperMenuClosers>({});
  function closeAllHelpers() {
    Object.values(helperMenuClosersRef.current).forEach(
      (closer: HelperMenuClosers[ID]) => {
        closer();
      },
    );
  }

  // updater in Todos passed to its sibling (= CreateTodo) using ref; hoisting avoided since Todos has a special key
  const refForUpdateCurrentTodoData = useRef<React.Dispatch<Action>>(null);

  return (
    <div
      id="checklist"
      className="column-container"
      tabIndex={-1}
      // keydown preferred, so that when browser popup gets closed, possible keyUps don't trigger closing
      onKeyDown={(e) => {
        if (e.key === 'Escape') closeAllHelpers();
      }}
    >
      <h1>
        <time dateTime={`${year}-${month}-${day}`}>
          {weekdayDayMonthFormatter.format(dateRequested)}
        </time>
      </h1>
      <CreateTodo
        {...{ unitsAsInt, year, month, day, refForUpdateCurrentTodoData }}
      />
      <Todos
        // with key: re-create State / re-use Effect, so that the logic is sequential and race conditions are avoided
        // if data is cleared, clean-up and keep the state and localStorage in sync, otherwise old data will be seen
        key={[unitsAsInt, allDataCleared, todayCleared].join('-')}
        {...{
          day,
          month,
          year,
          unitsAsInt,
          helperMenuClosersRef,
          refForUpdateCurrentTodoData,
        }}
      />
    </div>
  );
}

interface CreateTodoProps {
  unitsAsInt: [number, number, number];
  year: string;
  month: string;
  day: string;
  refForUpdateCurrentTodoData: React.RefObject<React.Dispatch<Action>>;
}
const CreateTodo = memo(
  ({
    unitsAsInt,
    year,
    month,
    day,
    refForUpdateCurrentTodoData,
  }: CreateTodoProps) => {
    // when mounts, focus on the create todo button; button preferred instead of input to avoid virtual keyboard
    const {
      refs: { createTodoRef },
    } = useRefContext();

    const currentDate = useCurrentDateContext();
    const isToday = currentDate.YMD === [year, month, day].join('-');

    // currentTodoData should be in sync with localStorage entry
    function addToCurrentTodoDataAndSync(todoIdToAdd: ID) {
      assertCondition(
        refForUpdateCurrentTodoData.current !== null,
        'ref will be initialized before updater can be used since it runs through user interaction',
      );
      addToTodoData(todoIdToAdd, ...unitsAsInt);
      refForUpdateCurrentTodoData.current({
        action: 'ADD',
        todoId: todoIdToAdd,
      });
    }

    // handlers
    function createTodoHandler(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const submittedFormData = new FormData(e.currentTarget);
      const formDataReadable = Object.fromEntries(submittedFormData.entries());
      const todoDescription = formDataReadable['todo-description'];
      assertCondition(
        typeof todoDescription === 'string',
        'todo-description is a text input so the value is always a string',
      );
      const idAssigned = addToAllTodos(todoDescription); // should be in sync with localStorage entry
      if (isToday) addToTodosTemplate(idAssigned); // if it's today add it to the template
      addToCurrentTodoDataAndSync(idAssigned);

      e.currentTarget.reset(); // value is reset on submit to make known value is added
    }

    return (
      <form onSubmit={createTodoHandler}>
        {/* create-todo gets focus, shouldn't be re-created (keys shouldn't be used here) */}
        <input
          autoFocus={shouldUseAutoFocus}
          id="create-todo"
          ref={createTodoRef}
          type="text"
          name="todo-description"
          required
          title="task to add"
          autoComplete="off"
        />
        <button>create</button>
      </form>
    );
  },
);

interface TodosProps {
  unitsAsInt: [number, number, number];
  year: string;
  month: string;
  day: string;
  helperMenuClosersRef: React.MutableRefObject<HelperMenuClosers>;
  refForUpdateCurrentTodoData: React.RefObject<React.Dispatch<Action>>;
}

type Action =
  | { action: 'SYNC'; todoId?: never; todoType?: never }
  | { action: 'ADD'; todoId: ID; todoType?: TodoType }
  | { action: 'REMOVE'; todoId: ID; todoType?: never };

function Todos({
  day,
  month,
  year,
  unitsAsInt,
  helperMenuClosersRef,
  refForUpdateCurrentTodoData,
}: TodosProps) {
  // localStorage entry cached to avoid parsing; used to initialize local states, avoiding hoisting the state up and re-rendering
  const cachedTodoData = useRef<DayTodoData>({});

  // only the tasks used, since values locally managed
  const [currentTodoData, updateCurrentTodoData] = useReducer(
    reducerForCurrentTodoData,
    {},
    (init) => reducerForCurrentTodoData(init, { action: 'SYNC' }),
  );
  function reducerForCurrentTodoData(
    prevData: DayTodoData,
    { action, todoId, todoType = 'checkbox' }: Action,
  ): DayTodoData {
    switch (action) {
      // keeping cache in sync; value used for initialization
      case 'ADD': {
        const initialValue: TodoValueType = (() => {
          switch (todoType) {
            case 'number':
            case 'checkbox':
              return 0;
            case 'time':
            case 'text':
              return '';
          }
        })();
        return (cachedTodoData.current = {
          ...prevData,
          [todoId]: { value: initialValue },
        });
      }
      case 'REMOVE': {
        const latestData = { ...prevData };
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete latestData[todoId];
        return (cachedTodoData.current = latestData); // keeping cache in sync
      }
      case 'SYNC': {
        // syncing with localStorage entry initially or when the key changes
        validateTodoData(...unitsAsInt, returnWeekday(year, month, day)); // if it doesn't exist create it
        return (cachedTodoData.current = returnTodoData(...unitsAsInt)); // keeping cache in sync
      }
    }
  }

  useImperativeHandle(
    refForUpdateCurrentTodoData,
    () => updateCurrentTodoData,
    [],
  );

  // for rendering todos
  /** @todo ordering can be changed by changing the way this array is created, without preventing memoization of components */
  const currentTodoTasks = Object.keys(currentTodoData).map<ID>(Number); // by default, components are rendered in ascending order by ID

  return (
    <ul className="column-container" id="todos">
      {currentTodoTasks.map((todoId) => (
        <Todo
          // since parent has a key with date, it's unnecessary to pass it here; when date changes uncontrolled inputs will reset
          key={todoId}
          {...{
            updateCurrentTodoData,
            day,
            month,
            year,
            unitsAsInt,
            todoId,
            helperMenuClosersRef,
            cachedTodoData,
          }}
        />
      ))}
    </ul>
  );
}

interface TodoProps {
  updateCurrentTodoData: React.Dispatch<Action>;
  todoId: ID;
  helperMenuClosersRef: React.MutableRefObject<HelperMenuClosers>;
  cachedTodoData: React.MutableRefObject<DayTodoData>;
  unitsAsInt: [number, number, number];
  year: string;
  month: string;
  day: string;
}
const Todo = memo(
  ({
    updateCurrentTodoData,
    day,
    month,
    year,
    unitsAsInt,
    todoId,
    helperMenuClosersRef,
    cachedTodoData,
  }: TodoProps) => {
    const currentDate = useCurrentDateContext();
    const isToday = currentDate.YMD === [year, month, day].join('-');

    // for easier focus management
    const todoRef = useRef<HTMLLIElement>(null);

    // for the appearance of helpers (individually)
    const [helperState, setHelperState] = useState(false); // by default helper closed
    function toggleHelperState() {
      setHelperState(!helperState);
    }
    const closeHelperMenu = useCallback(() => {
      setHelperState(false);
    }, []); // memoized since used as a dependency
    const {
      helpers: { focusOnCreateTodo },
    } = useRefContext();
    function focusOnCurrentMenuToggler() {
      const currentTodo = todoRef.current;
      if (currentTodo !== null)
        currentTodo.querySelector<HTMLElement>('.helper-menu-toggler')?.focus();
    }
    function focusWhenHelperMenuCloses() {
      const currentTodo = todoRef.current;
      if (currentTodo === null) return;
      const nextTodo = currentTodo.nextElementSibling;
      if (nextTodo) {
        nextTodo.querySelector<HTMLElement>('.helper-menu-toggler')?.focus();
        return;
      } // first try next, since replaces the removed todo
      const prevTodo = currentTodo.previousElementSibling;
      if (prevTodo) {
        prevTodo.querySelector<HTMLElement>('.helper-menu-toggler')?.focus(); // then try previous
        return;
      }
      focusOnCreateTodo(); // last resort
    }

    // todo value, type and description locally managed
    const [todoValue, setTodoValue] = useState<TodoValueType>(
      cachedTodoData.current[todoId].value,
    );
    const [todoType, setTodoType] = useState<TodoType>(
      cachedAllTodos[todoId].type,
    );
    const [todoDescription, setTodoDescription] = useState(
      cachedAllTodos[todoId].description,
    );

    // currentTodoData should be in sync with localStorage entry
    function removeFromCurrentTodoDataAndSync() {
      removeFromTodoData(todoId, ...unitsAsInt);
      updateCurrentTodoData({ action: 'REMOVE', todoId });
    }

    // todoDescription should be in sync with localStorage entry
    function updateTodoDescriptionAndSync(todoDescription: string) {
      updateTodoDescription(todoId, todoDescription);
      setTodoDescription(todoDescription);
    }
    // for performance optimization, todoValue locally managed, hence only in sync with localStorage (not with currentTodoData)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
    function updateAndSyncTodoValue<Type extends TodoType = never>(
      // make sure value is according to the type, and type is always passed
      value: NoInfer<TodoTypeValueMap[Type]>,
    ) {
      updateTodoValue<Type>(todoId, ...unitsAsInt, value);
      setTodoValue(value);
    }
    function resetAndSyncTodoValue(newType: TodoType) {
      switch (newType) {
        case 'number':
        case 'checkbox':
          updateAndSyncTodoValue<typeof newType>(0);
          break;
        case 'time':
        case 'text':
          updateAndSyncTodoValue<typeof newType>('');
          break;
      }
    }
    // for performance optimization, todoType locally managed
    function updateAndSyncTodoType(type: TodoType) {
      updateTodoType(todoId, type);
      setTodoType(type);
    }

    // handlers
    function removeFromTodoHandler() {
      // also remove it from the template if it's there and if it's today
      // make sure it's today otherwise frequencyNever-todo can remove frequencyEveryday-todo
      if (isToday && isTodoInTodosTemplate(todoId))
        removeFromTodosTemplate(todoId); // if removed, frequency is never
      removeFromCurrentTodoDataAndSync();

      focusWhenHelperMenuCloses(); // move focus to the nearest element
    }
    function updateTodoValueHandler(e: React.ChangeEvent<HTMLInputElement>) {
      switch (todoType) {
        case 'checkbox': {
          const checked: CheckboxValueType = e.currentTarget.checked ? 1 : 0; // boolean converted into 0 and 1 to save memory
          updateAndSyncTodoValue<typeof todoType>(checked);
          break;
        }
        case 'number': {
          // keep NaN, render it as an empty string, so that value can be completely cleared
          // otherwise since React implements 'change' event as 'input', value cannot be cleared
          const number = e.currentTarget.valueAsNumber;
          updateAndSyncTodoValue<typeof todoType>(number);
          break;
        }
        case 'time':
        case 'text': {
          const value = e.currentTarget.value;
          updateAndSyncTodoValue<typeof todoType>(value);
          break;
        }
      }
    }
    function updateTodoTypeHandler(e: React.ChangeEvent<HTMLSelectElement>) {
      const newType = e.currentTarget.value as TodoType;
      updateAndSyncTodoType(newType);

      if (isTodoInTodosTemplate(todoId))
        updateValueOnTodosTemplate(todoId, newType);

      resetAndSyncTodoValue(newType); // it's reset so that old value doesn't appear (otherwise checkbox => text: innerText === 1)

      closeHelperMenu(); // close the helper menu
      focusOnCurrentMenuToggler(); // move focus to the current todoToggler
    }
    function updateTodoDescriptionHandler(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const submittedFormData = new FormData(e.currentTarget);
      const formDataReadable = Object.fromEntries(submittedFormData.entries());
      const todoDescription = formDataReadable['todo-description'];
      assertCondition(
        typeof todoDescription === 'string',
        'todo-description is a text input so the value is always a string',
      );
      updateTodoDescriptionAndSync(todoDescription);

      closeHelperMenu(); // close the helper menu
      focusOnCurrentMenuToggler(); // move focus to the current todoToggler
    }

    return (
      <li className="column-container todo" ref={todoRef}>
        <div className="main-with-others-grouped-row-container">
          <h3 className="main-item styled-as-p">{todoDescription}</h3>
          {/* bundles the elements so that they get wrapped at once */}
          <div className="helper-wrapper flex-container">
            <TodoState {...{ todoValue, todoType, updateTodoValueHandler }} />
            <button
              className="toggler-icon-only helper-menu-toggler"
              onClick={() => {
                toggleHelperState();
              }}
              title={helperState ? 'Close helpers.' : 'Open helpers.'}
              type="button"
              aria-haspopup="menu"
              aria-expanded={helperState}
            >
              <MemoizedFontAwesomeIcon icon={helperState ? faXmark : faBars} />
            </button>
          </div>
        </div>
        {helperState ? (
          <TodoHelpers
            {...{
              todoId,
              updateTodoDescriptionHandler,
              todoType,
              updateTodoTypeHandler,
              removeFromTodoHandler,
              closeHelperMenu,
              helperMenuClosersRef,
            }}
          />
        ) : (
          false
        )}
      </li>
    );
  },
);

interface TodoStateProps {
  todoValue: TodoValueType;
  todoType: TodoType;
  updateTodoValueHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
function TodoState({
  todoValue,
  todoType,
  updateTodoValueHandler,
}: TodoStateProps) {
  const inputProps = {
    type: todoType,
    name: 'todo-state',
    onChange: updateTodoValueHandler,
    title:
      todoType === 'checkbox'
        ? `Mark as ${!todoValue ? 'done' : 'undone'}.`
        : `Enter ${capitalizeString(todoType)}.`,
  };
  switch (todoType) {
    case 'checkbox':
      return <input {...inputProps} checked={Boolean(todoValue)} />;
    case 'number':
      return (
        <input
          {...inputProps}
          // reset the value if NaN, otherwise value cannot be fully cleared
          value={avoidNaNWithEmptyString(Number(todoValue))}
          step="any"
        />
      );
    case 'time':
    case 'text':
      return <input {...inputProps} value={String(todoValue)} />;
  }
}

interface TodoHelpersProps {
  todoId: ID;
  updateTodoDescriptionHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  todoType: TodoType;
  updateTodoTypeHandler: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  removeFromTodoHandler: () => void;
  closeHelperMenu: () => void;
  helperMenuClosersRef: React.MutableRefObject<HelperMenuClosers>;
}
function TodoHelpers({
  todoId,
  updateTodoDescriptionHandler,
  todoType,
  updateTodoTypeHandler,
  removeFromTodoHandler,
  closeHelperMenu,
  helperMenuClosersRef,
}: TodoHelpersProps) {
  useEffect(() => {
    // store the helperMenu closer in ref, will be used to close all at once
    const helperMenuClosers = helperMenuClosersRef.current;
    helperMenuClosers[todoId] = closeHelperMenu;
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete helperMenuClosers[todoId];
    };
  }, [closeHelperMenu, helperMenuClosersRef, todoId]);

  const [frequencyMenuState, setFrequencyMenuState] = useState(false);
  function toggleFrequencyMenuState() {
    setFrequencyMenuState(!frequencyMenuState);
  }
  const closeFrequencyMenu = useCallback(() => {
    setFrequencyMenuState(false);
  }, []); // memoized to avoid unnecessary re-attaching

  const frequencyMenuButtonRef = useRef<HTMLButtonElement>(null);
  function focusOnFrequencyMenuButton() {
    focusFromRef(frequencyMenuButtonRef);
  }

  // when any of the helpers are used, helper menu should be closed
  // focus should be managed when menu closes or opens
  return (
    <div
      className="row-container helpers"
      role="menu"
      aria-orientation="horizontal"
    >
      <form onSubmit={updateTodoDescriptionHandler}>
        {/* focus on first focusable item when mounts */}
        <input
          autoFocus
          type="text"
          name="todo-description"
          required
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
      <div className="frequency-menu-wrapper">
        <button
          type="button"
          ref={frequencyMenuButtonRef}
          className="toggler-text-and-icon"
          onClick={() => {
            toggleFrequencyMenuState();
          }}
          title={frequencyMenuState ? 'Close menu.' : 'Open menu.'}
          aria-haspopup="menu"
          aria-expanded={frequencyMenuState}
        >
          select days
          <MemoizedFontAwesomeIcon
            icon={frequencyMenuState ? faXmark : faBars}
          />
        </button>
        {frequencyMenuState ? (
          <FrequencyMenu
            {...{
              todoId,
              closeFrequencyMenu,
              frequencyMenuButtonRef,
              focusOnFrequencyMenuButton,
              todoType,
            }}
          />
        ) : (
          false
        )}
      </div>
      <button onClick={removeFromTodoHandler} type="button">
        remove
      </button>
    </div>
  );
}

interface FrequencyMenuProps {
  todoId: ID;
  closeFrequencyMenu: () => void;
  frequencyMenuButtonRef: React.RefObject<HTMLButtonElement>;
  focusOnFrequencyMenuButton: () => void;
  todoType: TodoType;
}
function FrequencyMenu({
  todoId,
  closeFrequencyMenu,
  frequencyMenuButtonRef,
  focusOnFrequencyMenuButton,
  todoType,
}: FrequencyMenuProps) {
  const [frequencyState, setFrequencyState] = useState(() =>
    isTodoInTodosTemplate(todoId)
      ? cachedTodosTemplate[todoId].frequency
      : frequencyNever,
  );

  function changeAndSyncFrequency(frequency: Frequency) {
    if (isArrTruthy(frequency)) {
      // frequency isn't never
      if (isTodoInTodosTemplate(todoId)) {
        updateFrequencyOnTodosTemplate(todoId, frequency); // if it exists just update it
      } else addToTodosTemplate(todoId, frequency, todoType); // if it doesn't exist already, add it
    } else removeFromTodosTemplate(todoId); // remove it if it's never ([0, 0, 0, 0, 0, 0, 0])

    setFrequencyState(frequency);
  }

  // handlers
  function toggleCheckedHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const dayIndex = Number(e.currentTarget.value) as Weekday;
    const dayState: BooleanAsNum = e.currentTarget.checked ? 1 : 0; // 1-0 used instead of true-false, to save space
    const newFrequency: Frequency = [...frequencyState];
    newFrequency[dayIndex] = dayState;
    changeAndSyncFrequency(newFrequency);
  }

  // focus management
  const frequencyMenuRef = useRef<HTMLUListElement>(null);
  useLayoutEffect(() => {
    focusOnFirstItemFromRef(frequencyMenuRef); // on mount focus on first element
  }, []);
  useEffect(() => {
    function closeFrequencyMenuOnFocusOutHandler(e: FocusEvent) {
      const menuElement = frequencyMenuRef.current;
      if (!menuElement) return; // already closed
      if (e.relatedTarget === frequencyMenuButtonRef.current) return; // menu closing when toggler gets focus causes re-opening
      if (
        !(
          e.relatedTarget instanceof Node &&
          menuElement.contains(e.relatedTarget)
        )
      )
        closeFrequencyMenu();
    }

    document.addEventListener('focusout', closeFrequencyMenuOnFocusOutHandler);
    return () => {
      document.removeEventListener(
        'focusout',
        closeFrequencyMenuOnFocusOutHandler,
      );
    };
  }, [frequencyMenuRef, closeFrequencyMenu, frequencyMenuButtonRef]);

  // placement
  const {
    refs: { footerRef },
  } = useRefContext();
  useLayoutEffect(() => {
    // if there isn't enough space place it over the button
    function isSpaceUnderButtonEnough() {
      assertCondition(
        frequencyMenuButtonRef.current !== null &&
          frequencyMenuRef.current !== null &&
          footerRef.current !== null,
        'since menu opens through user interaction, both footer and button will be present when layout effect runs',
      );
      const menuElementHeight =
        frequencyMenuRef.current.getBoundingClientRect().height;
      const menuTogglerButtonBottom =
        frequencyMenuButtonRef.current.getBoundingClientRect().bottom;
      const footerTop = footerRef.current.getBoundingClientRect().top;
      // buttonBottom + menuHeight approach used since menuBottom changes
      const isFooterBelowMenu =
        footerTop > menuTogglerButtonBottom + menuElementHeight;
      return isFooterBelowMenu;
    }

    function determineWhereToPlaceTheMenu() {
      const menuElement = frequencyMenuRef.current;
      assertCondition(
        menuElement !== null,
        'ref is initialized before layout effect runs',
      );
      if (isSpaceUnderButtonEnough())
        menuElement.classList.remove('over-the-button');
      else menuElement.classList.add('over-the-button');
    }

    determineWhereToPlaceTheMenu(); // on initial render place it below or over the button

    // on-resize re-calculate
    window.addEventListener('resize', determineWhereToPlaceTheMenu);
    return () => {
      window.removeEventListener('resize', determineWhereToPlaceTheMenu);
    };
  }, [footerRef, frequencyMenuButtonRef]);

  const monThruSun = frequencyState.map((checked, dayIndex) => {
    return (
      <li key={dayIndex}>
        <label className="frequency-toggler-label toggler-text-and-icon toggler-transition">
          <span className="unselectable">
            {returnWeekdayFromSunday(dayIndex)}
          </span>
          <input
            type="checkbox"
            value={dayIndex}
            checked={Boolean(checked)}
            onChange={toggleCheckedHandler}
          />
        </label>
      </li>
    );
  });
  // since sunday uses 0 instead of 7 (due to .getDay()), we need to put it at the end to get a mon-sun list
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  monThruSun[6] = monThruSun.shift()!;

  return (
    <ul
      className="frequency-menu"
      role="menu"
      ref={frequencyMenuRef}
      tabIndex={-1} // so that when something unfocusable (like a text) is clicked, focus remains on the menu
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          closeFrequencyMenu();
          focusOnFrequencyMenuButton(); // when closed with escape move the focus
          e.stopPropagation(); // don't close any other menu before this menu is closed
        }
      }}
    >
      {monThruSun}
    </ul>
  );
}
