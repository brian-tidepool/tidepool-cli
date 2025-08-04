import * as Delete from "./deletePatient.js";
import * as Get from "./getPatients.js";
import * as Utils from "./Utils.js";
import { Credentials } from './credentials.js';



export async function deletePatients(
    creds: Credentials,clinicId:string,tagId:string


): Promise<void> {

    let ids: string[] = []
    do {
        ids = []
        const result3 = await Get.getPatients(creds, clinicId,tagId)

        if (result3) {
            console.log('IDs')
            result3['data'].forEach((row, index) => { console.log(row.id); ids.push(row.id) })

        }
        else {
            console.log('Failed to get')
        }
        for (let i = 0; i < ids.length; i++) {
            console.log('IDs to delete')
            console.log(ids[i])
            await Utils.sleep(5000);
            let resultDelete = await Delete.deletePatient(creds.userName,
                creds.password,
                creds.baseUrl, ids[i])
        }
        console.log(ids.length)
    } while (ids.length > 0)
}