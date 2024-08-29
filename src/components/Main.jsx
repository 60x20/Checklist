// providers
import AmountOfClearsProvider from "../providers/AmountOfClearsProvider";
import TodayClearedProvider from "../providers/TodayClearedProvider";
import RequestedDateValidatedProvider from "../providers/RequestedDateValidatedProvider";

const Main = ({ children }) => {
  return (
    <main>
      <AmountOfClearsProvider>
        <TodayClearedProvider>
          <RequestedDateValidatedProvider>
            {children}
          </RequestedDateValidatedProvider>
        </TodayClearedProvider>
      </AmountOfClearsProvider>
    </main>
  );
}
 
export default Main;