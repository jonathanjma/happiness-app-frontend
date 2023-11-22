/**
 * Formats a given date object in the format yyyy-mm-dd format
 * @param date 
 * @returns A string of the formatted date
 */
export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}