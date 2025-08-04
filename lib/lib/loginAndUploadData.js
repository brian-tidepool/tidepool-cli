import { v4 as uuidv4 } from 'uuid';
function toLocalISOString(date) {
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().slice(0, 19); // Remove milliseconds and 'Z'
}
export async function loginAndCreatePost(username, password, baseUrl, postData, dataSet, userId) {
    try {
        // Step 1: Login with basic auth
        const loginResponse = await fetch(baseUrl + '/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(`${username}:${password}`)}`
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
        let myuuid = uuidv4().replaceAll('-', '');
        dataSet?.client?.private?.blobId && (dataSet.client.private.blobId = myuuid);
        const date = new Date();
        dataSet.computerTime = toLocalISOString(date);
        dataSet.time = date.toISOString();
        dataSet?.deviceTime && (dataSet.deviceTime = dataSet.computerTime);
        const postResponse1 = await fetch(baseUrl + '/v1/users/' + userId + '/datasets', {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                // Add authorization token to all requests.
                'X-Tidepool-Session-Token': `${token}`,
            },
            body: JSON.stringify(dataSet)
        });
        const body1 = await postResponse1.json();
        console.log(body1);
        const uploadSessionId = body1.data.id;
        // Step 2: Use the token to make a POST request
        const postResponse = await fetch(baseUrl + '/dataservices/v1/datasets/' + uploadSessionId + '/data', {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                // Add authorization token to all requests.
                'X-Tidepool-Session-Token': `${token}`,
            },
            body: JSON.stringify(postData)
        });
        if (!postResponse.ok) {
            throw new Error(`Post creation failed: ${postResponse.status} ${postResponse.statusText}`);
        }
        // Step 2.5: Use the token to make a POST request
        const postResponse2 = await fetch(baseUrl + '/dataservices/v1/datasets/' + uploadSessionId, {
            method: 'PUT',
            headers: {
                'Accept': '*/*',
                // Add authorization token to all requests.
                'X-Tidepool-Session-Token': `${token}`,
            },
            body: JSON.stringify({ "dataState": "closed" })
        });
        if (!postResponse2.ok) {
            throw new Error(`Post creation failed: ${postResponse.status} ${postResponse.statusText}`);
        }
        // Step 3: Save the result to a variable
        const result = await postResponse.json();
        console.log('Post created successfully:', result);
        console.log(postResponse.status);
        return postResponse.status;
    }
    catch (error) {
        console.error('Error in loginAndCreatePost:', error);
        return null;
    }
}
