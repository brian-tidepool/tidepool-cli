import * as fs from 'fs/promises';

/**
 * Shifts all instances of the "time" field in a JSON object 
 * so that the latest occurrence becomes the current time in the specified timezone
 * @param data - The JSON data containing "time" fields
 * @param timezoneOffsetHours - Timezone offset in hours from UTC (e.g., -5 for EST, +9 for JST)
 * @returns The shifted JSON data
 */
export function shiftJsonTimes(data: any, timezoneOffsetHours: number = 0): any {
  if (!data) {
    console.log('Invalid data provided');
    return data;
  }

  // Find all timestamps for the "time" field
  const allTimestamps: Date[] = [];
  extractTimestamps(data, allTimestamps);

  if (allTimestamps.length === 0) {
    console.log('No valid timestamps found for "time" field');
    return data;
  }

  // Find the latest timestamp
  const latestTimestamp = new Date(Math.max(...allTimestamps.map(d => d.getTime())));
  
  // Calculate current time in the specified timezone
  const currentTimeUTC = new Date();
  const currentTimeInTimezone = new Date(currentTimeUTC.getTime() + (timezoneOffsetHours * 60 * 60 * 1000));
  
  // Calculate the time difference to shift by
  const timeDifference = currentTimeInTimezone.getTime() - latestTimestamp.getTime();

  console.log(`Field: "time"`);
  console.log(`Timezone offset: ${timezoneOffsetHours >= 0 ? '+' : ''}${timezoneOffsetHours} hours`);
  console.log(`Found ${allTimestamps.length} timestamp(s)`);
  console.log(`Shifting times by ${timeDifference}ms (${Math.round(timeDifference / 1000 / 60)} minutes)`);
  console.log(`Latest timestamp was: ${latestTimestamp.toISOString()}`);
  console.log(`Current time (UTC): ${currentTimeUTC.toISOString()}`);
  console.log(`Current time (target timezone): ${currentTimeInTimezone.toISOString()}`);
  console.log(`Latest timestamp will become: ${currentTimeInTimezone.toISOString()}`);

  // Apply the shift to all instances of the "time" field
  return shiftTimestamps(data, timeDifference);
}

/**
 * Extract all timestamps from "time" fields at the top level of the data
 */
function extractTimestamps(obj: any, timestamps: Date[]): void {
  if (obj === null || obj === undefined) return;

  if (Array.isArray(obj)) {
    // For arrays, check each item's top-level "time" field
    obj.forEach(item => {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        if (item.hasOwnProperty('time')) {
          const value = item.time;
          if (value) {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              timestamps.push(date);
            }
          }
        }
      }
    });
  } else if (typeof obj === 'object') {
    // For objects, check only top-level "time" field
    if (obj.hasOwnProperty('time')) {
      const value = obj.time;
      if (value) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          timestamps.push(date);
        }
      }
    }
  }
}

/**
 * Apply time shift to all instances of the "time" field
 */
function shiftTimestamps(obj: any, timeDifference: number): any {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => shiftTimestamps(item, timeDifference));
  }

  if (typeof obj === 'object') {
    const result: any = {};
    
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      
      if (key === 'time' && (typeof value === 'string' || typeof value === 'number')) {
        const originalDate = new Date(value);
        if (!isNaN(originalDate.getTime())) {
          const shiftedDate = new Date(originalDate.getTime() + timeDifference);
          // Preserve original format: number for timestamps, string for ISO dates
          result[key] = typeof value === 'number' ? shiftedDate.getTime() : shiftedDate.toISOString();
        } else {
          result[key] = value;
        }
      } else if (typeof value === 'object') {
        result[key] = shiftTimestamps(value, timeDifference);
      } else {
        result[key] = value;
      }
    });
    
    return result;
  }

  return obj;
}

/**
 * Get timezone offset in hours for common timezone abbreviations
 */
export function getTimezoneOffset(timezone: string): number {
  const timezones: { [key: string]: number } = {
    'UTC': 0, 'GMT': 0,
    'EST': -5, 'EDT': -4,
    'CST': -6, 'CDT': -5,
    'MST': -7, 'MDT': -6,
    'PST': -8, 'PDT': -7,
    'JST': 9,
    'CET': 1, 'CEST': 2,
    'BST': 1,
    'IST': 5.5,
    'AEST': 10, 'AEDT': 11
  };
  
  const tz = timezone.toUpperCase();
  if (timezones.hasOwnProperty(tz)) {
    return timezones[tz];
  }
  
  throw new Error(`Unknown timezone: ${timezone}. Use numeric offset instead (e.g., -5 for EST, +9 for JST)`);
}

/**
 * Main function to process a JSON file
 * @param inputFilePath - Path to the input JSON file
 * @param timezoneOffset - Timezone offset in hours from UTC, or timezone abbreviation (e.g., -5, 'EST', 'JST')
 * @param outputFilePath - Path to save the shifted JSON file (optional, defaults to inputFilePath)
 */
export async function shiftJsonFile(
  inputFilePath: string, 
  timezoneOffset: number | string = 0,
  outputFilePath?: string
): Promise<any> {
  try {
    // Convert timezone string to offset if needed
    const offsetHours = typeof timezoneOffset === 'string' 
      ? getTimezoneOffset(timezoneOffset)
      : timezoneOffset;

    // Read the JSON file asynchronously
    const fileContent = await fs.readFile(inputFilePath, 'utf8');
    const jsonData = JSON.parse(fileContent);

    // Shift the times
    const shiftedData = shiftJsonTimes(jsonData, offsetHours);

    // Write back to file asynchronously
    const output = outputFilePath || inputFilePath;
    await fs.writeFile(output, JSON.stringify(shiftedData, null, 2));

    return shiftedData;


    console.log(`Successfully shifted times in ${inputFilePath}`);
    if (outputFilePath) {
      console.log(`Output saved to ${outputFilePath}`);
    }
  } catch (error) {
    console.error('Error processing JSON file:', error);
    throw error;
  }
}

// Example usage:
// await shiftJsonFile('data.json', -5);  // EST timezone
// await shiftJsonFile('data.json', 'EST');  // EST timezone using abbreviation
// await shiftJsonFile('data.json', 9, 'shifted-data.json');  // JST timezone
// await shiftJsonFile('data.json', 'JST', 'shifted-data.json');  // JST timezone using abbreviation

// Example of direct usage with JSON data:
// const shiftedData = shiftJsonTimes(yourJsonObject, -5);