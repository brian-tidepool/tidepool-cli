import { Credentials } from './credentials.js';
interface patientsList {
    clinic: {
        name: string;
        id: string;
    };
}
export declare function getClinics<T>(creds: Credentials): Promise<patientsList[] | null>;
export {};
