import { useReducer } from "react";

const useForceRender = () => useReducer((prev) => prev + 1, 0);
export default useForceRender;
