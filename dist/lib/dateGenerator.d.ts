/**
 * Generates a 2D array of Date objects, where each row represents a day and each column is a time increment.
 * @param startDate The start date
 * @param endDate The end date (exclusive)
 * @param incrementMinutes The interval in minutes between each date
 * @returns 2D array of Date objects
 */
export declare function generateDateArray2D(startDate: Date, endDate: Date, incrementMinutes: number): Date[][];
