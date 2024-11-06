import { useContext, useEffect, useLayoutEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// contexts
import { menuStateContext } from '../providers/MenuStateProvider';
import { allDataClearedContext } from '../providers/AllDataClearedProvider';
import { todayClearedContext } from '../providers/TodayClearedProvider';
import { requestedDateValidatedContext } from '../providers/RequestedDateValidatedProvider';
import { focusOnFirstItemFromRef, focusOnLastItemFromRef, refContext } from '../providers/RefProvider';

// helpers
import { confirmToResetAllData } from '../helpers/resetAllData';
import { returnDateFromToday } from '../helpers/returnCurrentDate';
import { resetTodoData } from '../helpers/todoDataHelpers';
import { dayMonthYearTruncFormatter } from '../helpers/validateUnitsFromDate';

const MenuWrapper = () => {
  const { menuState, closeTheMenu } = useContext(menuStateContext);

  return menuState ? <Menu {...{ closeTheMenu }} /> : <></>;
};

export default MenuWrapper;

const Menu = ({ closeTheMenu }) => {
  const { year, month, day } = useContext(requestedDateValidatedContext);
  const isDateRequested = year && month && day;
  const unitsAsInt = [parseInt(year, 10), parseInt(month, 10), parseInt(day, 10)]; // used as array indexes

  const { increaseAllDataCleared } = useContext(allDataClearedContext);
  const { increaseTodayCleared } = useContext(todayClearedContext);

  // focus management and ease of use
  const menuRef = useRef();
  const {
    helpers: { focusOnCreateTodo, focusOnMenuToggler, focusOnFirstItemInsideVisualizer }
  } = useContext(refContext);
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
    function closeMenuOnFocusOutHandler(e) {
      // focusing on other elements, either by user interaction or programmatically, causes blur events
      // so, it's risky to focus when blur events trigger (focus collisions will occur)
      const menuElement = menuRef.current;
      // if null, it's already closed; might happen since cleanup runs after rendering is complete
      if (!menuElement) return; // for example: key of a component changing / focusing during rendering / focusing inside effect cleanup
      // related target might be null, for example when window changes (using Alt Tab)
      if (e.relatedTarget && e.relatedTarget.matches('#menu-toggler')) return; // menu closing when toggler gets focus causes re-opening
      if (!menuElement.contains(e.relatedTarget)) closeTheMenu();
    }

    // if closed, remove the event listener; if opened, add the event listener
    document.addEventListener('focusout', closeMenuOnFocusOutHandler);
    return () => document.removeEventListener('focusout', closeMenuOnFocusOutHandler);
  }, [closeTheMenu]);
  // close the menu when escape pressed (for accessibility)
  useEffect(() => {
    function closeMenuHandler(e) {
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
  const dateToGo = useRef();
  const timeoutSet = useRef();
  function goToRequestedDateHandler(e) {
    const requestedDate = e.currentTarget.value;
    if (!requestedDate) return; // if requestedDate is invalid, don't continue
    dateToGo.current = requestedDate;
    if (!timeoutSet.current) {
      timeoutSet.current = setTimeout(() => {
        navigate(dateToGo.current.replaceAll('-', '/'));
        dateToGo.current = timeoutSet.current = undefined; // reset, so that old data doesn't cause problems
      }, 100);
    }
  }

  function resetAllDataHandler() {
    if (confirmToResetAllData()) {
      increaseAllDataCleared(); // informing checklist that data is reset, allowing it to clean-up (otherwise old data will be seen)

      focusOnCreateTodoAndCloseTheMenu();
    }
  }
  function resetCurrentDayHandler() {
    resetTodoData(...unitsAsInt);
    increaseTodayCleared(); // informing checklist

    focusOnCreateTodoAndCloseTheMenu();
  }

  function menuKeyPressFocusHandler(e) {
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
  const prevDates = [];
  const prevDayAmount = 3;
  prevDates.length = prevDayAmount + 1; // 1 for today
  prevDates.fill(''); // if they're empty, .map() will skip them

  return (
    // tabindex to make it focusable, so that when it's clicked it's not the body who gets the focus
    // otherwise handler to close the menu would kick in
    <aside
      tabIndex="-1"
      role="menu"
      id="menu"
      ref={menuRef}
      className="column-stretch-container"
      onKeyDown={menuKeyPressFocusHandler}
    >
      <h2>Previous Checklists</h2>
      <nav>
        <ul className="column-stretch-container">
          {prevDates.map((el, i) => {
            const relativeDate = returnDateFromToday(-i);
            return (
              <li key={i}>
                <Link to={relativeDate.YMD.replaceAll('-', '/')} onClick={focusOnCreateTodoAndCloseTheMenu}>
                  {i === 0 ? 'today: ' : ''}
                  <time dateTime={relativeDate.YMD}>
                    {dayMonthYearTruncFormatter.format(new Date(relativeDate.YMD))}
                  </time>
                </Link>
              </li>
            );
          })}
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
                min="2000-01-01"
                defaultValue={isDateRequested ? [year, month, day].join('-') : ''}
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
        {isDateRequested ? (
          <button type="button" onClick={resetCurrentDayHandler}>
            reset current day
          </button>
        ) : (
          false
        )}
        <button type="button" onClick={resetAllDataHandler}>
          reset all data
        </button>
      </div>
    </aside>
  );
};
