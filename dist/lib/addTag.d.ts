import { Credentials } from './credentials.js';
/**
 * Assigns a tag to a list of patients in a clinic using Tidepool API.
 * @param creds Credentials object
 * @param clinicId Clinic ID
 * @param patientIds Array of patient IDs
 * @param tagId Tag ID to assign
 * @returns HTTP status code on success, or null on error
 */
export declare function addTag(creds: Credentials, clinicId: string, patientIds: string[], tagId: string): Promise<number | null>;
