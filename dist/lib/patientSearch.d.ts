import { Credentials } from "./credentials.js";
/**
 * Searches for patients in a clinic by tag and search string.
 * @param creds User credentials
 * @param clinicId Clinic ID
 * @param tagId Tag ID
 * @param search Search string
 * @param offset Pagination offset (default: 0)
 * @param sort Sort field (default: '+fullName')
 * @param sortType Sort type (default: 'cgm')
 * @param period Period string (default: '1d')
 * @param limit Max results (default: 50)
 * @returns Array of patient objects or null on error
 */
export declare function searchPatients(creds: Credentials, clinicId: string, tagId: string, search: string, offset?: number, sort?: string, sortType?: string, period?: string, limit?: number): Promise<unknown[] | null>;
