import { useReducer } from 'react';

export default function useForceRender() {
  return useReducer((prev: number) => prev + 1, 0);
}
