// providers
import AmountOfClearsProvider from "../providers/AmountOfClearsProvider";

const Main = ({ children }) => {
  return (
    <main>
      <AmountOfClearsProvider>
        {children}
      </AmountOfClearsProvider>
    </main>
  );
}
 
export default Main;