export const dayInMs = 1000 * 60 * 60 * 24;

export interface DateWithFormats {
  // DMY: string;
  YMD: string;
  // date: { year: number; month: string; day: string };
}

function returnDate(date: Date): DateWithFormats {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // month is zero-indexed
  const day = String(date.getDate()).padStart(2, '0');

  return {
    // DMY: [day, month, year].join('-'),
    YMD: [year, month, day].join('-'),
    // date: { year, month, day },
  };
}

export function returnCurrentDate() {
  const currentDate = new Date();
  return returnDate(currentDate);
}

export function returnDateFromToday(day: number) {
  const currentDate = Date.now();
  const relativeDate = new Date(currentDate + day * dayInMs);
  return returnDate(relativeDate);
}
