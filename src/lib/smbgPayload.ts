import * as utils from './Utils.js';
import * as dateGenerator from './dateGenerator.js';






/**
 * Interface representing a single CBG (Continuous Glucose Monitoring) data point.
 * - `time`: ISO string representing the timestamp of the data point
 * - `value`: Numeric CBG value
 * - Additional properties may be present, depending on the template JSON
 */
export interface SmbgDataPoint {
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
export async function smbgPayload(
  startDate: Date,
  endDate: Date,
  incrementMinutes: number,
  smbgValues: number[]
): Promise<SmbgDataPoint[]> {
  const dateArray = dateGenerator.generateDateArray2D(startDate, endDate, incrementMinutes);
  const dateArrayString = dateArray.map(row => row.map(value => value.toISOString()));
  const stringArray1D = smbgValues.map(value => value.toString());
  const result = utils.resizeAndAdd3D(dateArrayString, stringArray1D);

  // Dynamically import the SMBG template JSON
  const { default: jsonData } = await import('../data/smbg.json', { with: { type: 'json' } });
  const payload: SmbgDataPoint[] = [];

  result.forEach((day: string[][]) => {
    day.forEach((date: string[]) => {
      const dataPoint: SmbgDataPoint = { ...structuredClone(jsonData) };
      dataPoint.time = date[0];
      dataPoint.value = Number(date[1]);
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
  return sourceArray.flatMap((item, index) =>
    Array(countsArray[index] || 0).fill(item)
  );
}


/**
 * Generate x number of data points that produce an exact average of y,
 * with optional bounds on the values.
 * 
 * @param x - Number of data points to generate
 * @param y - Target average
 * @param options - Optional bounds for data points
 * @returns Array of x data points with exact average y
 * @throws Error if constraints cannot be satisfied
 */



/**
 * Options for bounded exact average generation
 */
export interface BoundedAverageOptions {
    minVal?: number;
    maxVal?: number;
}

export function generateExactAverageBounded(
    x: number, 
    y: number, 
    options: BoundedAverageOptions = {}
): number[] {
    const { minVal = 0, maxVal = 20 } = options;
    
    if (x <= 0) {
        throw new Error("Number of data points (x) must be positive");
    }
    
    if (x === 1) {
        return [y];
    }
    
    // Check if bounded average is possible
    if (y < minVal) {
        throw new Error(`Target average ${y} is below minimum bound ${minVal}`);
    }
    if (y > maxVal) {
        throw new Error(`Target average ${y} is above maximum bound ${maxVal}`);
    }
    
    const dataPoints: number[] = [];
    let remainingSum = x * y;
    let remainingPoints = x;
    
    for (let i = 0; i < x - 1; i++) {
        // Calculate bounds for this point to ensure final point stays within bounds
        const remainingAfterThis = remainingPoints - 1;
        
        let pointMin: number;
        let pointMax: number;
        
        if (minVal !== undefined && maxVal !== undefined) {
            // Calculate what range keeps the final point in bounds
            pointMax = Math.min(maxVal, remainingSum - remainingAfterThis * minVal);
            pointMin = Math.max(minVal, remainingSum - remainingAfterThis * maxVal);
        } else if (minVal !== undefined) {
            pointMin = minVal;
            pointMax = remainingSum - remainingAfterThis * minVal;
        } else if (maxVal !== undefined) {
            pointMax = maxVal;
            pointMin = remainingSum - remainingAfterThis * maxVal;
        } else {
            // No bounds - use range around target average
            const spread = Math.abs(y) || 10;
            pointMin = y - spread;
            pointMax = y + spread;
        }
        
        // Ensure valid range
        if (pointMin > pointMax) {
            throw new Error("Cannot generate points within given bounds for this average");
        }
        
        // Generate random point within calculated bounds
        const currentPoint = pointMin + Math.random() * (pointMax - pointMin);
        dataPoints.push(currentPoint);
        
        remainingSum -= currentPoint;
        remainingPoints -= 1;
    }
    
    // Add the final point (calculated to achieve exact average)
    const finalPoint = remainingSum;
    
    // Check if final point is within bounds
    if (finalPoint < minVal) {
        throw new Error("Cannot achieve exact average within given bounds");
    }
    if (finalPoint > maxVal) {
        throw new Error("Cannot achieve exact average within given bounds");
    }
    
    dataPoints.push(finalPoint);
    
    return dataPoints;
}

