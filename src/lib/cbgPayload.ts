import * as utils from "./Utils.js";
import * as dateGenerator from "./dateGenerator.js";

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
export async function cbgPayload(
  startDate: Date,
  endDate: Date,
  incrementMinutes: number,
  cbgValues: number[],
  deviceId?: number
): Promise<CbgDataPoint[]> {
  const dateArray = dateGenerator.generateDateArray2D(startDate, endDate, incrementMinutes);
  const dateArrayString = dateArray.map((row) => row.map((value) => value.toISOString()));
  const stringArray1D = cbgValues.map((value) => value.toString());
  const result = utils.resizeAndAdd3D(dateArrayString, stringArray1D);

  // Dynamically import the CBG template JSON
  const { default: jsonData } = await import("../data/cbg.json", { with: { type: "json" } });
  const payload: CbgDataPoint[] = [];

  result.forEach((day: string[][]) => {
    day.forEach((date: string[]) => {
      const dataPoint: CbgDataPoint = { ...structuredClone(jsonData) };
      dataPoint.time = date[0];
      dataPoint.value = Number(date[1]);
      dataPoint.deviceId = dataPoint.deviceId + (deviceId?.toString() ?? "");
      payload.push(dataPoint);
    });
  });

  return payload;
}

/**
 * Utility function to duplicate entries in an array according to a counts array.
 * @param sourceArray - The array of items to duplicate
 * @param countsArray - The number of times to duplicate each item
 * @returns A new array with items duplicated as specified
 */
export function duplicateEntries<T>(sourceArray: T[], countsArray: number[]): T[] {
  return sourceArray.flatMap((item, index) => Array(countsArray[index] || 0).fill(item));
}

export async function cbgPayloadSampleInterval(
  startDate: Date,
  timeInSeconds: number[],
  sampleIntervals: number[],
  deviceId?: number
): Promise<CbgDataPoint[]> {
  // Validate arrays have same length
  if (timeInSeconds.length !== sampleIntervals.length) {
    throw new Error("timeInSeconds, sampleIntervals, and cbgValues arrays must have the same length");
  }

  // Dynamically import the CBG template JSON
  const { default: jsonData } = await import("../data/cbg.json", { with: { type: "json" } });
  const payload: CbgDataPoint[] = [];

  let currentDate = new Date(startDate);

  for (let i = 0; i < timeInSeconds.length; i++) {
    const dataPoint: CbgDataPoint = { ...structuredClone(jsonData) };

    // Add timeInSeconds[i] to get the current point's date
    currentDate = new Date(startDate.getTime() + timeInSeconds[i] * 1000);
    dataPoint.time = currentDate.toISOString();

    dataPoint.sampleInterval = sampleIntervals[i];
    dataPoint.deviceId = dataPoint.deviceId + (deviceId?.toString() ?? "");

    payload.push(dataPoint);
  }

  // Add final point at 23:55 of the current day (timezone aware)
  const lastDate = new Date(currentDate);
  lastDate.setHours(23, 55, 0, 0);

  const finalDataPoint: CbgDataPoint = { ...structuredClone(jsonData) };
  finalDataPoint.time = lastDate.toISOString();
  finalDataPoint.sampleInterval = sampleIntervals[sampleIntervals.length - 1]; // Use last interval
  finalDataPoint.deviceId = finalDataPoint.deviceId + (deviceId?.toString() ?? "");

  payload.push(finalDataPoint);

  return payload;
}
