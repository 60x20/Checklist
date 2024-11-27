import { useReducer } from 'react';

const useForceRender = () => useReducer((prev: number) => prev + 1, 0);
export default useForceRender;
