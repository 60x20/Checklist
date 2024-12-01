import { useEffect, useLayoutEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// contexts
import {
  MenuStateContext,
  useMenuStateContext,
} from '../providers/MenuStateProvider';
import { useAllDataClearedContext } from '../providers/AllDataClearedProvider';
import { useTodayClearedContext } from '../providers/TodayClearedProvider';
import { useRequestedDateValidatedContext } from '../providers/RequestedDateValidatedProvider';
import {
  focusOnFirstItemFromRef,
  focusOnLastItemFromRef,
  useRefContext,
} from '../providers/RefProvider';

// helpers
import { confirmToResetAllData } from '../helpers/resetAllData';
import { returnDateFromToday } from '../helpers/returnCurrentDate';
import { resetTodoData } from '../helpers/todoDataHelpers';
import { dayMonthYearTruncFormatter } from '../helpers/validateUnitsFromDate';
import { parseDecimal } from '../helpers/utils';

const MenuWrapper = () => {
  const { menuState, closeTheMenu } = useMenuStateContext();

  return menuState ? <Menu {...{ closeTheMenu }} /> : <></>;
};

export default MenuWrapper;

interface MenuProps {
  closeTheMenu: MenuStateContext['closeTheMenu'];
}

const Menu = ({ closeTheMenu }: MenuProps) => {
  const { year, month, day } = useRequestedDateValidatedContext();
  const isDateRequested = year && month && day;

  const { increaseAllDataCleared } = useAllDataClearedContext();
  const { increaseTodayCleared } = useTodayClearedContext();

  // focus management and ease of use
  const menuRef = useRef<HTMLElement>(null);
  const {
    helpers: {
      focusOnCreateTodo,
      focusOnMenuToggler,
      focusOnFirstItemInsideVisualizer,
    },
  } = useRefContext();
  function focusOnCreateTodoAndCloseTheMenu() {
    focusOnCreateTodo(); // move focus to create-todo
    closeTheMenu(); // closing explicitly due to focusing being conditional
  }
  // when menu opens, focus on first menu item
  useLayoutEffect(() => {
    // layout preferred to avoid flickers
    focusOnFirstItemFromRef(menuRef);
  }, []);
  // on click away, tab away or when another elements gets focused menu will be closed
  useEffect(() => {
    function closeMenuOnFocusOutHandler(e: FocusEvent) {
      // focusing on other elements, either by user interaction or programmatically, causes blur events
      // so, it's risky to focus when blur events trigger (focus collisions will occur)
      const menuElement = menuRef.current;
      // if null, it's already closed; might happen since cleanup runs after rendering is complete
      if (!menuElement) return; // for example: key of a component changing / focusing during rendering / focusing inside effect cleanup
      // related target might be null, for example when window changes (using Alt Tab)
      if (
        e.relatedTarget instanceof HTMLElement &&
        e.relatedTarget.matches('#menu-toggler')
      )
        return; // menu closing when toggler gets focus causes re-opening
      if (
        !(
          e.relatedTarget instanceof Node &&
          menuElement.contains(e.relatedTarget)
        )
      )
        closeTheMenu();
    }

    // if closed, remove the event listener; if opened, add the event listener
    document.addEventListener('focusout', closeMenuOnFocusOutHandler);
    return () =>
      document.removeEventListener('focusout', closeMenuOnFocusOutHandler);
  }, [closeTheMenu]);
  // close the menu when escape pressed (for accessibility)
  useEffect(() => {
    function closeMenuHandler(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        focusOnMenuToggler();
        closeTheMenu(); // focusing on menu toggler does not close the menu, even if it triggers blur
      }
    }

    // if closed, remove the event listener; if opened, add the event listener
    // keydown used instead of keyup, so that when a browser popup closed with esc, menu won't close
    document.addEventListener('keydown', closeMenuHandler);
    return () => document.removeEventListener('keydown', closeMenuHandler);
  }, [closeTheMenu, focusOnMenuToggler]);

  const navigate = useNavigate();
  // throttling, otherwise performance issues might occur
  const dateToGo = useRef<string>('');
  const timeoutSet = useRef<number | undefined>(undefined);
  function goToRequestedDateHandler(e: React.ChangeEvent<HTMLInputElement>) {
    // if requestedDate is invalid, don't continue
    if (e.currentTarget.checkValidity()) {
      const requestedDate = e.currentTarget.value;
      dateToGo.current = requestedDate;
      if (timeoutSet.current === undefined) {
        timeoutSet.current = setTimeout(() => {
          navigate(dateToGo.current.replaceAll('-', '/'));
          // reset, so that old data doesn't cause problems
          dateToGo.current = '';
          timeoutSet.current = undefined;
        }, 100);
      }
    }
  }

  function resetAllDataHandler() {
    if (confirmToResetAllData()) {
      increaseAllDataCleared(); // informing checklist that data is reset, allowing it to clean-up (otherwise old data will be seen)

      focusOnCreateTodoAndCloseTheMenu();
    }
  }
  let resetCurrentDayButton = <></>;
  if (isDateRequested) {
    const unitsAsInt: [number, number, number] = [
      parseDecimal(year),
      parseDecimal(month),
      parseDecimal(day),
    ]; // used as array indexes

    function resetCurrentDayHandler() {
      resetTodoData(...unitsAsInt);
      increaseTodayCleared(); // informing checklist

      focusOnCreateTodoAndCloseTheMenu();
    }

    resetCurrentDayButton = (
      <button type="button" onClick={resetCurrentDayHandler}>
        reset current day
      </button>
    );
  }

  function menuKeyPressFocusHandler(e: React.KeyboardEvent<HTMLElement>) {
    // if (e.target && e.target.matches('input[type="text"], input:not([type])')) return; // allowing default behavior
    switch (e.key) {
      case 'Home':
        focusOnFirstItemFromRef(menuRef);
        break;
      case 'End':
        focusOnLastItemFromRef(menuRef);
        break;
    }
  }

  // for creating links relative to today
  const prevDates: JSX.Element[] = [];
  const prevDayAmount = 3 + 1; // 1 for today
  for (let i = 0; i < prevDayAmount; i++) {
    const relativeDate = returnDateFromToday(-i);
    prevDates.push(
      <li key={i}>
        <Link
          to={relativeDate.YMD.replaceAll('-', '/')}
          onClick={focusOnCreateTodoAndCloseTheMenu}
        >
          {i === 0 ? 'today: ' : ''}
          <time dateTime={relativeDate.YMD}>
            {dayMonthYearTruncFormatter.format(new Date(relativeDate.YMD))}
          </time>
        </Link>
      </li>,
    );
  }

  return (
    // tabindex to make it focusable, so that when it's clicked it's not the body who gets the focus
    // otherwise handler to close the menu would kick in
    <aside
      tabIndex={-1}
      role="menu"
      id="menu"
      ref={menuRef}
      className="column-stretch-container"
      onKeyDown={menuKeyPressFocusHandler}
    >
      <h2>Previous Checklists</h2>
      <nav>
        <ul className="column-stretch-container">
          {prevDates}
          <li>
            <label>
              <span>go to: </span>
              <input
                // keyup preferred over keydown to allow opening the date picker with 'Enter-keydown'
                onKeyUp={(e) => {
                  if (e.key === 'Enter') focusOnCreateTodoAndCloseTheMenu();
                }}
                onChange={goToRequestedDateHandler}
                type="date"
                required
                min="2000-01-01"
                defaultValue={
                  isDateRequested ? [year, month, day].join('-') : ''
                }
                max="2100-12-31"
              />
            </label>
          </li>
          <li>
            <Link
              to="all"
              onClick={() => {
                closeTheMenu();
                focusOnFirstItemInsideVisualizer();
              }}
            >
              all
            </Link>
          </li>
        </ul>
      </nav>
      <div className="place-content-at-the-end">
        {resetCurrentDayButton}
        <button type="button" onClick={resetAllDataHandler}>
          reset all data
        </button>
      </div>
    </aside>
  );
};
