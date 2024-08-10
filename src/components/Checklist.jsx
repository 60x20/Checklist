import { useContext } from "react";
import { useContext, useEffect, useState } from "react";
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
  const [currentToDoData, setCurrentToDoData] = useState({});
  
  useEffect(() => {
    // values must be num, so that they are considered array indexes
    const unitsAsInt = [parseInt(year, 10), parseInt(month, 10), parseInt(day, 10)];
    validateToDoData(...unitsAsInt);
    setCurrentToDoData(returnTodoData(...unitsAsInt));
  }, [day, month, year]);
  
  return (
    <div id="checklist">
      {`${day}-${month}-${year}`}
      <br></br>
      {currentDate.DMY}
    </div>
  );
}
 
export default Checklist;