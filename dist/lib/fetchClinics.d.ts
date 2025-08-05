import { Credentials } from './credentials.js';
export interface Clinic {
    id: string;
    name: string;
}
export interface ClinicsResponse {
    clinics: Clinic[];
}
/**
 * Fetches clinics for a clinician using Tidepool API.
 * @param creds - User credentials
 * @returns Array of clinics or null if an error occurs
 */
export declare function fetchClinicsByCredentials(creds: Credentials): Promise<Clinic[] | null>;
