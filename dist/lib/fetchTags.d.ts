import { Credentials } from './credentials.js';
export interface PatientTag {
    id: string;
    name: string;
}
export interface ClinicWithTags {
    clinic: {
        patientTags: PatientTag[];
    };
}
export type ClinicsWithTagsResponse = ClinicWithTags[];
/**
 * Fetches clinics and their patient tags for a clinician using Tidepool API.
 * @param creds - User credentials
 * @returns Array of clinics with tags or null if an error occurs
 */
export declare function fetchClinicsWithTags(creds: Credentials): Promise<ClinicsWithTagsResponse | null>;
