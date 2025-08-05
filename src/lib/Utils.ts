
/**
 * Resizes each row of a 2D array to match the length of a 1D reference array, then pairs each element with the corresponding 1D value to create a 3D array.
 * @param array2D The 2D array to resize and pair
 * @param array1D The 1D reference array
 * @returns A 3D array where each innermost array contains a value from the 2D array and the corresponding value from the 1D array
 */
export function resizeAndAdd3D<T>(
  array2D: T[][],
  array1D: T[]
): T[][][] {
  const targetSize = array1D.length;
  const resized2D = array2D.map(row => {
    if (row.length > targetSize) {
      return row.slice(0, targetSize);
    } else if (row.length < targetSize) {
      const padding = new Array(targetSize - row.length).fill(undefined as unknown as T);
      return [...row, ...padding];
    }
    return row;
  });
  return resized2D.map(row => row.map((value, index) => [value, array1D[index]]));
}


/**
 * Like resizeAndAdd3D, but pads with a provided default value instead of undefined.
 * @param array2D The 2D array to resize and pair
 * @param array1D The 1D reference array
 * @param defaultValue The value to use for padding
 * @returns A 3D array where each innermost array contains a value from the 2D array (or default) and the corresponding value from the 1D array
 */
export function resizeAndAdd3DWithDefault<T>(
  array2D: T[][],
  array1D: T[],
  defaultValue: T
): T[][][] {
  const targetSize = array1D.length;
  const resized2D = array2D.map(row => {
    if (row.length > targetSize) {
      return row.slice(0, targetSize);
    } else if (row.length < targetSize) {
      const padding = new Array(targetSize - row.length).fill(defaultValue);
      return [...row, ...padding];
    }
    return row;
  });
  return resized2D.map(row => row.map((value, index) => [value, array1D[index]]));
}












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
export function calculatePercentageRoundUp(percentage: number, baseValue: number = 288): PercentageResultRoundedUp {
  const exactValue = (percentage / 100) * baseValue;
  const roundedUp = Math.ceil(exactValue);
  const remainder = baseValue - roundedUp;
  return {
    percentage,
    exactValue,
    roundedUp,
    remainder
  };
}



/**
 * Calculates the value for a given percentage of a base, rounding down.
 * @param percentage The percentage to calculate
 * @param baseValue The base value (default: 288)
 * @returns The result with exact, rounded down, and remainder values
 */
export function calculatePercentageRoundDown(percentage: number, baseValue: number = 288): PercentageResultRoundedDown {
  const exactValue = (percentage / 100) * baseValue;
  const roundedDown = Math.floor(exactValue);
  const remainder = baseValue - roundedDown;
  return {
    percentage,
    exactValue,
    roundedDown,
    remainder
  };
}




/**
 * (For development) Example usage of utility functions. Uncomment to test in isolation.
 */
// export function usage() {
//   const original2D = [
//     [1, 2, 3, 4, 5],
//     [6, 7, 8],
//     [9, 10, 11, 12],
//     [13, 14]
//   ];
//   const reference1D = [100, 200, 300];
//   console.log("Original 2D array:", original2D);
//   console.log("Reference 1D array:", reference1D);
//   const result1 = resizeAndAdd3D(original2D, reference1D);
//   console.log("Result with 3D transformation:", result1);
//   const result2 = resizeAndAdd3DWithDefault(original2D, reference1D, 0);
//   console.log("Result with default fill value:", result2);
//   const stringArray2D = [
//     ["a", "b", "c", "d"],
//     ["e", "f"],
//     ["g", "h", "i"]
//   ];
//   const stringArray1D = ["x", "y"];
//   const stringResult = resizeAndAdd3DWithDefault(stringArray2D, stringArray1D, "");
//   console.log("String array result:", stringResult);
// }


/**
 * Asynchronous sleep utility.
 * @param ms Milliseconds to sleep
 * @returns Promise that resolves after the specified time
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}