
export function useEffectDuringRender(callback, currentDeps = []) {
  const prevDeps = useRef(null);
  if (!depsShallowlyEqual(prevDeps.current, currentDeps)) {
    callback();
    prevDeps.current = currentDeps;
  }
}
