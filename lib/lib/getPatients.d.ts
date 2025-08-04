import { Credentials } from './credentials.js';
interface patientsList {
    data: {
        fullName: string;
        id: string;
    }[];
}
export declare function getPatients<T>(creds: Credentials, clinicId: string, tagId: string): Promise<patientsList | null>;
export {};
