import { useLocation, useNavigate } from 'react-router-dom';

// helpers
import { confirmToResetAllData } from '../helpers/resetAllData';

const DataError = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  function resetAllDataAndNavigateHandler(e) {
    if (confirmToResetAllData()) navigate(pathname); // if reset, then refresh; pathname used over (0) to avoid re-loading
  }

  return (
    <div id="data-error" className="column-container">
      <h1>An error occurred.</h1>
      <p>
        resetting might solve the issue: <button onClick={resetAllDataAndNavigateHandler}>reset all data</button>
      </p>
    </div>
  );
};

export default DataError;
