/**
 * Interface representing a single CBG (Continuous Glucose Monitoring) data point.
 * - `time`: ISO string representing the timestamp of the data point
 * - `value`: Numeric CBG value
 * - Additional properties may be present, depending on the template JSON
 */
export interface CbgDataPoint {
    time: string;
    value: number;
    [key: string]: unknown;
}
/**
 * Generates a payload of CBG data points for upload, using a template and provided values.
 * @param startDate - Start date of the data
 * @param endDate - End date of the data
 * @param incrementMinutes - Interval in minutes between data points
 * @param cbgValues - Array of CBG values to assign to each data point
 * @returns Promise resolving to an array of CBG data points
 */
export declare function cbgPayload(startDate: Date, endDate: Date, incrementMinutes: number, cbgValues: number[]): Promise<CbgDataPoint[]>;
/**
 * Utility function to duplicate entries in an array according to a counts array.
 * @param sourceArray - The array of items to duplicate
 * @param countsArray - The number of times to duplicate each item
 * @returns A new array with items duplicated as specified
 */
export declare function duplicateEntries<T>(sourceArray: T[], countsArray: number[]): T[];
