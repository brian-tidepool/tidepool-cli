import { Credentials } from './credentials.js';
export declare function uploadToCustodial(start: Date, end: Date, clinicIdParam: string, cbgValues: number[], cgmUse: number, tirPercent: number, userIdParam: string, credentials: Credentials): Promise<void>;
export declare function uploadMedtronicToCustodial(clinicIdParam: string, userIdParam: string, credentials: Credentials): Promise<void>;
