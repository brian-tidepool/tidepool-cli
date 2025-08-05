/**
 * Fetches clinics for a clinician using Tidepool API.
 * @param creds - User credentials
 * @returns Array of clinics or null if an error occurs
 */
export async function fetchClinicsByCredentials(creds) {
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
        const userId = loginData.userid;
        if (!token || !userId) {
            throw new Error('Missing authentication token or user ID after login.');
        }
        // Step 2: Fetch clinics for the clinician
        const clinicsUrl = `${creds.baseUrl}/v1/clinicians/${userId}/clinics?limit=1000&offset=0`;
        const clinicsResponse = await fetch(clinicsUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Tidepool-Session-Token': token,
            },
        });
        if (!clinicsResponse.ok) {
            throw new Error(`Failed to fetch clinics: ${clinicsResponse.status} ${clinicsResponse.statusText}`);
        }
        const clinicsData = await clinicsResponse.json();
        if (!Array.isArray(clinicsData.clinics)) {
            throw new Error('Unexpected clinics response format.');
        }
        return clinicsData.clinics;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error in fetchClinicsByCredentials:', error.message);
        }
        else {
            console.error('Unknown error in fetchClinicsByCredentials:', error);
        }
        return null;
    }
}
