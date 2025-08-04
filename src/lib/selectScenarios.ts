import * as Payload from "./cbgPayload.js";
import * as Upload from "./loginAndUploadData.js";
import * as Utils from "./Utils.js";
import * as Tag from "./addTag.js"
import * as Custodial from "./uploadToCustodial.js"
import * as Create from "./createPatient.js";
import { off } from "process";
import {Credentials} from './credentials.js';



// Define the key-value pair structure
const tirLookup: Record<string, number[][]> = {
    "Time below 3.0 mmol/L > 1%": [[2.9, 3, 69, 5], [2.9, 3, 69, 5]],
    "Time below 3.9 mmol/L > 4%": [[3.8, 3.9, 70, 5], [3.8, 3.9, 70, 5]],
    "Drop in Time in Range > 15%": [[10.1, 3.9, 80, 1], [10.1, 3.9, 80, 25]],
    "Time in Range < 70%": [[10.0, 10.1, 80, 5], [10.0, 10.1, 80, 5]],
    "CGM Wear Time <70%": [[3.8, 3.9, 69, 1], [3.8, 3.9, 69, 1]],
    "Meeting Targets": [[3.8, 3.9, 75, 1], [3.8, 3.9, 75, 1]]
};






export async function createDashboard(tirCounts: Record<string, number>, periodLength: number, clinicId:string, tagId:string, creds: Credentials) {
    let patientIds = []
    console.log('Creating patients')
    let counter = 0;
    for (const key in tirCounts) {
        for (let i = 0; i < tirCounts[key]; i++) {
            let payload = { password: "tidepool", birthDate: '2000-01-01', fullName: `Test User  ${counter}`, tags: [], connectDexcom: false }
            let patientId = await Create.createPatient<typeof payload>(creds.userName,
                creds.password,
                creds.baseUrl, clinicId, payload)
            counter++;
            if (patientId) {
                patientIds.push(patientId)
            }



        }
    }


    let tagResult = Tag.addTag(creds.userName, creds.password, creds.baseUrl, clinicId, patientIds,tagId)
    await Utils.sleep(20000);
    let patientCounter = 0;
    const end = new Date(Date.now());
    const start2 = new Date(end.getTime() -1440*periodLength*60000);
    const end2 = new Date(end.getTime());
    const start1 = new Date(end.getTime()-1440*2*periodLength*60000);
    const end1 = new Date(end.getTime()-1440*7*60000);
    
    for (const key in tirCounts) {
        for (let i = 0; i < tirCounts[key]; i++) {

            console.log('patientId', patientIds[patientCounter]);

            await Custodial.uploadToCustodial(start1, end1, clinicId, tirLookup[key][0].slice(0, 2), tirLookup[key][0][2], tirLookup[key][0][3], patientIds[patientCounter], creds);
            await Custodial.uploadToCustodial(start2, end2, clinicId, tirLookup[key][1].slice(0, 2), tirLookup[key][1][2], tirLookup[key][1][3], patientIds[patientCounter], creds);
            patientCounter++;
        }


    }



}


export async function createMedtronicDashboard(tirCounts: number,clinicId:string, tagId:string, creds: Credentials) {
    let patientIds = []
    console.log('Creating patients')
    let counter = 0;
    for (let i = 0; i < tirCounts; i++) {
        let payload = { password: "tidepool", birthDate: '2000-01-01', fullName: `Medtronic  ${i}`, tags: [], connectDexcom: false }
        let patientId = await Create.createPatient<typeof payload>(creds.userName,
            creds.password,
            creds.baseUrl, clinicId, payload)
        counter++;
        if (patientId) {
            patientIds.push(patientId)
        }


    }
    let tagResult = Tag.addTag(creds.userName, creds.password, creds.baseUrl, clinicId, patientIds,tagId)
    await Utils.sleep(20000);

    for (let i = 0; i < tirCounts; i++) {
        

            console.log('patientId', patientIds[i]);

            await Custodial.uploadMedtronicToCustodial(clinicId, patientIds[i], creds);

        
        }


    



}




export async function createDashboardOffset(tirCounts: Record<string, number>, periodLength: number, offsetTimeMinutes: number, patientName:string, clinicId:string, tagId:string, creds: Credentials) {
    let patientIds = []
    console.log('Creating patients')
    let counter = 0;
    for (const key in tirCounts) {
        for (let i = 0; i < tirCounts[key]; i++) {
            let payload = { password: "tidepool", birthDate: '2000-01-01', fullName: `${patientName}  ${counter}`, tags: [], connectDexcom: false }
            let patientId = await Create.createPatient<typeof payload>(creds.userName,
                creds.password,
                creds.baseUrl, clinicId, payload)
            counter++;
            if (patientId) {
                patientIds.push(patientId)
            }



        }
    }


    let tagResult = Tag.addTag(creds.userName, creds.password, creds.baseUrl, clinicId, patientIds, tagId)
    await Utils.sleep(20000);
    let patientCounter = 0;
    const end = new Date(Date.now() - offsetTimeMinutes *60000);
    const start2 = new Date(end.getTime() -1440*periodLength*60000);
    const end2 = new Date(end.getTime());
    const start1 = new Date(end.getTime()-1440*2*periodLength*60000);
    const end1 = new Date(end.getTime()-1440*7*60000);
    
    for (const key in tirCounts) {
        for (let i = 0; i < tirCounts[key]; i++) {

            console.log('patientId', patientIds[patientCounter]);
            console.log(end)
            console.log(end2)
            await Custodial.uploadToCustodial(start1, end1, clinicId, tirLookup[key][0].slice(0, 2), tirLookup[key][0][2], tirLookup[key][0][3], patientIds[patientCounter], creds);
            await Custodial.uploadToCustodial(start2, end2, clinicId, tirLookup[key][1].slice(0, 2), tirLookup[key][1][2], tirLookup[key][1][3], patientIds[patientCounter], creds);
            patientCounter++;
        }


    }



}