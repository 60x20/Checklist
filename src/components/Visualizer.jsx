import { Link, Outlet, useParams } from "react-router-dom";

// helpers
import { extractYear, extractMonth, validateDate } from "../helpers/validateUnitsFromDate";
import { returnYearEntry } from "../helpers/todoDataHelpers";
const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const VisualizerLayout = () => {
  return (
    <div id="visualizer">
      <Outlet />
    </div>
  );
}

export const MonthVisualizer = () => {
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

  return (<>
    { monthEntry.map((dayData, day) => dayData ? (
      // there are vacant indexes, so that days and indexes match
      <div key={day} className="day">
        { Object.entries(dayData).map(([todoId, checked]) => (
          <p key={todoId}>{checked ? 'finished' : 'unfinished'}</p>
        )) }
      </div>
    ) : false) }
  </>);
}

export const YearVisualizer = () => {
  // a specific year requested
  const { year } = useParams();

  const extractedYear = extractYear(year);

  const isValid = validateDate(extractedYear);
  if (!isValid) return (<p>invalid date</p>);
  
  const yearAsInt = parseInt(extractedYear, 10);

  const yearEntry = returnYearEntry(yearAsInt);

  if (!yearEntry) return (<p>no data for year</p>);

  return (<>
    { yearEntry.map((monthArr, month) => monthArr ? (
      // there are vacant indexes, so that months and indexes match
      <p key={month} className="month">
        <Link to={String(month).padStart(2, '0')}>{monthNames[month]}</Link>
      </p>
    ) : false) }
  </>);
}
