import { useNavigate } from "react-router-dom";

// helpers
import { confirmToResetAllData } from "../helpers/resetAllData";

const DataError = () => {
  const navigate = useNavigate();
  function resetAllDataAndNavigateHandler() {
    if (confirmToResetAllData()) navigate(0); // if reset, then refresh
  }

  return (<div id="data-error" className="column-container">
    <h1>An error occurred.</h1>
    <p>resetting might solve the issue: <button onClick={resetAllDataAndNavigateHandler}>reset all data</button></p>
  </div>);
};

export default DataError;
