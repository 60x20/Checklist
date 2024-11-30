/*
import { useRef } from 'react';

function depsShallowlyEqual(
  firstDeps: unknown[] | null,
  secondDeps: unknown[] | null,
) {
  if (firstDeps === null || secondDeps === null) return false;

  // deps assumed to be arrays of the same length
  if (firstDeps.length !== secondDeps.length) return false;

  for (let i = 0; i < firstDeps.length; i++) {
    if (firstDeps[i] !== secondDeps[i]) return false;
  }
  return true;
}

function useEffectDuringRender(
  callback: () => void,
  currentDeps: unknown[] = [],
) {
  const prevDeps = useRef<unknown[] | null>(null);
  if (!depsShallowlyEqual(prevDeps.current, currentDeps)) {
    callback();
    prevDeps.current = currentDeps;
  }
}
*/
