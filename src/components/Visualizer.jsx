import { Link, Outlet, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";

// font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'

// helpers
import { returnAllYears } from "../helpers/allYearsHelpers";
import { extractYear, extractMonth, validateDate, monthNames } from "../helpers/validateUnitsFromDate";
import { returnYearEntry } from "../helpers/todoDataHelpers";

// contexts
import { allDataClearedContext } from "../providers/AllDataClearedProvider";
import { refContext } from "../providers/RefProvider";

export const VisualizerLayout = () => {
  const { refs: { visualizerRef } } = useContext(refContext);

  return (
    <div id="visualizer" ref={visualizerRef}>
      <Outlet />
    </div>
  );
}

export const MonthVisualizer = () => {
  useContext(allDataClearedContext); // when data is cleared, re-render

  // a specific month requested
  const { year, month } = useParams();

  const extractedYear = extractYear(year);
  const extractedMonth = extractMonth(month);

  const isValid = validateDate(extractedYear, extractedMonth);
  if (!isValid) return <p>invalid date</p>;

  const yearAsInt = parseInt(extractedYear, 10);
  const monthAsInt = parseInt(extractedMonth, 10);

  const yearEntry = returnYearEntry(yearAsInt);
  if (!yearEntry) return (<p>no data for year</p>);

  const monthEntry = yearEntry[monthAsInt];
  if (!monthEntry) return (<p>no data for month</p>);

  return (<div className="row-container">
    { monthEntry.map((dayData, day) => dayData ? (
      // there are vacant indexes, so that days and indexes match
      <div key={day} className="day">
        <p>day: {String(day).padStart(2, '0')}</p>
        <p>completion: { (() => {
          const dayCheckedData = Object.values(dayData);
          const amountOfTodos = dayCheckedData.length;
          let amountOfCheckedTodos = 0;
          for (const checked of dayCheckedData) checked ? amountOfCheckedTodos++ : '';
          return `${amountOfCheckedTodos}/${amountOfTodos}`;
        })() }</p>
        <div>{ Object.entries(dayData).map(([todoId, checked]) => (
          <p key={todoId} className={ checked ? 'checked' : 'unchecked' }>
            <FontAwesomeIcon icon={checked ? faCheck : faXmark} />
          </p>
        )) }</div>
      </div>
    ) : false).toReversed() }
  </div>);
}

export const YearVisualizer = () => {
  useContext(allDataClearedContext); // when data is cleared, re-render

  // a specific year requested
  const { year } = useParams();

  // when rendered or URL changes focus on the first link
  const { helpers: { focusOnFirstItemInsideVisualizer } } = useContext(refContext);
  useEffect(focusOnFirstItemInsideVisualizer, [year]);

  const extractedYear = extractYear(year);

  const isValid = validateDate(extractedYear);
  if (!isValid) return (<p>invalid date</p>);
  
  const yearAsInt = parseInt(extractedYear, 10);

  const yearEntry = returnYearEntry(yearAsInt);

  if (!yearEntry) return (<p>no data for year</p>);

  return (<div className="column-container">
    { yearEntry.map((monthArr, month) => monthArr ? (
      // there are vacant indexes, so that months and indexes match
      <p key={month} className="month">
        <Link to={String(month).padStart(2, '0')}>{monthNames[month]}</Link>
      </p>
    ) : false).toReversed() }
  </div>);
}

export const AllYearsVisualizer = () => {
  useContext(allDataClearedContext); // when data is cleared, re-render
  
  // when rendered focus on the first link
  const { helpers: { focusOnFirstItemInsideVisualizer } } = useContext(refContext);
  useEffect(focusOnFirstItemInsideVisualizer, []);

  // everyting requested
  const allYears = returnAllYears();

  if (allYears.length === 0) return <p>no data</p>;

  const allYearsDescending = allYears.sort((a, b) => b - a);

  return (<div className="column-container">
    { allYearsDescending.map((year) => (
      // there aren't any vacant indexes, but years are unique
      <p key={year} className="year">
        <Link to={String(year).padStart(4, '0')}>{ year }</Link>
      </p>
    )) }
  </div>);
}