import { useContext } from "react";
import { useParams } from "react-router-dom";

// contexts
import { currentDateContext } from "../providers/CurrentDateProvider";

// helpers
import validateUnitsFromDate from "../helpers/validateUnitsFromDate";
import { addToTodosTemplate, removeFromTodosTemplate } from "../helpers/todosTemplateHelpers";
import { returnAllTodos, addToAllTodos, updateTodoString } from "../helpers/allTodosHelpers";
import { returnTodoData, validateToDoData } from "../helpers/todoDataHelpers";

const Checklist = () => {
  const requestedDateAsParams = useParams();
  const requestedDate = validateUnitsFromDate(requestedDateAsParams);
  const { year, month, day } = requestedDate;

  const currentDate = useContext(currentDateContext);
  
  return (
    <div id="checklist">
      {`${day}-${month}-${year}`}
      <br></br>
      {currentDate.DMY}
    </div>
  );
}
 
export default Checklist;