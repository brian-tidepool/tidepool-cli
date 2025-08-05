/**
 * Searches for patients in a clinic by tag and search string.
 * @param creds User credentials
 * @param clinicId Clinic ID
 * @param tagId Tag ID
 * @param search Search string
 * @param offset Pagination offset (default: 0)
 * @param sort Sort field (default: '+fullName')
 * @param sortType Sort type (default: 'cgm')
 * @param period Period string (default: '1d')
 * @param limit Max results (default: 50)
 * @returns Array of patient objects or null on error
 */
export async function searchPatients(creds, clinicId, tagId, search, offset = 0, sort = '+fullName', sortType = 'cgm', period = '1d', limit = 50) {
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const loginData = await loginResponse.json();
        const headers = loginResponse.headers;
        const token = headers.get("X-Tidepool-Session-Token");
        if (!token) {
            throw new Error('No session token received from login response.');
        }
        // Step 2: Use the token to make a GET request to fetch patients
        const params = new URLSearchParams();
        params.append('search', search);
        params.append('offset', offset.toString());
        params.append('sort', sort);
        params.append('sortType', sortType);
        params.append('period', period);
        params.append('limit', limit.toString());
        params.append('tags', tagId);
        const response = await fetch(`${creds.baseUrl}/v1/clinics/${clinicId}/patients?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Accept': '*/*',
                'X-Tidepool-Session-Token': token,
            }
        });
        if (!response.ok) {
            throw new Error(`Patient search failed: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        return result.data;
    }
    catch (error) {
        console.error('searchPatients:', error);
        return null;
    }
}
