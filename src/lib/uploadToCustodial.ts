import * as cbgPayload from "./cbgPayload.js";
import { authenticateAndUploadData,authenticateAndUploadDataDSA, UploadDataSet, UploadPostDataPayload } from "./authAndUploader.js";
import * as utils from "./Utils.js";
import * as jsonTimeShifter from "./jsonTimeShifter.js";
import { Credentials } from './credentials.js';

export async function uploadToCustodial(
    start: Date, 
    end: Date, 
    clinicIdParam: string, 
    cbgValues: number[], 
    cgmUse: number, 
    tirPercent: number, 
    userIdParam: string,
    credentials: Credentials
) {
    const increment = 5; // 5 minute intervals
    const usage = utils.calculatePercentageRoundDown(cgmUse);
    const percentages = utils.calculatePercentageRoundUp(tirPercent, usage.roundedDown);
    const cbgCounts = [percentages.roundedUp, percentages.remainder];
    const fullCbgValues = cbgPayload.duplicateEntries(cbgValues, cbgCounts);

    const cbgPayloadValues = await cbgPayload.cbgPayload(start, end, increment, fullCbgValues);
    const temp = cbgPayloadValues[0];
    const { default: dataSet } = await import('../data/dataset.json', { with: { type: 'json' } });

    interface POSTResponse {

    }

    const result = await authenticateAndUploadData(
        credentials,
        cbgPayloadValues as UploadPostDataPayload,
        dataSet as UploadDataSet,
        userIdParam
    );

    if (result) {
        console.log('Successfully created post with ID:', result);
        // The result variable now contains the response data
    } else {
        console.log('Failed to create post');
    }
}

export async function uploadToDSA(
    start: Date, 
    end: Date, 
    cbgValues: number[], 
    cgmUse: number, 
    tirPercent: number, 
    credentials: Credentials
) {
    const increment = 5; // 5 minute intervals
    const usage = utils.calculatePercentageRoundDown(cgmUse);
    const percentages = utils.calculatePercentageRoundUp(tirPercent, usage.roundedDown);
    const cbgCounts = [percentages.roundedUp, percentages.remainder];
    const fullCbgValues = cbgPayload.duplicateEntries(cbgValues, cbgCounts);

    const cbgPayloadValues = await cbgPayload.cbgPayload(start, end, increment, fullCbgValues);
    const temp = cbgPayloadValues[0];
    const { default: dataSet } = await import('../data/dataset.json', { with: { type: 'json' } });

    interface POSTResponse {

    }

    const result = await authenticateAndUploadDataDSA(
        credentials,
        cbgPayloadValues as UploadPostDataPayload,
        dataSet as UploadDataSet,
    );

    if (result) {
        console.log('Successfully created post with ID:', result);
        // The result variable now contains the response data
    } else {
        console.log('Failed to create post');
    }
}

export async function uploadMedtronicToCustodial(
    clinicIdParam: string, 
    userIdParam: string,
    credentials: Credentials
) {
    const cbgPayloadValues = await jsonTimeShifter.shiftJsonFile('./data/medtronic.json', 7, 'shifted.json') as UploadPostDataPayload;
    const temp = (Array.isArray(cbgPayloadValues) ? cbgPayloadValues[0] : cbgPayloadValues);
    const { default: dataSet } = await import('../data/medtronic_dataset.json', { with: { type: 'json' } });

    interface POSTResponse {

    }

    const result = await authenticateAndUploadData(
        credentials,
        cbgPayloadValues as UploadPostDataPayload,
        dataSet as UploadDataSet,
        userIdParam
    );

    if (result) {
        console.log('Successfully created post with ID:', result);
        // The result variable now contains the response data
    } else {
        console.log('Failed to create post');
    }
}