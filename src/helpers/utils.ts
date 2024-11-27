export function capitalizeString(str: string) {
  return str[0].toUpperCase() + str.substring(1);
}

export function truncateString(str: string, maxCharSize = 10) {
  return str.length > maxCharSize ? str.substring(0, maxCharSize) + '...' : str;
}

export function isArrTruthy(arr: unknown[]) {
  return arr.some(Boolean);
}
