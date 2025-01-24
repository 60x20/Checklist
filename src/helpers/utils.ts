export function capitalizeString(str: string) {
  return str[0].toUpperCase() + str.substring(1);
}

export function truncateString(str: string, maxCharSize = 10) {
  return str.length > maxCharSize ? str.substring(0, maxCharSize) + '...' : str;
}

/** Returns true if the array has at least 1 truthy member */
export function isArrTruthy(arr: unknown[]) {
  return arr.some(Boolean);
}

/** Parses as a decimal integer. This shouldn't be used if number isn't necessarily an integer. */
export function parseDecimal(str: string) {
  return parseInt(str, 10);
}

export function avoidNaN(num: number) {
  return num ? num : 0;
}
