import { v4 as uuidv4 } from 'uuid';
function toLocalISOString(date) {
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().slice(0, 19); // Remove milliseconds and 'Z'
}
/**
 * Authenticates a user and uploads a dataset to Tidepool.
 * @param creds Credentials object
 * @param postData Data to upload
 * @param dataSet Metadata for the upload
 * @param userId User ID for the upload
 * @returns HTTP status code of the upload request, or null if an error occurs
 */
export async function authenticateAndUploadData(creds, postData, dataSet, userId) {
    try {
        // Step 1: Login with basic auth
        const loginResponse = await fetch(`${creds.baseUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(`${creds.userName}:${creds.password}`)}`
            },
        });
        if (!loginResponse.ok) {
            throw new Error(`Login failed: ${loginResponse.status} ${loginResponse.statusText}`);
        }
        const token = loginResponse.headers.get('X-Tidepool-Session-Token');
        if (!token) {
            throw new Error('Missing authentication token after login.');
        }
        // Step 2: Prepare dataset and upload session
        const myuuid = uuidv4().replaceAll('-', '');
        if (dataSet?.client?.private) {
            dataSet.client.private.blobId = myuuid;
        }
        const date = new Date();
        dataSet.computerTime = toLocalISOString(date);
        dataSet.time = date.toISOString();
        if (dataSet.deviceTime !== undefined) {
            dataSet.deviceTime = dataSet.computerTime;
        }
        const openSessionResponse = await fetch(`${creds.baseUrl}/v1/users/${userId}/datasets`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'X-Tidepool-Session-Token': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataSet),
        });
        const openSessionBody = await openSessionResponse.json();
        const uploadSessionId = openSessionBody.data.id;
        // Step 3: Upload data
        const uploadResponse = await fetch(`${creds.baseUrl}/dataservices/v1/datasets/${uploadSessionId}/data`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'X-Tidepool-Session-Token': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });
        if (!uploadResponse.ok) {
            throw new Error(`Data upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
        }
        // Step 4: Close the upload session
        const closeSessionResponse = await fetch(`${creds.baseUrl}/dataservices/v1/datasets/${uploadSessionId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'X-Tidepool-Session-Token': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dataState: 'closed' }),
        });
        if (!closeSessionResponse.ok) {
            throw new Error(`Failed to close upload session: ${closeSessionResponse.status} ${closeSessionResponse.statusText}`);
        }
        return uploadResponse.status;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error in authenticateAndUploadData:', error.message);
        }
        else {
            console.error('Unknown error in authenticateAndUploadData:', error);
        }
        return null;
    }
}
