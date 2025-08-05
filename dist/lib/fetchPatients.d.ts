import { Credentials } from './credentials.js';
export interface Patient {
    id: string;
    fullName: string;
}
export interface PatientsResponse {
    data: Patient[];
}
/**
 * Fetches patients for a clinic and tag using Tidepool API.
 * @param creds - User credentials
 * @param clinicId - Clinic ID
 * @param tagId - Tag ID
 * @returns Array of patients or null if an error occurs
 */
export declare function fetchPatientsByClinicAndTag(creds: Credentials, clinicId: string, tagId: string): Promise<Patient[] | null>;
