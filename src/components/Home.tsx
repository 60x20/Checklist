import { Link } from 'react-router-dom';

// contexts
import { useCurrentDateContext } from '../providers/CurrentDateProvider';
import { refCallbackForFocusOnMount } from '../providers/RefProvider';

// helpers
import { weekdayDayMonthFormatter } from '../helpers/validateUnitsFromDate';

// custom hooks
import useDocumentTitle from '../custom-hooks/useDocumentTitle';

export default function Home() {
  const currentDate = useCurrentDateContext();

  useDocumentTitle(undefined, 'Home'); // add to original title

  return (
    <div id="home">
      {/* focus on the anchor on mount; autoFocus isn't used since it doesn't work with <a> elements */}
      <h1>
        Today:{' '}
        <Link
          ref={refCallbackForFocusOnMount}
          to={currentDate.replaceAll('-', '/')}
        >
          <time dateTime={currentDate}>
            {weekdayDayMonthFormatter.format(new Date())}
          </time>
        </Link>
      </h1>
    </div>
  );
}
