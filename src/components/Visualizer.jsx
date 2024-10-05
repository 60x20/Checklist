import { Link, Outlet, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";

// font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'

// helpers
import { returnAllYears } from "../helpers/allYearsHelpers";
import { extractYear, extractMonth, validateDate, monthNames, monthNamesTruncated } from "../helpers/validateUnitsFromDate";
import { returnYearEntry } from "../helpers/todoDataHelpers";

// contexts
import { allDataClearedContext } from "../providers/AllDataClearedProvider";
import { refContext } from "../providers/RefProvider";

// custom hooks
import changeDocumentTitle from "../custom-hooks/changeDocumentTitle";

const mainTitle = 'Visualize'; // will be put in document.title
const addSubtitleToDocumentTitle = changeDocumentTitle.bind(globalThis, mainTitle);

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

  const yearAsInt = parseInt(extractedYear, 10);
  const monthAsInt = parseInt(extractedMonth, 10);

  const subtitle = isValid ? `${monthNamesTruncated[monthAsInt]} ${extractedYear}` : 'invalid date';
  addSubtitleToDocumentTitle(subtitle);
  
  if (!isValid) return <p>invalid date</p>;

  const yearEntry = returnYearEntry(yearAsInt);
  if (!yearEntry) return (<p>no data for year</p>);

  const monthEntry = yearEntry[monthAsInt];
  if (!monthEntry) return (<p>no data for month</p>);

  return (<div className="row-container">
    { monthEntry.map((dayData, day) => {
      // there are vacant indexes, so that days and indexes match
      if (dayData) {
        const dayAsString = String(day).padStart(2, '0');
        return (<article key={day} className="day">
          <h3 className="styled-as-p">
            day: <time dateTime={`${extractedYear}-${extractedMonth}-${dayAsString}`}>{dayAsString}</time>
          </h3>
          <p>completion: { (() => {
            const dayCheckedData = Object.values(dayData);
            const amountOfTodos = dayCheckedData.length;
            let amountOfCheckedTodos = 0;
            for (const checked of dayCheckedData) if (checked) amountOfCheckedTodos++;
            return `${amountOfCheckedTodos}/${amountOfTodos}`;
          })() }</p>
          <ul>{ Object.entries(dayData).map(([todoId, checked]) => (
            <li key={todoId} className={ checked ? 'checked' : 'unchecked' }>
              <FontAwesomeIcon icon={checked ? faCheck : faXmark} />
            </li>
          )) }</ul>
        </article>);
      } else return false;
      // reversed, so that latest days are at the top of the document
    }).toReversed() }
  </div>);
}

export const YearVisualizer = () => {
  useContext(allDataClearedContext); // when data is cleared, re-render

  // a specific year requested
  const { year } = useParams();

  // when rendered or URL changes focus on the first link
  const { helpers: { focusOnFirstItemInsideVisualizer } } = useContext(refContext);
  // layoutEffect not used since ref used on parent (and child layout runs before the parent mounts and gets the ref)
  useEffect(focusOnFirstItemInsideVisualizer, [year]);

  const extractedYear = extractYear(year);

  const isValid = validateDate(extractedYear);
  
  const subtitle = isValid ? extractedYear : 'invalid year';
  addSubtitleToDocumentTitle(subtitle);
  
  if (!isValid) return (<p>invalid date</p>);
  
  const yearAsInt = parseInt(extractedYear, 10);

  const yearEntry = returnYearEntry(yearAsInt);

  if (!yearEntry) return (<p>no data for year</p>);

  return (<nav><ul className="column-container">
    { yearEntry.map((monthArr, month) => {
      // there are vacant indexes, so that months and indexes match
      if (monthArr) {
        const monthAsString = String(month).padStart(2, '0');
        return (<li key={month} className="month">
          <Link to={monthAsString}>
            <time dateTime={`${extractedYear}-${monthAsString}`}>{ monthNames[month] }</time>
          </Link>
        </li>);
      } else return false;
      // reversed, so that latest months are at the top of the document
    }).toReversed() }
  </ul></nav>);
}

export const AllYearsVisualizer = () => {
  useContext(allDataClearedContext); // when data is cleared, re-render
  
  // when rendered focus on the first link
  const { helpers: { focusOnFirstItemInsideVisualizer } } = useContext(refContext);
  useEffect(focusOnFirstItemInsideVisualizer, []); // layout effect can't be used since ref isn't used here or on children

  addSubtitleToDocumentTitle('Years');

  // everyting requested
  const allYears = returnAllYears();

  if (allYears.length === 0) return <p>no data</p>;

  const allYearsDescending = allYears.sort((a, b) => b - a);

  return (<nav><ul className="column-container">
    { allYearsDescending.map((year) => {
      const yearAsString = String(year).padStart(4, '0');
      return ( // there aren't any vacant indexes, but years are unique
      <li key={year} className="year">
        <Link to={yearAsString}>
          <time dateTime={yearAsString}>{ year }</time>
        </Link>
      </li>);
    }) }
  </ul></nav>);
}