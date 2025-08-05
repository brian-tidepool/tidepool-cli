import { Credentials } from './credentials.js';

/**
 * Assigns a tag to a list of patients in a clinic using Tidepool API.
 * @param creds Credentials object
 * @param clinicId Clinic ID
 * @param patientIds Array of patient IDs
 * @param tagId Tag ID to assign
 * @returns HTTP status code on success, or null on error
 */
export async function addTag(
  creds: Credentials,
  clinicId: string,
  patientIds: string[],
  tagId: string
): Promise<number | null> {
  try {
    // Step 1: Login with basic auth
    const loginResponse = await fetch(`${creds.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${creds.userName}:${creds.password}`)}`
      }
    });
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status} ${loginResponse.statusText}`);
    }
    const headers = loginResponse.headers;
    const token = headers.get("X-Tidepool-Session-Token");
    if (!token) {
      throw new Error('No session token received from login response.');
    }
    // Step 2: Assign tag to patients
    const postResponse1 = await fetch(`${creds.baseUrl}/v1/clinics/${clinicId}/patients/assign_tag/${tagId}`, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'X-Tidepool-Session-Token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patientIds)
    });
    console.log(postResponse1.status);
    return postResponse1.status;
  } catch (error) {
    console.error('Error in addTag:', error);
    return null;
  }
}