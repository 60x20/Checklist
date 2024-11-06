export function capitalizeString(str) {
  return str[0].toUpperCase() + str.substring(1);
}

export function truncateString(str, maxCharSize = 10) {
  return str.length > maxCharSize ? str.substring(0, maxCharSize) + '...' : str;
}

export function isArrTruthy(arr) {
  return arr.some(Boolean);
}
