import * as cbgPayload from "./cbgPayload.js";
import { authenticateAndUploadData } from "./authAndUploader.js";
import * as utils from "./Utils.js";
import * as jsonTimeShifter from "./jsonTimeShifter.js";
export async function uploadToCustodial(start, end, clinicIdParam, cbgValues, cgmUse, tirPercent, userIdParam, credentials) {
    const increment = 5; // 5 minute intervals
    const usage = utils.calculatePercentageRoundDown(cgmUse);
    const percentages = utils.calculatePercentageRoundUp(tirPercent, usage.roundedDown);
    const cbgCounts = [percentages.roundedUp, percentages.remainder];
    const fullCbgValues = cbgPayload.duplicateEntries(cbgValues, cbgCounts);
    const cbgPayloadValues = await cbgPayload.cbgPayload(start, end, increment, fullCbgValues);
    const temp = cbgPayloadValues[0];
    const { default: dataSet } = await import('../data/dataset.json', { with: { type: 'json' } });
    const result = await authenticateAndUploadData(credentials, cbgPayloadValues, dataSet, userIdParam);
    if (result) {
        console.log('Successfully created post with ID:', result);
        // The result variable now contains the response data
    }
    else {
        console.log('Failed to create post');
    }
}
export async function uploadMedtronicToCustodial(clinicIdParam, userIdParam, credentials) {
    const cbgPayloadValues = await jsonTimeShifter.shiftJsonFile('./data/medtronic.json', 7, 'shifted.json');
    const temp = (Array.isArray(cbgPayloadValues) ? cbgPayloadValues[0] : cbgPayloadValues);
    const { default: dataSet } = await import('../data/medtronic_dataset.json', { with: { type: 'json' } });
    const result = await authenticateAndUploadData(credentials, cbgPayloadValues, dataSet, userIdParam);
    if (result) {
        console.log('Successfully created post with ID:', result);
        // The result variable now contains the response data
    }
    else {
        console.log('Failed to create post');
    }
}
