// providers
import AmountOfClearsProvider from "../providers/AmountOfClearsProvider";
import RequestedDateValidatedProvider from "../providers/RequestedDateValidatedProvider";

const Main = ({ children }) => {
  return (
    <main>
      <AmountOfClearsProvider>
          <RequestedDateValidatedProvider>
            {children}
          </RequestedDateValidatedProvider>
      </AmountOfClearsProvider>
    </main>
  );
}
 
export default Main;