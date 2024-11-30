export function capitalizeString(str: string) {
  return str[0].toUpperCase() + str.substring(1);
}

export function truncateString(str: string, maxCharSize = 10) {
  return str.length > maxCharSize ? str.substring(0, maxCharSize) + '...' : str;
}

export function isArrTruthy(arr: unknown[]) {
  return arr.some(Boolean);
}

export function parseDecimal(str: string) {
  // this shouldn't be used if number isn't necessarily an integer
  return parseInt(str, 10);
}

export function avoidNaN(num: number) {
  return num ? num : 0;
}
