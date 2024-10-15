// providers
import AllDataClearedProvider from "../providers/AllDataClearedProvider";
import TodayClearedProvider from "../providers/TodayClearedProvider";
import RequestedDateValidatedProvider from "../providers/RequestedDateValidatedProvider";

const Main = ({ children }) => {
  return (<main>
    <AllDataClearedProvider>
      <TodayClearedProvider>
        <RequestedDateValidatedProvider>
          {children}
        </RequestedDateValidatedProvider>
      </TodayClearedProvider>
    </AllDataClearedProvider>
  </main>);
}
 
export default Main;