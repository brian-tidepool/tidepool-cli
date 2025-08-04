export async function getPatients(creds, clinicId, tagId) {
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
        const userId = loginData.userid;
        console.log('Login successful, token received');
        const params = new URLSearchParams();
        params.append('tags', [`${tagId}`].toString());
        console.log();
        // Step 2: Use the token to make a POST request
        const postResponse = await fetch(creds.baseUrl + `/v1/clinics/${clinicId}/patients?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Accept': '*/*',
                // Add authorization token to all requests.
                'X-Tidepool-Session-Token': `${token}`,
            }
        });
        if (!postResponse.ok) {
            throw new Error(`Post creation failed: ${postResponse.status} ${postResponse.statusText}`);
        }
        // Step 3: Save the result to a variable
        const result = await postResponse.json();
        //console.log('Post created successfully:', result);
        return result;
    }
    catch (error) {
        console.error('Error in loginAndCreatePost:', error);
        return null;
    }
}
