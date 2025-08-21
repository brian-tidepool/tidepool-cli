import * as cbgPayload from "./cbgPayload.js";
import { authenticateAndUploadData, UploadDataSet, UploadPostDataPayload } from "./authAndUploader.js";
import * as utils from "./Utils.js";
import * as addTag from "./addTag.js";
import * as uploadToCustodial from "./uploadToCustodial.js";
import * as createPatient from "./createPatient.js";
import { off } from "process";
import {Credentials} from './credentials.js';



// Define the key-value pair structure
const tirLookup: Record<string, number[][]> = {
    "Time below 3.0 mmol/L > 1%": [[2.9, 3, 69, 5], [2.9, 3, 69, 5]],
    "Time below 3.9 mmol/L > 4%": [[3.8, 3.9, 70, 5], [3.8, 3.9, 70, 5]],
    "Drop in Time in Range > 15%": [[10.1, 3.9, 80, 1], [10.1, 3.9, 80, 25]],
    "Time in Range < 70%": [[10.0, 10.1, 80, 5], [10.0, 10.1, 80, 5]],
    "CGM Wear Time < 70%": [[3.8, 3.9, 69, 1], [3.8, 3.9, 69, 1]],
    "Meeting Targets": [[3.8, 3.9, 75, 1], [3.8, 3.9, 75, 1]]
};

const smbgLookup: Record<string, number[][]> = {
    "1 reading per day, average 2.9 mmol/l": [[2.9, 1], [2.9, 1]],
    "5 reading per day, average 3.8 mmol/l ": [[3.8, 5], [3.8, 5]],
    "10 readings per day, average 3.9 mmol/l": [[3.9, 10], [3.9,10]],
    "15 readings per day, average 10.1 mmol/l": [[10.1, 15], [10.1,15]],
    "100 readings per day, average 14.0 mmol/l": [[14.0, 100], [14.0,100]],
    "200 readings per day, average 19.5 mmol/l": [[19.5,200], [19.5,200]]
};





export async function createDashboard(tirCounts: Record<string, number>, periodLength: number, clinicId:string, tagId:string, creds: Credentials) {
    let patientIds = []
    console.log('Creating patients')
    let counter = 0;
    for (const key in tirCounts) {
        for (let i = 0; i < tirCounts[key]; i++) {
            let payload = { password: "tidepool", birthDate: '2000-01-01', fullName: `${key}  ${counter}`, tags: [], connectDexcom: false };
            let patientId = await createPatient.createPatient<typeof payload>(creds, clinicId, payload);
            counter++;
            if (patientId) {
                patientIds.push(patientId);
            }
        }
    }


    let tagResult = addTag.addTag(creds, clinicId, patientIds, tagId);
    await utils.sleep(20000);
    let patientCounter = 0;
    const end = new Date(Date.now());
    const start2 = new Date(end.getTime() -1440*periodLength*60000);
    const end2 = new Date(end.getTime());
    const start1 = new Date(end.getTime()-1440*2*periodLength*60000);
    const end1 = new Date(end.getTime()-1440*periodLength*60000);
    
    for (const key in tirCounts) {
        for (let i = 0; i < tirCounts[key]; i++) {

            console.log('patientId', patientIds[patientCounter]);

            await uploadToCustodial.uploadToCustodial(start1, end1, clinicId, tirLookup[key][0].slice(0, 2), tirLookup[key][0][2], tirLookup[key][0][3], patientIds[patientCounter], creds);
            await uploadToCustodial.uploadToCustodial(start2, end2, clinicId, tirLookup[key][1].slice(0, 2), tirLookup[key][1][2], tirLookup[key][1][3], patientIds[patientCounter], creds);
            patientCounter++;
        }


    }



}


export async function createMedtronicDashboard(tirCounts: number,clinicId:string, tagId:string, creds: Credentials) {
    let patientIds = []
    console.log('Creating patients')
    let counter = 0;
    for (let i = 0; i < tirCounts; i++) {
        let payload = { password: "tidepool", birthDate: '2000-01-01', fullName: `Medtronic  ${i}`, tags: [], connectDexcom: false };
        let patientId = await createPatient.createPatient<typeof payload>(creds, clinicId, payload);
        counter++;
        if (patientId) {
            patientIds.push(patientId);
        }
    }
    let tagResult = addTag.addTag(creds, clinicId, patientIds, tagId);
    await utils.sleep(20000);

    for (let i = 0; i < tirCounts; i++) {
        

            console.log('patientId', patientIds[i]);

            await uploadToCustodial.uploadMedtronicToCustodial(clinicId, patientIds[i], creds);

        
        }


    



}




export async function createDashboardOffset(tirCounts: Record<string, number>, periodLength: number, offsetTimeMinutes: number, patientName:string, clinicId:string, tagId:string, creds: Credentials) {
    let patientIds = []
    console.log('Creating patients')
    let counter = 0;
    for (const key in tirCounts) {
        for (let i = 0; i < tirCounts[key]; i++) {
            let payload = { password: "tidepool", birthDate: '2000-01-01', fullName: `${key}  ${counter}`, tags: [], connectDexcom: false };
            let patientId = await createPatient.createPatient<typeof payload>(creds, clinicId, payload);
            counter++;
            if (patientId) {
                patientIds.push(patientId);
            }
        }
    }


    let tagResult = addTag.addTag(creds, clinicId, patientIds, tagId);
    await utils.sleep(20000);
    let patientCounter = 0;
    const end = new Date(Date.now() - offsetTimeMinutes *60000);
    const start2 = new Date(end.getTime() -1440*periodLength*60000);
    const end2 = new Date(end.getTime());
    const start1 = new Date(end.getTime()-1440*2*periodLength*60000);
    const end1 = new Date(end.getTime()-1440*periodLength*60000);
    
    for (const key in tirCounts) {
        for (let i = 0; i < tirCounts[key]; i++) {

            console.log('patientId', patientIds[patientCounter]);
            console.log(end)
            console.log(end2)
            await uploadToCustodial.uploadToCustodial(start1, end1, clinicId, tirLookup[key][0].slice(0, 2), tirLookup[key][0][2], tirLookup[key][0][3], patientIds[patientCounter], creds);
            await uploadToCustodial.uploadToCustodial(start2, end2, clinicId, tirLookup[key][1].slice(0, 2), tirLookup[key][1][2], tirLookup[key][1][3], patientIds[patientCounter], creds);
            patientCounter++;
        }


    }



}



export async function createDSAData(key: string, periodLength: number, offsetTimeMinutes: number,creds: Credentials) {
    
    const end = new Date(Date.now() - offsetTimeMinutes *60000);
    const start2 = new Date(end.getTime() -1440*periodLength*60000);
    const end2 = new Date(end.getTime());
    const start1 = new Date(end.getTime()-1440*2*periodLength*60000);
    const end1 = new Date(end.getTime()-1440*periodLength*60000);
    
    

           
    await uploadToCustodial.uploadToDSA(start1, end1, tirLookup[key][0].slice(0, 2), tirLookup[key][0][2], tirLookup[key][0][3], creds);
    await uploadToCustodial.uploadToDSA(start2, end2, tirLookup[key][1].slice(0, 2), tirLookup[key][1][2], tirLookup[key][1][3], creds);
            
        



}

export async function createSMBGDashboardOffset(smbgCounts: Record<string, number>, periodLength: number, offsetTimeMinutes: number, patientName:string, clinicId:string, tagId:string, creds: Credentials) {
    let patientIds = []
    console.log('Creating patients')
    let counter = 0;
    for (const key in smbgCounts) {
        for (let i = 0; i < smbgCounts[key]; i++) {
            let payload = { password: "tidepool", birthDate: '2000-01-01', fullName: `${key}  ${counter}`, tags: [], connectDexcom: false };
            let patientId = await createPatient.createPatient<typeof payload>(creds, clinicId, payload);
            counter++;
            if (patientId) {
                patientIds.push(patientId);
            }
        }
    }


    let tagResult = addTag.addTag(creds, clinicId, patientIds, tagId);
    await utils.sleep(20000);
    let patientCounter = 0;
    const end = new Date(Date.now() - offsetTimeMinutes *60000);
    const start2 = new Date(end.getTime() -1440*periodLength*60000);
    const end2 = new Date(end.getTime());
    const start1 = new Date(end.getTime()-1440*2*periodLength*60000);
    const end1 = new Date(end.getTime()-1440*periodLength*60000);

    for (const key in smbgCounts) {
        for (let i = 0; i < smbgCounts[key]; i++) {

            console.log('patientId', patientIds[patientCounter]);
            console.log(end)
            console.log(end2)
            await uploadToCustodial.uploadSMBGToCustodial(start1, end1, clinicId, smbgLookup[key][0][0], smbgLookup[key][0][1], patientIds[patientCounter], creds);
            await uploadToCustodial.uploadSMBGToCustodial(start2, end2, clinicId, smbgLookup[key][1][0], smbgLookup[key][1][1], patientIds[patientCounter], creds);
            patientCounter++;
        }


    }



}