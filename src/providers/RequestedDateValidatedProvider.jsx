import { createContext } from "react";
import { useParams } from "react-router-dom";

// helpers
import { validateUnitsFromDate } from "../helpers/validateUnitsFromDate";

export const requestedDateValidatedContext = createContext();

const RequestedDateValidatedProvider = ({ children }) => {
  const requestedDateAsParams = useParams();
  const { year, month, day } = requestedDateAsParams;
  // if any of them undefined, validation will throw, so immediately return {}; can happen because of menu
  const requestedDateValidated = year && month && day ? validateUnitsFromDate(requestedDateAsParams) : {};

  return (
    <requestedDateValidatedContext.Provider value={ requestedDateValidated }>
      { children }
    </requestedDateValidatedContext.Provider>
  );
}
 
export default RequestedDateValidatedProvider;