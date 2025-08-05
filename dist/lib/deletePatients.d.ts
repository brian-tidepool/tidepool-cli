import { Credentials } from './credentials.js';
/**
 * Deletes all patients for a given clinic and tag.
 * @param creds User credentials
 * @param clinicId Clinic ID
 * @param tagId Tag ID
 */
export declare function deletePatients(creds: Credentials, clinicId: string, tagId: string): Promise<void>;
