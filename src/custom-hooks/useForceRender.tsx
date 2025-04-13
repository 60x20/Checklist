import { useReducer } from 'react';

function useForceRender() {
  return useReducer((prev: number) => prev + 1, 0);
}
export default useForceRender;
