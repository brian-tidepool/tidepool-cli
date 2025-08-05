/**
 * Deletes a patient (user) from the Tidepool system by user ID.
 * @param creds Credentials object from CredentialsManager
 * @param custodialUserId The user ID to delete
 * @returns HTTP status code on success, or null on error
 */
import { Credentials } from './credentials.js';
export declare function deletePatient(creds: Credentials, custodialUserId: string): Promise<number | null>;
