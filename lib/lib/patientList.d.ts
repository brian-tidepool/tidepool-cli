import { Credentials } from "./credentials.js";
export declare function searchPatients(creds: Credentials, clinicId: string, tagId: string, search: string, offset?: number, sort?: string, sortType?: string, period?: string, limit?: number): Promise<any[] | null>;
