
import { Credentials } from './credentials.js';

/**
 * Creates a new patient in a clinic using Tidepool API.
 * @param creds Credentials object
 * @param clinicId Clinic ID
 * @param payload Patient data to create
 * @returns The new patient ID on success, or null on error
 */
export async function createPatient<TPostData1>(
  creds: Credentials,
  clinicId: string,
  payload: TPostData1
): Promise<string | null> {
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
    // Step 2: Use the token to make a POST request
    const postResponse = await fetch(`${creds.baseUrl}/v1/clinics/${clinicId}/patients`, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'X-Tidepool-Session-Token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!postResponse.ok) {
      throw new Error(`Post creation failed: ${postResponse.status} ${postResponse.statusText}`);
    }
    const result = await postResponse.json();
    return result.id;
  } catch (error) {
    console.error('Error in createPatient:', error);
    return null;
  }
}