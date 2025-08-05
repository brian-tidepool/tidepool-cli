import { Credentials } from './credentials.js';
/**
 * Creates a new patient in a clinic using Tidepool API.
 * @param creds Credentials object
 * @param clinicId Clinic ID
 * @param payload Patient data to create
 * @returns The new patient ID on success, or null on error
 */
export declare function createPatient<TPostData1>(creds: Credentials, clinicId: string, payload: TPostData1): Promise<string | null>;
