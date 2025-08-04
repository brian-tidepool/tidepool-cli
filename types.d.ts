/**
 * Tidepool CLI - TypeScript Declaration File
 * 
 * This file contains all public type definitions, interfaces, and function signatures
 * for the tidepool-cli project.
 */

// ============================================================================
// CORE INTERFACES
// ============================================================================

/**
 * Authentication credentials for Tidepool API
 */
export interface Credentials {
  userName: string;
  password: string;
  baseUrl: string;
}

/**
 * Patient information structure
 */
export interface Patient {
  fullName: string;
  id: string;
}

/**
 * List of patients returned from API
 */
export interface PatientsList {
  data: Patient[];
}

/**
 * Patient creation payload
 */
export interface PatientCreatePayload {
  password: string;
  birthDate: string;
  fullName: string;
  tags: string[];
  connectDexcom: boolean;
}

/**
 * Dataset metadata for uploads
 */
export interface DatasetMetadata {
  computerTime?: string;
  time?: string;
  deviceTime?: string;
  client?: {
    private?: {
      blobId?: string;
    };
  };
}

/**
 * Percentage calculation result with rounding up
 */
export interface PercentageResultRoundedUp {
  percentage: number;
  exactValue: number;
  roundedUp: number;
  remainder: number;
}

/**
 * Percentage calculation result with rounding down
 */
export interface PercentageResultRoundedDown {
  percentage: number;
  exactValue: number;
  roundedDown: number;
  remainder: number;
}

/**
 * TIR (Time in Range) counts for dashboard creation
 */
export interface TIRCounts {
  "Time below 3.0 mmol/L > 1%": number;
  "Time below 3.9 mmol/L > 4%": number;
  "Drop in Time in Range > 15%": number;
  "Time in Range < 70%": number;
  "CGM Wear Time <70%": number;
  "Meeting Targets": number;
}

// ============================================================================
// CREDENTIALS MANAGEMENT
// ============================================================================

/**
 * Manages authentication credentials for the CLI
 */
export declare class CredentialsManager {
  private credentialsPath: string;

  constructor();

  /**
   * Get the path where credentials are stored
   */
  getCredentialsPath(): string;

  /**
   * Check if credentials file exists
   */
  credentialsExist(): boolean;

  /**
   * Save credentials to file
   */
  saveCredentials(credentials: Credentials): void;

  /**
   * Load credentials from file
   * @throws Error if credentials file not found or invalid
   */
  loadCredentials(): Credentials;

  /**
   * Delete credentials file
   */
  deleteCredentials(): void;
}

// ============================================================================
// PATIENT MANAGEMENT
// ============================================================================

/**
 * Creates a new patient in the specified clinic
 * @param username API username
 * @param password API password
 * @param baseUrl Base API URL
 * @param clinicId Clinic ID
 * @param payload Patient creation payload
 * @returns Promise resolving to patient ID or null on failure
 */
export declare function createPatient<T extends PatientCreatePayload>(
  username: string,
  password: string,
  baseUrl: string,
  clinicId: string,
  payload: T
): Promise<string | null>;

/**
 * Retrieves patients by clinic and tag
 * @param creds Authentication credentials
 * @param clinicId Clinic ID
 * @param tagId Tag ID
 * @returns Promise resolving to patients list or null on failure
 */
export declare function getPatients(
  creds: Credentials,
  clinicId: string,
  tagId: string
): Promise<PatientsList | null>;

/**
 * Deletes a patient by ID
 * @param username API username
 * @param password API password
 * @param baseUrl Base API URL
 * @param patientId Patient ID to delete
 * @returns Promise resolving to boolean indicating success
 */
export declare function deletePatient(
  username: string,
  password: string,
  baseUrl: string,
  patientId: string
): Promise<boolean>;

/**
 * Deletes multiple patients by tag
 * @param creds Authentication credentials
 * @param clinicId Clinic ID
 * @param tagId Tag ID
 * @returns Promise resolving to deletion result
 */
export declare function deletePatients(
  creds: Credentials,
  clinicId: string,
  tagId: string
): Promise<unknown>;

// ============================================================================
// DATA UPLOAD
// ============================================================================

/**
 * Authenticates and uploads data to a patient
 * @param username API username
 * @param password API password
 * @param baseUrl Base API URL
 * @param postData Data to upload
 * @param dataSet Dataset metadata
 * @param userId Target user ID
 * @returns Promise resolving to upload result or null on failure
 */
export declare function loginAndCreatePost(
  username: string,
  password: string,
  baseUrl: string,
  postData: any,
  dataSet: DatasetMetadata,
  userId: string
): Promise<unknown | null>;

/**
 * Uploads CBG data to a patient with specific time range and TIR parameters
 * @param start Start date for data
 * @param end End date for data
 * @param clinicId Clinic ID
 * @param range Blood glucose range [min, max]
 * @param tir Time in Range percentage
 * @param count Number of data points
 * @param patientId Patient ID
 * @returns Promise that resolves when upload is complete
 */
export declare function uploadToCustodial(
  start: Date,
  end: Date,
  clinicId: string,
  range: number[],
  tir: number,
  count: number,
  patientId: string
): Promise<void>;

/**
 * Uploads Medtronic device data to a patient
 * @param clinicId Clinic ID
 * @param patientId Patient ID
 * @returns Promise that resolves when upload is complete
 */
export declare function uploadMedtronicToCustodial(
  clinicId: string,
  patientId: string
): Promise<void>;

// ============================================================================
// DASHBOARD CREATION
// ============================================================================

/**
 * Creates a comprehensive dashboard with multiple TIR scenarios
 * @param tirCounts Counts for each TIR category
 * @param periodLength Length of data period in days
 * @param clinicId Clinic ID
 * @param tagId Tag ID
 * @param creds Authentication credentials
 * @returns Promise that resolves when dashboard creation is complete
 */
export declare function createDashboard(
  tirCounts: TIRCounts,
  periodLength: number,
  clinicId: string,
  tagId: string,
  creds: Credentials
): Promise<void>;

/**
 * Creates a dashboard specifically for Medtronic devices
 * @param tirCounts Number of patients to create
 * @param clinicId Clinic ID
 * @param tagId Tag ID
 * @param creds Authentication credentials
 * @returns Promise that resolves when dashboard creation is complete
 */
export declare function createMedtronicDashboard(
  tirCounts: number,
  clinicId: string,
  tagId: string,
  creds: Credentials
): Promise<void>;

/**
 * Creates dashboard with time offset for testing
 * @param tirCounts Counts for each TIR category
 * @param periodLength Length of data period in days
 * @param offsetTimeMinutes Time offset in minutes
 * @param patientName Base name for patients
 * @param clinicId Clinic ID
 * @param tagId Tag ID
 * @param creds Authentication credentials
 * @returns Promise that resolves when dashboard creation is complete
 */
export declare function createDashboardOffset(
  tirCounts: TIRCounts,
  periodLength: number,
  offsetTimeMinutes: number,
  patientName: string,
  clinicId: string,
  tagId: string,
  creds: Credentials
): Promise<void>;

// ============================================================================
// TAG MANAGEMENT
// ============================================================================

/**
 * Adds a tag to multiple patients
 * @param username API username
 * @param password API password
 * @param baseUrl Base API URL
 * @param clinicId Clinic ID
 * @param patientIds Array of patient IDs
 * @param tagId Tag ID to add
 * @returns Promise resolving to tag addition result
 */
export declare function addTag(
  username: string,
  password: string,
  baseUrl: string,
  clinicId: string,
  patientIds: string[],
  tagId: string
): Promise<unknown>;

/**
 * Retrieves available tags
 * @param creds Authentication credentials
 * @returns Promise resolving to tags list
 */
export declare function getTags(creds: Credentials): Promise<unknown>;

// ============================================================================
// CLINIC MANAGEMENT
// ============================================================================

/**
 * Retrieves list of available clinics
 * @param creds Authentication credentials
 * @returns Promise resolving to clinics list
 */
export declare function getClinics(creds: Credentials): Promise<unknown>;

// ============================================================================
// SEARCH FUNCTIONALITY
// ============================================================================

/**
 * Searches for patients by keyword
 * @param creds Authentication credentials
 * @param clinicId Clinic ID
 * @param tagId Tag ID
 * @param keyword Search term
 * @returns Promise resolving to search results
 */
export declare function searchPatients(
  creds: Credentials,
  clinicId: string,
  tagId: string,
  keyword: string
): Promise<unknown>;

// ============================================================================
// TIME SHIFTING UTILITIES
// ============================================================================

/**
 * Shifts all "time" fields in JSON data to align with current time
 * @param data JSON data containing time fields
 * @param timezoneOffsetHours Timezone offset in hours (default: 0)
 * @returns Shifted JSON data
 */
export declare function shiftJsonTimes(
  data: any,
  timezoneOffsetHours?: number
): any;

/**
 * Processes a JSON file and shifts all timestamps
 * @param inputFilePath Path to input JSON file
 * @param timezoneOffset Timezone offset in hours or abbreviation
 * @param outputFilePath Optional output file path
 * @returns Promise resolving to shifted data
 */
export declare function shiftJsonFile(
  inputFilePath: string,
  timezoneOffset?: number | string,
  outputFilePath?: string
): Promise<any>;

/**
 * Gets timezone offset for common abbreviations
 * @param timezone Timezone abbreviation (e.g., 'EST', 'JST')
 * @returns Offset in hours
 * @throws Error for unknown timezone
 */
export declare function getTimezoneOffset(timezone: string): number;

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

/**
 * Resizes 2D array and creates 3D array by pairing with 1D array
 * @param array2D 2D input array
 * @param array1D 1D reference array
 * @returns 3D array
 */
export declare function resizeAndAdd3D<T>(
  array2D: T[][],
  array1D: T[]
): T[][][];

/**
 * Same as resizeAndAdd3D but with custom default value for padding
 * @param array2D 2D input array
 * @param array1D 1D reference array
 * @param defaultValue Default value for padding
 * @returns 3D array
 */
export declare function resizeAndAdd3DWithDefault<T>(
  array2D: T[][],
  array1D: T[],
  defaultValue: T
): T[][][];

// ============================================================================
// PERCENTAGE CALCULATIONS
// ============================================================================

/**
 * Calculates percentage with rounding up
 * @param percentage Percentage value
 * @param baseValue Base value for calculation (default: 288)
 * @returns Percentage calculation result
 */
export declare function calculatePercentageRoundUp(
  percentage: number,
  baseValue?: number
): PercentageResultRoundedUp;

/**
 * Calculates percentage with rounding down
 * @param percentage Percentage value
 * @param baseValue Base value for calculation (default: 288)
 * @returns Percentage calculation result
 */
export declare function calculatePercentageRoundDown(
  percentage: number,
  baseValue?: number
): PercentageResultRoundedDown;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Creates a promise that resolves after specified milliseconds
 * @param ms Milliseconds to sleep
 * @returns Promise that resolves after the specified time
 */
export declare function sleep(ms: number): Promise<void>;

// ============================================================================
// CBG PAYLOAD UTILITIES
// ============================================================================

/**
 * Generates CBG (Continuous Blood Glucose) payload data
 * @param start Start date for data generation
 * @param end End date for data generation
 * @param range Blood glucose range [min, max]
 * @param tir Time in Range percentage
 * @param count Number of data points
 * @returns Generated CBG payload
 */
export declare function generateCBGPayload(
  start: Date,
  end: Date,
  range: number[],
  tir: number,
  count: number
): any;

// ============================================================================
// DATE GENERATION
// ============================================================================

/**
 * Generates date ranges for data uploads
 * @param periodLength Length of period in days
 * @param offsetMinutes Optional time offset in minutes
 * @returns Object containing start and end dates
 */
export declare function generateDateRanges(
  periodLength: number,
  offsetMinutes?: number
): {
  start1: Date;
  end1: Date;
  start2: Date;
  end2: Date;
};

// ============================================================================
// HISTORY MANAGEMENT
// ============================================================================

/**
 * Manages command history for suggestions
 */
export declare class ParameterHistory {
  constructor();

  /**
   * Adds a command entry to history
   * @param command Command name
   * @param args Command arguments
   * @param flags Command flags
   * @param creds Credentials used
   */
  addEntry(
    command: string,
    args: string[],
    flags: Record<string, any>,
    creds: Credentials
  ): void;

  /**
   * Gets recent parameters for a command
   * @param command Command name
   * @param limit Maximum number of entries to return
   * @returns Array of recent parameter sets
   */
  getRecentParameters(
    command: string,
    limit: number
  ): Array<{
    args: string[];
    flags: Record<string, any>;
    creds: Record<string, any>;
  }>;
}

// ============================================================================
// BASE COMMAND CLASS
// ============================================================================

/**
 * Base class for all CLI commands with common functionality
 */
export declare abstract class BaseCommand<T> {
  protected credentialsManager: CredentialsManager;
  protected credentials!: Credentials;
  protected flags!: any;
  protected args!: any;

  constructor(argv: string[], config: any);

  /**
   * Initialize the command
   */
  public async init(): Promise<void>;

  /**
   * Record command history for suggestions
   */
  protected recordHistory(): void;

  /**
   * Get parameter suggestions based on history
   */
  protected getParameterSuggestions(): Array<{
    args: string[];
    flags: Record<string, any>;
    creds: Record<string, any>;
  }>;

  /**
   * Get current filename for logging
   */
  protected printFilename(): string | undefined;

  /**
   * Error handling method
   */
  protected async catch(error: any): Promise<any>;

  /**
   * Cleanup method called after run and catch
   */
  protected async finally(error: Error | undefined): Promise<any>;
}

// ============================================================================
// MODULE EXPORTS
// ============================================================================

export {
  Credentials,
  Patient,
  PatientsList,
  PatientCreatePayload,
  DatasetMetadata,
  PercentageResultRoundedUp,
  PercentageResultRoundedDown,
  TIRCounts,
  CredentialsManager,
  createPatient,
  getPatients,
  deletePatient,
  deletePatients,
  loginAndCreatePost,
  uploadToCustodial,
  uploadMedtronicToCustodial,
  createDashboard,
  createMedtronicDashboard,
  createDashboardOffset,
  addTag,
  getTags,
  getClinics,
  searchPatients,
  shiftJsonTimes,
  shiftJsonFile,
  getTimezoneOffset,
  resizeAndAdd3D,
  resizeAndAdd3DWithDefault,
  calculatePercentageRoundUp,
  calculatePercentageRoundDown,
  sleep,
  generateCBGPayload,
  generateDateRanges,
  ParameterHistory,
  BaseCommand
}; 