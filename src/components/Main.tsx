// providers
import AllDataClearedProvider from '../providers/AllDataClearedProvider';
import TodayClearedProvider from '../providers/TodayClearedProvider';
import RequestedDateValidatedProvider from '../providers/RequestedDateValidatedProvider';

// types
import ChildrenProp from '../custom-types/ChildrenProp';

const Main = ({ children }: ChildrenProp) => {
  return (
    <main>
      <AllDataClearedProvider>
        <TodayClearedProvider>
          <RequestedDateValidatedProvider>
            {children}
          </RequestedDateValidatedProvider>
        </TodayClearedProvider>
      </AllDataClearedProvider>
    </main>
  );
};

export default Main;
