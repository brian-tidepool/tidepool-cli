
import { Credentials } from './credentials.js';

// Tag type for a single tag
export interface ClinicPatientTag {
  
  clinic: {
    id: string;
  name: string;
    patientTags: PatientTag[];
  };
}

export interface PatientTag {
  id: string;
  name: string;
}

// API response type for clinics with tags
export type ClinicsWithTagsResponse = ClinicPatientTag[];

/**
 * Fetches clinics and their patient tags for a clinician using Tidepool API.
 * @param creds - User credentials
 * @returns Array of clinics with tags or null if an error occurs
 */
export async function fetchClinicsWithTags(
  creds: Credentials
): Promise<ClinicsWithTagsResponse | null> {
  try {
    // Step 1: Login with basic auth
    const loginResponse = await fetch(`${creds.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${creds.userName}:${creds.password}`)}`,
      },
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status} ${loginResponse.statusText}`);
    }

    const loginData = await loginResponse.json();
    const token = loginResponse.headers.get('X-Tidepool-Session-Token');
    const userId: string = loginData.userid;

    if (!token || !userId) {
      throw new Error('Missing authentication token or user ID after login.');
    }

    // Step 2: Fetch clinics with tags
    const clinicsUrl = `${creds.baseUrl}/v1/clinicians/${userId}/clinics?limit=1000&offset=0`;
    const clinicsResponse = await fetch(clinicsUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Tidepool-Session-Token': token,
      },
    });

    if (!clinicsResponse.ok) {
      throw new Error(`Failed to fetch clinics with tags: ${clinicsResponse.status} ${clinicsResponse.statusText}`);
    }

    const clinicsData: ClinicsWithTagsResponse = await clinicsResponse.json();
    if (!Array.isArray(clinicsData)) {
      throw new Error('Unexpected clinics with tags response format.');
    }
    return clinicsData;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in fetchClinicsWithTags:', error.message);
    } else {
      console.error('Unknown error in fetchClinicsWithTags:', error);
    }
    return null;
  }
}