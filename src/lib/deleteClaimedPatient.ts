
/**
 * Deletes a patient (user) from the Tidepool system by user ID.
 * @param creds Credentials object from CredentialsManager
 * @param clinicId The clinic ID
 * @param custodialUserId The user ID to delete
 * @returns HTTP status code on success, or null on error
 */
import { Credentials } from './credentials.js';
export async function deleteClaimedPatient(
  creds: Credentials,
  clinicId: string,
  custodialUserId: string
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
    const loginData = await loginResponse.json();
    const headers = loginResponse.headers;
    const token = headers.get("X-Tidepool-Session-Token");
    if (!token) {
      throw new Error('No session token received from login response.');
    }
    // Step 2: Use the token to make a DELETE request
    const deleteResponse = await fetch(`${creds.baseUrl}/v1/clinics/${clinicId}/patients/${custodialUserId}`, {
      method: 'DELETE',
      headers: {
        'Accept': '*/*',
        'X-Tidepool-Session-Token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password: creds.password })
    });
    if (!deleteResponse.ok) {
      throw new Error(`Delete failed: ${deleteResponse.status} ${deleteResponse.statusText}`);
    }
    return deleteResponse.status;
  } catch (error) {
    console.error('Error in deletePatient:', error);
    return null;
  }
}