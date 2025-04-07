import { Link, Outlet, useParams } from 'react-router-dom';

// font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

// helpers
import { type AllYears, returnValidAllYears } from '../helpers/allYearsHelpers';
import {
  extractYear,
  extractMonth,
  validateDate,
  monthFormatter,
  monthYearTruncFormatter,
} from '../helpers/validateUnitsFromDate';
import {
  type LocalTodoData,
  returnYearEntry,
} from '../helpers/todoDataHelpers';
import { assertCondition, truncateString } from '../helpers/utils';
import {
  cachedAllTodos,
  type CheckboxValueType,
} from '../helpers/allTodosHelpers';

// contexts
import { useAllDataClearedContext } from '../providers/AllDataClearedProvider';
import {
  refCallbackToFocusOnFirstItemOnMount,
  useRefContext,
} from '../providers/RefProvider';

// custom hooks
import useDocumentTitle from '../custom-hooks/useDocumentTitle';

const mainTitle = 'Visualize'; // will be put in document.title
const addSubtitleToDocumentTitle = useDocumentTitle.bind(globalThis, mainTitle);

export const VisualizerLayout = () => {
  const {
    refs: { visualizerRef },
  } = useRefContext();

  return (
    <div id="visualizer" ref={visualizerRef}>
      <Outlet />
    </div>
  );
};

export const MonthVisualizer = () => {
  useAllDataClearedContext(); // when data is cleared, re-render

  // a specific month requested
  const { year, month } = useParams();
  assertCondition(
    year !== undefined && month !== undefined,
    'MonthVisualizer only renders if url includes both a year and a month',
  );

  const extractedYear = extractYear(year);
  const extractedMonth = extractMonth(month);

  const isValid = validateDate(extractedYear, extractedMonth);

  const subtitle = isValid
    ? monthYearTruncFormatter.format(
        new Date([extractedYear, extractedMonth].join('-')),
      )
    : 'invalid date';
  addSubtitleToDocumentTitle(subtitle);

  if (!isValid) return <p>invalid date</p>;

  const yearAsInt = Number(extractedYear);
  const yearEntry = returnYearEntry(yearAsInt);
  if (!yearEntry) return <p>no data for year</p>;

  const monthAsInt = Number(extractedMonth);
  const monthEntry = yearEntry[monthAsInt];
  if (!monthEntry) return <p>no data for month</p>;

  return (
    <div className="row-container">
      {
        monthEntry
          .map((dayData, day) => {
            if (dayData) {
              const dayAsString = String(day).padStart(2, '0');
              const dayTodoData = Object.entries(dayData).map(
                ([id, todoData]: [string, LocalTodoData]): [
                  number,
                  LocalTodoData,
                ] => [Number(id), todoData],
              );
              return (
                <article key={day} className="day">
                  <h3 className="styled-as-p">
                    day:{' '}
                    <time
                      dateTime={`${extractedYear}-${extractedMonth}-${dayAsString}`}
                    >
                      {dayAsString}
                    </time>
                  </h3>
                  <p>
                    completion:{' '}
                    {(() => {
                      const dayCheckedData: CheckboxValueType[] = [];
                      dayTodoData.forEach(([todoId, todoData]) => {
                        if (cachedAllTodos[todoId].type === 'checkbox')
                          dayCheckedData.push(todoData.value ? 1 : 0);
                      });
                      const amountOfTodos = dayCheckedData.length;
                      const amountOfCheckedTodos =
                        dayCheckedData.filter(Boolean).length;
                      return `${String(amountOfCheckedTodos)}/${String(amountOfTodos)}`;
                    })()}
                  </p>
                  <ul>
                    {dayTodoData.map(([todoId, { value }]) => (
                      <li key={todoId}>
                        {cachedAllTodos[todoId].type === 'checkbox' ? (
                          <FontAwesomeIcon
                            icon={value ? faCheck : faXmark}
                            className={value ? 'checked' : 'unchecked'}
                          />
                        ) : (
                          <span>{truncateString(String(value))}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            } else return false;
          })
          .toReversed() // reversed, so that latest days are at the top of the document
      }
    </div>
  );
};

export const YearVisualizer = () => {
  useAllDataClearedContext(); // when data is cleared, re-render

  // a specific year requested
  const { year } = useParams();
  assertCondition(
    year !== undefined,
    'YearVisualizer only renders if url includes a year',
  );

  const extractedYear = extractYear(year);

  const isValid = validateDate(extractedYear);

  const subtitle = isValid ? extractedYear : 'invalid year';
  addSubtitleToDocumentTitle(subtitle);

  if (!isValid) return <p>invalid date</p>;

  const yearAsInt = Number(extractedYear);
  const yearEntry = returnYearEntry(yearAsInt);
  if (!yearEntry) return <p>no data for year</p>;

  return (
    <nav>
      <ul
        className="column-container"
        ref={refCallbackToFocusOnFirstItemOnMount}
      >
        {
          yearEntry
            .map((monthArr, month) => {
              if (monthArr) {
                const monthAsString = String(month).padStart(2, '0');
                const localDate = [extractedYear, monthAsString].join('-');
                return (
                  <li key={month} className="month">
                    <Link to={monthAsString}>
                      <time dateTime={localDate}>
                        {monthFormatter.format(new Date(localDate))}
                      </time>
                    </Link>
                  </li>
                );
              } else return false;
            })
            .toReversed() // reversed, so that latest months are at the top of the document
        }
      </ul>
    </nav>
  );
};

export const AllYearsVisualizer = () => {
  useAllDataClearedContext(); // when data is cleared, re-render

  addSubtitleToDocumentTitle('Years');

  // everything requested
  const allYears = returnValidAllYears();

  if (allYears.length === 0) return <p>no data</p>;

  const allYearsDescending: AllYears = allYears.toSorted((a, b) => b - a);

  return (
    <nav>
      <ul
        className="column-container"
        ref={refCallbackToFocusOnFirstItemOnMount}
      >
        {allYearsDescending.map((year) => {
          const yearAsString = String(year).padStart(4, '0');
          return (
            <li key={year} className="year">
              <Link to={yearAsString}>
                <time dateTime={yearAsString}>{year}</time>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
