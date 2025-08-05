export interface UploadClientPrivate {
    blobId?: string;
}
export interface UploadClient {
    private?: UploadClientPrivate;
}
export interface UploadDataSet {
    computerTime?: string;
    time?: string;
    deviceTime?: string;
    client?: UploadClient;
}
export type UploadPostData = Record<string, unknown>;
export type UploadPostDataPayload = UploadPostData | UploadPostData[];
import { Credentials } from './credentials.js';
/**
 * Authenticates a user and uploads a dataset to Tidepool.
 * @param creds Credentials object
 * @param postData Data to upload
 * @param dataSet Metadata for the upload
 * @param userId User ID for the upload
 * @returns HTTP status code of the upload request, or null if an error occurs
 */
export declare function authenticateAndUploadData(creds: Credentials, postData: UploadPostDataPayload, dataSet: UploadDataSet, userId: string): Promise<number | null>;
