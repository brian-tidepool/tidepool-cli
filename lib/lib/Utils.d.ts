export declare function resizeAndAdd3D<T>(array2D: T[][], array1D: T[]): T[][][];
export declare function resizeAndAdd3DWithDefault<T>(array2D: T[][], array1D: T[], defaultValue: T): T[][][];
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
export declare function calculatePercentageRoundUp(percentage: number, baseValue?: number): PercentageResultRoundedUp;
export declare function calculatePercentageRoundDown(percentage: number, baseValue?: number): PercentageResultRoundedDown;
export declare function usage(): void;
export declare function sleep(ms: number): Promise<void>;
