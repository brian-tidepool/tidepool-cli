



export async function createPatient<TPostData1>(
    username: string,
    password: string,
    baseUrl: string,
    clinicId: string,
    payload: TPostData1
): Promise<string | null> {
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
        const userId = loginData.userid;
        console.log('Login successful, token received');
        //console.log(token)
        //console.log(userId)

        


        // Step 2: Use the token to make a POST request
        const postResponse = await fetch(baseUrl + '/v1/clinics/'+clinicId+'/patients', {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                // Add authorization token to all requests.
                'X-Tidepool-Session-Token': `${token}`,
                'Content-Type':'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!postResponse.ok) {
            throw new Error(`Post creation failed: ${postResponse.status} ${postResponse.statusText}`);
        }

        // Step 3: Save the result to a variable
        const result = await postResponse.json();
        console.log('Post created successfully:', result);
        console.log(postResponse.status)
        return result.id;

    } catch (error) {
        console.error('Error in loginAndCreatePost:', error);
        return null;
    }
}