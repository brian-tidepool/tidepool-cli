import * as fs from 'fs/promises';
/**
 * Shifts all instances of the "time" field in a JSON object
 * so that the latest occurrence becomes the current time in the specified timezone
 * @param data - The JSON data containing "time" fields
 * @param timezoneOffsetHours - Timezone offset in hours from UTC (e.g., -5 for EST, +9 for JST)
 * @returns The shifted JSON data
 */
/**
 * Shifts all instances of the "time" field in a JSON object so that the latest occurrence becomes the current time in the specified timezone.
 * @param data The JSON data containing "time" fields
 * @param timezoneOffsetHours Timezone offset in hours from UTC (e.g., -5 for EST, +9 for JST)
 * @returns The shifted JSON data
 */
export function shiftJsonTimes(data, timezoneOffsetHours = 0) {
    if (!data) {
        // console.log('Invalid data provided');
        return data;
    }
    const allTimestamps = [];
    extractTimestamps(data, allTimestamps);
    if (allTimestamps.length === 0) {
        // console.log('No valid timestamps found for "time" field');
        return data;
    }
    const latestTimestamp = new Date(Math.max(...allTimestamps.map(d => d.getTime())));
    const currentTimeUTC = new Date();
    const currentTimeInTimezone = new Date(currentTimeUTC.getTime() + (timezoneOffsetHours * 60 * 60 * 1000));
    const timeDifference = currentTimeInTimezone.getTime() - latestTimestamp.getTime();
    // Optionally, log details for debugging:
    // console.log(`Field: "time"`);
    // console.log(`Timezone offset: ${timezoneOffsetHours >= 0 ? '+' : ''}${timezoneOffsetHours} hours`);
    // console.log(`Found ${allTimestamps.length} timestamp(s)`);
    // console.log(`Shifting times by ${timeDifference}ms (${Math.round(timeDifference / 1000 / 60)} minutes)`);
    // console.log(`Latest timestamp was: ${latestTimestamp.toISOString()}`);
    // console.log(`Current time (UTC): ${currentTimeUTC.toISOString()}`);
    // console.log(`Current time (target timezone): ${currentTimeInTimezone.toISOString()}`);
    // console.log(`Latest timestamp will become: ${currentTimeInTimezone.toISOString()}`);
    return shiftTimestamps(data, timeDifference);
}
/**
 * Extract all timestamps from "time" fields at the top level of the data
 */
/**
 * Extract all timestamps from "time" fields at the top level of the data.
 * @param obj The object or array to search
 * @param timestamps Array to collect found Date objects
 */
function extractTimestamps(obj, timestamps) {
    if (obj === null || obj === undefined)
        return;
    if (Array.isArray(obj)) {
        obj.forEach(item => {
            if (item && typeof item === 'object' && !Array.isArray(item)) {
                const record = item;
                if ('time' in record) {
                    const value = record['time'];
                    if (value) {
                        const date = new Date(value);
                        if (!isNaN(date.getTime())) {
                            timestamps.push(date);
                        }
                    }
                }
            }
        });
    }
    else if (typeof obj === 'object') {
        const record = obj;
        if ('time' in record) {
            const value = record['time'];
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
/**
 * Apply time shift to all instances of the "time" field.
 * @param obj The object or array to shift
 * @param timeDifference The time difference in ms to shift
 * @returns The shifted object/array
 */
function shiftTimestamps(obj, timeDifference) {
    if (obj === null || obj === undefined)
        return obj;
    if (Array.isArray(obj)) {
        return obj.map(item => shiftTimestamps(item, timeDifference));
    }
    if (typeof obj === 'object') {
        const record = obj;
        const result = {};
        Object.keys(record).forEach(key => {
            const value = record[key];
            if (key === 'time' && (typeof value === 'string' || typeof value === 'number')) {
                const originalDate = new Date(value);
                if (!isNaN(originalDate.getTime())) {
                    const shiftedDate = new Date(originalDate.getTime() + timeDifference);
                    result[key] = typeof value === 'number' ? shiftedDate.getTime() : shiftedDate.toISOString();
                }
                else {
                    result[key] = value;
                }
            }
            else if (typeof value === 'object') {
                result[key] = shiftTimestamps(value, timeDifference);
            }
            else {
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
/**
 * Get timezone offset in hours for common timezone abbreviations.
 * @param timezone Timezone abbreviation (e.g., 'EST', 'JST')
 * @returns Offset in hours
 */
export function getTimezoneOffset(timezone) {
    const timezones = {
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
/**
 * Main function to process a JSON file and shift all "time" fields.
 * @param inputFilePath Path to the input JSON file
 * @param timezoneOffset Timezone offset in hours from UTC, or timezone abbreviation (e.g., -5, 'EST', 'JST')
 * @param outputFilePath Path to save the shifted JSON file (optional, defaults to inputFilePath)
 * @returns The shifted JSON data
 */
export async function shiftJsonFile(inputFilePath, timezoneOffset = 0, outputFilePath) {
    try {
        const offsetHours = typeof timezoneOffset === 'string'
            ? getTimezoneOffset(timezoneOffset)
            : timezoneOffset;
        const fileContent = await fs.readFile(inputFilePath, 'utf8');
        const jsonData = JSON.parse(fileContent);
        const shiftedData = shiftJsonTimes(jsonData, offsetHours);
        const output = outputFilePath || inputFilePath;
        await fs.writeFile(output, JSON.stringify(shiftedData, null, 2));
        return shiftedData;
        // Optionally, log success:
        // console.log(`Successfully shifted times in ${inputFilePath}`);
        // if (outputFilePath) {
        //   console.log(`Output saved to ${outputFilePath}`);
        // }
    }
    catch (error) {
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
