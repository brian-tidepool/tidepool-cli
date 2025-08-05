/**
 * Fetches patients for a clinic and tag using Tidepool API.
 * @param creds - User credentials
 * @param clinicId - Clinic ID
 * @param tagId - Tag ID
 * @returns Array of patients or null if an error occurs
 */
export async function fetchPatientsByClinicAndTag(creds, clinicId, tagId) {
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
        // Step 2: Fetch patients for the clinic and tag
        const params = new URLSearchParams();
        params.append('tags', tagId);
        const patientsUrl = `${creds.baseUrl}/v1/clinics/${clinicId}/patients?${params.toString()}`;
        const patientsResponse = await fetch(patientsUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Tidepool-Session-Token': token,
            },
        });
        if (!patientsResponse.ok) {
            throw new Error(`Failed to fetch patients: ${patientsResponse.status} ${patientsResponse.statusText}`);
        }
        const patientsData = await patientsResponse.json();
        if (!Array.isArray(patientsData.data)) {
            throw new Error('Unexpected patients response format.');
        }
        return patientsData.data;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error in fetchPatientsByClinicAndTag:', error.message);
        }
        else {
            console.error('Unknown error in fetchPatientsByClinicAndTag:', error);
        }
        return null;
    }
}
