import { Credentials } from './credentials.js';
interface tagsList {
    clinic: {
        patientTags: {
            id: string;
            name: string;
        }[];
    };
}
export declare function getTags<T>(creds: Credentials): Promise<tagsList[] | null>;
export {};
