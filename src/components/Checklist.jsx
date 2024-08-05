import { useParams } from "react-router-dom";
// helpers
import validateUnitsFromDate from "../helpers/validateUnitsFromDate";

const Checklist = () => {
  const requestedDateAsParams = useParams();
  const requestedDate = validateUnitsFromDate(requestedDateAsParams);
  const { year, month, day } = requestedDate;
  return (
    <div id="checklist">
      {`${day}-${month}-${year}`}
      <br></br>
    </div>
  );
}
 
export default Checklist;