
/**
 * Generates a 2D array of Date objects, where each row represents a day and each column is a time increment.
 * @param startDate The start date
 * @param endDate The end date (exclusive)
 * @param incrementMinutes The interval in minutes between each date
 * @returns 2D array of Date objects
 */
export function generateDateArray2D(
  startDate: Date,
  endDate: Date,
  incrementMinutes: number
): Date[][] {
  const result: Date[][] = [];
  let currentDate = new Date(startDate);
  while (currentDate < endDate) {
    const dayRow: Date[] = [];
    const dayStart = new Date(currentDate);
    const dayEnd = new Date(currentDate);
    dayEnd.setDate(dayStart.getDate() + 1);
    const dayIterator = new Date(dayStart);
    while (dayIterator < endDate && dayIterator < dayEnd) {
      dayRow.push(new Date(dayIterator));
      dayIterator.setMinutes(dayIterator.getMinutes() + incrementMinutes);
    }
    if (dayRow.length > 0) {
      result.push(dayRow);
    }
    currentDate = new Date(dayIterator);
  }
  return result;
}



