import { Credentials } from './credentials.js';

/**
 * Creates a new tag in a clinic using Tidepool API.
 * @param creds Credentials object
 * @param clinicId Clinic ID
 * @param tagName Name of the tag to create
 * @returns HTTP status code on success, or null on error
 */
export async function createTag(
  creds: Credentials,
  clinicId: string,
  tagName: string
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
    // Step 2: Create tag
    const postResponse = await fetch(`${creds.baseUrl}/v1/clinics/${clinicId}/patient_tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Tidepool-Session-Token': token
      },
      body: JSON.stringify({
        name: tagName
      })
    });
    console.log(postResponse.status);
    return postResponse.status;
  } catch (error) {
    console.error('Error in createTag:', error);
    return null;
  }
}
