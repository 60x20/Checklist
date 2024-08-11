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
  
  function createTodoHandler(e) {
    e.preventDefault();
    const submittedFormData = new FormData(e.currentTarget);
    const formDataReadable = Object.fromEntries(submittedFormData.entries());
    const todoString = String(formDataReadable.todoName);
    
    const idAssigned = addToAllTodos(todoString);
    if (currentDate.YMD === [year, month, day].join('-')) {
      // if currentDate removes/adds a todo, template should adapt
      addToTodosTemplate(idAssigned);
    }
    setCurrentToDoData({...currentToDoData, [idAssigned]: 0});
  }

  // for rendering todos
  const allTodos = returnAllTodos();
  const currentToDoDataAsArray = Object.entries(currentToDoData);
  return (
    <div id="checklist">
      {`${day}-${month}-${year}`}
      <br></br>
      {/* <CreateToDo /> */}
      <form onSubmit={createTodoHandler}>
        <input type="text" name="todoName" required />
        <button>create</button>
      </form>
      <br></br>
      { currentToDoDataAsArray.map((array, i) => {
        // todos[todoId]
        const [ todoId, checked ] = array;
        return (
          <div key={i}>
            <p>{allTodos[todoId]}</p>
            <button type="button">update todo</button>
            <button type="button">remove</button>
            <input name="todo-state" type="checkbox" defaultChecked={checked} />
          </div>
        )
      }) }
      <br></br>
      {/* {currentDate.DMY} */}
    </div>
  );
}
 
export default Checklist;