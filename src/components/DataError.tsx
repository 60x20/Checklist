import { useLocation, useNavigate, useRouteError } from 'react-router-dom';

// helpers
import { confirmToResetAllData } from '../helpers/resetAllData';
import { truncateString } from '../helpers/utils';

function DataError() {
  const error = useRouteError();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  function resetAllDataAndNavigateHandler() {
    if (confirmToResetAllData()) navigate(pathname); // if reset, then refresh; pathname used over (0) to avoid re-loading
  }

  return (
    <div id="data-error" className="column-container">
      <h1>An error occurred.</h1>
      <p>{truncateString(String(error), 100)}</p>
      <p>
        resetting might solve the issue:{' '}
        <button onClick={resetAllDataAndNavigateHandler}>reset all data</button>
      </p>
    </div>
  );
}

export default DataError;
