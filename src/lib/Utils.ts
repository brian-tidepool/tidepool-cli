export function resizeAndAdd3D<T>(
  array2D: T[][],
  array1D: T[]
): T[][][] {
  const targetSize = array1D.length;

  // Resize the second dimension of the 2D array
  const resized2D = array2D.map(row => {
    if (row.length > targetSize) {
      // Truncate if longer
      return row.slice(0, targetSize);
    } else if (row.length < targetSize) {
      // Pad with undefined or default values if shorter
      const padding = new Array(targetSize - row.length).fill(undefined);
      return [...row, ...padding];
    }
    return row; // Same size, no change needed
  });

  // Create 3D array by pairing each element with corresponding 1D array element
  const result3D: T[][][] = resized2D.map(row => {
    return row.map((value, index) => [value, array1D[index]]);
  });

  return result3D;
}

// Alternative version that preserves original values with a default fill value
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

  // Create 3D array by pairing each element with corresponding 1D array element
  const result3D: T[][][] = resized2D.map(row => {
    return row.map((value, index) => [value, array1D[index]]);
  });

  return result3D;
}











export interface PercentageResultRoundedUp {
  percentage: number;
  exactValue: number;
  roundedUp: number;
  remainder: number;
}


export interface PercentageResultRoundedDown {
  percentage: number;
  exactValue: number;
  roundedDown: number;
  remainder: number;
}

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



export function usage() {


  // Example usage:
  const original2D = [
    [1, 2, 3, 4, 5],
    [6, 7, 8],
    [9, 10, 11, 12],
    [13, 14]
  ];

  const reference1D = [100, 200, 300];

  console.log("Original 2D array:", original2D);
  console.log("Reference 1D array:", reference1D);

  const result1 = resizeAndAdd3D(original2D, reference1D);
  console.log("Result with 3D transformation:", result1);

  const result2 = resizeAndAdd3DWithDefault(original2D, reference1D, 0);
  console.log("Result with default fill value:", result2);

  // Type-safe example with strings
  const stringArray2D = [
    ["a", "b", "c", "d"],
    ["e", "f"],
    ["g", "h", "i"]
  ];

  const stringArray1D = ["x", "y"];

  const stringResult = resizeAndAdd3DWithDefault(stringArray2D, stringArray1D, "");
  console.log("String array result:", stringResult);
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}