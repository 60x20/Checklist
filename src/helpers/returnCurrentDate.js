export default function returnCurrentDate() {
  const currentDate = new Date();
  
  const year = currentDate.getFullYear();
  // month is zero-indexed
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  
  return ({
    DMY: [day, month, year].join('-'),
    YMD: [year, month, day].join('-')
  });
}