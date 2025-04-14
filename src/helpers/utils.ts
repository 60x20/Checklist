export function capitalizeString(str: string) {
  return str[0].toUpperCase() + str.substring(1);
}

/** @todo rename to truncateStringWithEllipsis */
export function truncateString(str: string, maxCharSize = 10) {
  return str.length > maxCharSize ? str.substring(0, maxCharSize) + '...' : str;
}

/** @returns true if the array has at least 1 truthy member */
export function isArrTruthy(arr: unknown[]) {
  return arr.some(Boolean);
}

// export function avoidNaN(num: number) {
//   return num || 0;
// }
export function avoidNaNWithEmptyString(num: number) {
  return isNaN(num) ? '' : num;
}

export function assertCondition(
  condition: boolean,
  reason: string,
): asserts condition {
  if (!condition)
    throw new Error(`Assertion failed. Reason for assertion: ${reason}`);
}
