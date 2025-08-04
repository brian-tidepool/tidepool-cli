import * as Utils from "./Utils.js";
import * as Delete from "./deletePatient.js";
import * as Get from "./getPatients.js";
import * as Dashboard from "./selectScenarios.js";
import * as Search from "./patientList.js";
import { CredentialsManager } from './credentials.js';
// Configuration variables
let clinicId = '633b559d1d64ad2c9471178b';
var cleanup = true;
var create = true;
var createMedtronic = true;
var search = false;
let tagId = '6841e165edfe663ac4d8bff0';
let periodLength = 14;
// Initialize credentials manager and load credentials
const credentialsManager = new CredentialsManager();
let creds;
try {
    creds = credentialsManager.loadCredentials();
    console.log('✅ Credentials loaded successfully');
}
catch (error) {
    console.error('❌ Failed to load credentials:', error instanceof Error ? error.message : String(error));
    process.exit(1);
}
if (search) {
    let res = await Search.searchPatients(creds, clinicId, tagId, '0');
    if (res) {
        res.forEach((user, index) => {
            console.log(user?.id);
        });
    }
}
if (cleanup) {
    let ids = [];
    do {
        ids = [];
        const result3 = await Get.getPatients(creds, tagId, clinicId);
        if (result3) {
            console.log('IDs');
            result3['data'].forEach((row, index) => { console.log(row.id); ids.push(row.id); });
        }
        else {
            console.log('Failed to get');
        }
        for (let i = 0; i < ids.length; i++) {
            console.log('IDs to delete');
            console.log(ids[i]);
            await Utils.sleep(5000);
            let resultDelete = await Delete.deletePatient(creds.userName, creds.password, creds.baseUrl, ids[i]);
        }
        console.log(ids.length);
    } while (ids.length > 0);
}
if (create) {
    const tirCounts = {
        "Time below 3.0 mmol/L > 1%": 10,
        "Time below 3.9 mmol/L > 4%": 10,
        "Drop in Time in Range > 15%": 10,
        "Time in Range < 70%": 10,
        "CGM Wear Time <70%": 6,
        "Meeting Targets": 5
    };
    Dashboard.createDashboard(tirCounts, periodLength, clinicId, tagId, creds);
}
if (createMedtronic) {
    const tirCounts = 5;
    Dashboard.createMedtronicDashboard(tirCounts, clinicId, tagId, creds);
}
