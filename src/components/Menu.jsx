import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// contexts
import { menuStateContext } from '../providers/MenuStateProvider';
import { currentDateContext } from '../providers/CurrentDateProvider';
import { amountOfClearsContext } from "../providers/AmountOfClearsProvider";
import { todayClearedContext } from "../providers/TodayClearedProvider";
import { requestedDateValidatedContext } from "../providers/RequestedDateValidatedProvider";

// helpers
import resetAllData from "../helpers/resetAllData";
import { returnDateFromToday } from "../helpers/returnCurrentDate";
import { resetTodoData } from "../helpers/todoDataHelpers";
import { focusOnCreateTodoInsideChecklist, focusOnFirstLinkInsideVisualizer, focusOnFirstMenuItem } from "../helpers/focusHelpers";

// variables used for debouncing
let oldDateToGo, dateToGo;
let intervalID;

const Menu = () => {
  const { menuState, closeTheMenu } = useContext(menuStateContext);
  
  const currentDate = useContext(currentDateContext);
  
  const { year, month, day } = useContext(requestedDateValidatedContext);
  const unitsAsInt = [parseInt(year, 10), parseInt(month, 10), parseInt(day, 10)]; // used as array indexes

  const { increaseAmountOfClears } = useContext(amountOfClearsContext);
  const { increaseTodayCleared } = useContext(todayClearedContext);

  // when menu opens, focus on first menu item
  useEffect(() => {
    if (menuState) focusOnFirstMenuItem();
  }, [menuState]);

  useEffect(() => {
    // on click away, tab away or when another elements gets focused menu will be closed
    function closeMenuOnFocusOutHandler(e) {
      // focusing on other elements, either by user interaction or programmatically, causes blur events
      // so, it's risky to focus when blur events trigger (focus collisions will occur)
      const menuElement = document.querySelector('#menu');
      // related target might be null, for example when window changes (using Alt Tab)
      if (e.relatedTarget && e.relatedTarget.matches('#menu-toggler')) return; // menu closing when toggler gets focus causes re-opening
      if (!menuElement.contains(e.relatedTarget)) closeTheMenu();
    }

    // if closed, remove the event listener; if opened, add the event listener
    if (menuState) {
      document.addEventListener('focusout', closeMenuOnFocusOutHandler);
      return () => document.removeEventListener('focusout', closeMenuOnFocusOutHandler);
    }
  }, [closeTheMenu, menuState])

  const navigate = useNavigate();
  function goToRequestedDateHandler(e) {
    const requestedDate = e.currentTarget.value;
    // requestedDate might be an empty string in case it's an invalid date
    if (requestedDate) {
      dateToGo = requestedDate;
    }
    // debouncing, otherwise performance issues might occur
    if (!intervalID) {
      intervalID = setInterval(() => {
        if (oldDateToGo === dateToGo) {
          // if dateToGo didn't change, then clean-up
          clearInterval(intervalID);
          intervalID = undefined;
          return; // short circuit
        };
        oldDateToGo = dateToGo;
        navigate(dateToGo.replaceAll('-', '/'));
      }, 100);
    }
  }
  
  function resetAllDataHandler() {
    const confirmed = window.confirm('Are you sure you want to permanently delete all your data? This action cannot be undone.');
    if (!confirmed) return;
    resetAllData();
    increaseAmountOfClears(); // informing checklist that data is reset, allowing it to clean-up (otherwise old data will be seen)

    focusOnCreateTodoInsideChecklist(); // move focus to create-todo
  }
  function resetCurrentDayHandler() {
    resetTodoData(...unitsAsInt);
    increaseTodayCleared(); // informing checklist
    
    focusOnCreateTodoInsideChecklist(); // move focus to create-todo
  }

  // for creating links relative to today
  const prevDates = [];
  const prevDayAmount = 3;
  prevDates.length = prevDayAmount + 1; // 1 for today
  prevDates.fill(''); // if they're empty, map will skip them 

  return (
    <>
    { menuState ? (
    // tabindex to make it focusable, so that when it's clicked it's not the body who gets the focus
    // otherwise handler to close the menu would kick in
    <aside tabIndex="-1" role="menu" id="menu" className="column-stretch-container">
      <h2>Previous Checklists</h2>
      <nav>
        <ul className="column-stretch-container">
          { prevDates.map((el, i) => {
            const relativeDate = returnDateFromToday(-i);
            return (
              <li key={i}>
                <Link to={relativeDate.YMD.replaceAll('-', '/')} onClick={focusOnCreateTodoInsideChecklist}>
                  {i === 0 ? 'today: ' : ''}
                  {relativeDate.DMY}
                </Link>
              </li>
            );
          }) }
          <li>
            <label>
              <span>go to: </span>
              <input 
                onKeyUp={(e) => {if (e.key === 'Enter') focusOnCreateTodoInsideChecklist();}}
                onChange={goToRequestedDateHandler}
                type="date"
                min="2000-01-01"
                defaultValue={currentDate.YMD}
                max="2100-12-31"
              />
            </label>
          </li>
          <li><Link to='all' onClick={focusOnFirstLinkInsideVisualizer}>all</Link></li>
        </ul>
      </nav>
      <div className="place-content-at-the-end">
        { year && month && day ? 
        <button type="button" onClick={resetCurrentDayHandler}>reset current day</button>
        : false }
        <button type="button" onClick={resetAllDataHandler}>reset all data</button>
      </div>
    </aside>
    ) : false }
    </>
  );
};

export default Menu;