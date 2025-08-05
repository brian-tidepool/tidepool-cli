import { Credentials } from './credentials.js';
export declare function createDashboard(tirCounts: Record<string, number>, periodLength: number, clinicId: string, tagId: string, creds: Credentials): Promise<void>;
export declare function createMedtronicDashboard(tirCounts: number, clinicId: string, tagId: string, creds: Credentials): Promise<void>;
export declare function createDashboardOffset(tirCounts: Record<string, number>, periodLength: number, offsetTimeMinutes: number, patientName: string, clinicId: string, tagId: string, creds: Credentials): Promise<void>;
