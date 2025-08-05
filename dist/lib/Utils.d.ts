/**
 * Resizes each row of a 2D array to match the length of a 1D reference array, then pairs each element with the corresponding 1D value to create a 3D array.
 * @param array2D The 2D array to resize and pair
 * @param array1D The 1D reference array
 * @returns A 3D array where each innermost array contains a value from the 2D array and the corresponding value from the 1D array
 */
export declare function resizeAndAdd3D<T>(array2D: T[][], array1D: T[]): T[][][];
/**
 * Like resizeAndAdd3D, but pads with a provided default value instead of undefined.
 * @param array2D The 2D array to resize and pair
 * @param array1D The 1D reference array
 * @param defaultValue The value to use for padding
 * @returns A 3D array where each innermost array contains a value from the 2D array (or default) and the corresponding value from the 1D array
 */
export declare function resizeAndAdd3DWithDefault<T>(array2D: T[][], array1D: T[], defaultValue: T): T[][][];
/**
 * Result of a percentage calculation rounded up.
 */
export interface PercentageResultRoundedUp {
    percentage: number;
    exactValue: number;
    roundedUp: number;
    remainder: number;
}
/**
 * Result of a percentage calculation rounded down.
 */
export interface PercentageResultRoundedDown {
    percentage: number;
    exactValue: number;
    roundedDown: number;
    remainder: number;
}
/**
 * Calculates the value for a given percentage of a base, rounding up.
 * @param percentage The percentage to calculate
 * @param baseValue The base value (default: 288)
 * @returns The result with exact, rounded up, and remainder values
 */
export declare function calculatePercentageRoundUp(percentage: number, baseValue?: number): PercentageResultRoundedUp;
/**
 * Calculates the value for a given percentage of a base, rounding down.
 * @param percentage The percentage to calculate
 * @param baseValue The base value (default: 288)
 * @returns The result with exact, rounded down, and remainder values
 */
export declare function calculatePercentageRoundDown(percentage: number, baseValue?: number): PercentageResultRoundedDown;
/**
 * (For development) Example usage of utility functions. Uncomment to test in isolation.
 */
/**
 * Asynchronous sleep utility.
 * @param ms Milliseconds to sleep
 * @returns Promise that resolves after the specified time
 */
export declare function sleep(ms: number): Promise<void>;
