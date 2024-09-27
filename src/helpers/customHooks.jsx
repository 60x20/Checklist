import { useRef } from "react";

function depsShallowlyEqual(firstDeps, secondDeps) {
  // deps assumed to be arrays of the same length
  if (firstDeps === null || secondDeps === null) return false;

  for (let i = 0; i < firstDeps.length; i++) {
    if (firstDeps[i] !== secondDeps[i]) return false;
  }
  return true;
}

function useEffectDuringRender(callback, currentDeps = []) {
  const prevDeps = useRef(null);
  if (!depsShallowlyEqual(prevDeps.current, currentDeps)) {
    callback();
    prevDeps.current = currentDeps;
  }
}
