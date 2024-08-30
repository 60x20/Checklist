// providers
import AmountOfClearsProvider from "../providers/AmountOfClearsProvider";
import TodayClearedProvider from "../providers/TodayClearedProvider";
import RequestedDateValidatedProvider from "../providers/RequestedDateValidatedProvider";
import CreateTodoFocusProvider from "../providers/CreateTodoFocusProvider";

const Main = ({ children }) => {
  return (
    <main>
      <AmountOfClearsProvider>
        <TodayClearedProvider>
          <RequestedDateValidatedProvider>
            <CreateTodoFocusProvider>
              {children}
            </CreateTodoFocusProvider>
          </RequestedDateValidatedProvider>
        </TodayClearedProvider>
      </AmountOfClearsProvider>
    </main>
  );
}
 
export default Main;