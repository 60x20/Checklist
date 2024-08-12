import { createContext, useState } from "react";

export const amountOfClearsContext = createContext();

const AmountOfClearsProvider = ({ children }) => {
  // inform the children, if clear occurs; let them clean-up

  // instead of true-false, numbers used, with this approach there won't be unnecessary re-renderings
  const [amountOfClears, setAmountOfClears] = useState(0);
  function increaseAmountOfClears() {
    setAmountOfClears((prevAmount) => prevAmount + 1);
  }

  return ( 
    <amountOfClearsContext.Provider value={{ amountOfClears, increaseAmountOfClears }}>
      {children}
    </amountOfClearsContext.Provider>
  );
}
 
export default AmountOfClearsProvider;