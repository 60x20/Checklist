import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

// contexts
import { menuStateContext } from '../providers/MenuStateProvider';
import { currentDateContext } from '../providers/CurrentDateProvider';
import { amountOfClearsContext } from "../providers/AmountOfClearsProvider";
import { requestedDateValidatedContext } from "../providers/RequestedDateValidatedProvider";

// helpers
import resetAllData from "../helpers/resetAllData";
import { returnDateFromToday } from "../helpers/returnCurrentDate";
import { resetTodoData } from "../helpers/todoDataHelpers";

// variables used for debouncing
let oldDateToGo, dateToGo;
let intervalID;

const Menu = () => {
  const { year, month, day } = useContext(requestedDateValidatedContext);
  const unitsAsInt = [parseInt(year, 10), parseInt(month, 10), parseInt(day, 10)]; // used as array indexes

  const { increaseAmountOfClears } = useContext(amountOfClearsContext);

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
    // informing checklist that data is reset, allowing it to clean-up (otherwise old data will be seen)
    increaseAmountOfClears();
  }
  function resetCurrentDayHandler() {
    resetTodoData(...unitsAsInt);
  }

  const { menuState } = useContext(menuStateContext);
  const currentDate = useContext(currentDateContext);

  const prevDates = [];
  const prevDayAmount = 3;
  prevDates.length = prevDayAmount + 1; // 1 for today
  prevDates.fill(''); // if they're empty, map will skip them 

  return (
    <>
    { menuState ? (
    <aside role="menu" id="menu" className="column-stretch-container">
      <h2>Previous Checklists</h2>
      <nav className="column-stretch-container">
        { prevDates.map((el, i) => {
          const relativeDate = returnDateFromToday(-i);
          return (
            <p key={i}>
              <Link to={relativeDate.YMD.replaceAll('-', '/')}>
                {i === 0 ? 'today: ' : ''}
                {relativeDate.DMY}
              </Link>
            </p>
          );
        }) }
        <label>
          <span>go to: </span>
          <input 
            onChange={goToRequestedDateHandler}
            type="date"
            min="2000-01-01"
            defaultValue={currentDate.YMD}
            max="2100-12-31"
          />
        </label>
        <p><Link to='all'>all</Link></p>
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