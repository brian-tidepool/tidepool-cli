
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
  // Work entirely in absolute milliseconds. Using fixed ms steps (rather than
  // Date.setMinutes, which does local-time arithmetic) keeps every day at exactly
  // 24h / (1440 / incrementMinutes) points even across DST transitions — e.g. a
  // fall-back day would otherwise lose an hour of points.
  const incrementMs = incrementMinutes * 60 * 1000;
  const dayMs = 24 * 60 * 60 * 1000;
  const endMs = endDate.getTime();
  let dayStartMs = startDate.getTime();
  while (dayStartMs < endMs) {
    const dayRow: Date[] = [];
    const dayEndMs = dayStartMs + dayMs;
    for (let t = dayStartMs; t < dayEndMs && t < endMs; t += incrementMs) {
      dayRow.push(new Date(t));
    }
    if (dayRow.length > 0) {
      result.push(dayRow);
    }
    dayStartMs += dayMs;
  }
  return result;
}



