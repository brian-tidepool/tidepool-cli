export async function searchPatients(creds, clinicId, tagId, search, offset = 0, sort = '+fullName', sortType = 'cgm', period = '1d', limit = 50) {
    try {
        // Step 1: Login with basic auth
        const loginResponse = await fetch(creds.baseUrl + '/auth/login', {
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
        let headers = await loginResponse.headers;
        const token = await headers.get("X-Tidepool-Session-Token");
        console.log('Login successful, token received');
        //console.log(token)
        // Step 1.5: Use the token to make a POST request to open data set
        const params = new URLSearchParams();
        params.append('search', search);
        params.append('offset', offset.toString());
        params.append('sort', sort);
        params.append('sortType', sortType);
        params.append('period', period);
        params.append('limit', limit.toString());
        params.append('tags', [`${tagId}`].toString());
        const postResponse1 = await fetch(`${creds.baseUrl}/v1/clinics/${clinicId}/patients?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Accept': '*/*',
                // Add authorization token to all requests.
                'X-Tidepool-Session-Token': `${token}`,
            }
        });
        // Step 3: Save the result to a variable
        const result = await postResponse1.json();
        console.log('Post created successfully:', result);
        console.log(postResponse1.status);
        return result.data;
    }
    catch (error) {
        console.error('searchPatient:', error);
        return null;
    }
}
