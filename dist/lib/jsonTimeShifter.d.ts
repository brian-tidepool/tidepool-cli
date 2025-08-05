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
export declare function shiftJsonTimes(data: unknown, timezoneOffsetHours?: number): unknown;
/**
 * Get timezone offset in hours for common timezone abbreviations
 */
/**
 * Get timezone offset in hours for common timezone abbreviations.
 * @param timezone Timezone abbreviation (e.g., 'EST', 'JST')
 * @returns Offset in hours
 */
export declare function getTimezoneOffset(timezone: string): number;
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
export declare function shiftJsonFile(inputFilePath: string, timezoneOffset?: number | string, outputFilePath?: string): Promise<unknown>;
