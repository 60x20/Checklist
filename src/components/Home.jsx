import { Link } from 'react-router-dom';
import { useContext } from 'react';

// contexts
import { currentDateContext } from '../providers/CurrentDateProvider';
import { refCallbackForFocusOnMount } from '../providers/RefProvider';

// helpers
import { weekdayDayMonthFormatter } from '../helpers/validateUnitsFromDate';

// custom hooks
import useDocumentTitle from '../custom-hooks/useDocumentTitle';

const Home = () => {
  const currentDate = useContext(currentDateContext);

  useDocumentTitle(undefined, 'Home'); // add to original title

  return (<div id="home">
    {/* focus on the anchor on mount; autoFocus isn't used since it doesn't work with <a> elements */}
    <h1>Today: <Link ref={refCallbackForFocusOnMount} to={currentDate.YMD.replaceAll('-', '/')}>
      <time dateTime={currentDate.YMD}>{ weekdayDayMonthFormatter.format(new Date()) }</time>
    </Link></h1>
  </div>);
}
 
export default Home;