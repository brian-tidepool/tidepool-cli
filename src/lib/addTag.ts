import { v4 as uuidv4 } from 'uuid';



export async function addTag(
    username: string,
    password: string,
    baseUrl: string,
    clinicId:string,
    patientIds: string[],
    tagId:string
): Promise<number | null> {
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
     
        const postResponse1 = await fetch(baseUrl + '/v1/clinics/' + clinicId + '/patients/assign_tag/'+tagId, {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                // Add authorization token to all requests.
                'X-Tidepool-Session-Token': `${token}`,
                'Content-Type': 'application/json'

            },
            body: JSON.stringify(patientIds)
        });
       

    
        // Step 3: Save the result to a variable
     
        console.log(postResponse1.status)
        return postResponse1.status;

    } catch (error) {
        console.error('Error in addTag:', error);
        return null;
    }
}