import * as Payload from "./cbgPayload.js";
import * as Upload from "./loginAndUploadData.js";
import * as Utils from "./Utils.js";
import * as Shift from "./timeShifter.js";
export async function uploadToCustodial(start, end, clinicIdParam, cbgValues, cgmUse, tirPercent, userIdParam, credentials) {
    const increment = 5; // 5 minute intervals
    const usage = Utils.calculatePercentageRoundDown(cgmUse);
    const percentages = Utils.calculatePercentageRoundUp(tirPercent, usage.roundedDown);
    const cbgCounts = [percentages.roundedUp, percentages.remainder];
    const fullCbgValues = Payload.duplicateEntries(cbgValues, cbgCounts);
    const cbgPayloadValues = await Payload.cbgPayload(start, end, increment, fullCbgValues);
    const temp = cbgPayloadValues[0];
    const { default: dataSet } = await import('../data/dataset.json', { with: { type: 'json' } });
    const result = await Upload.loginAndCreatePost(credentials.userName, credentials.password, credentials.baseUrl, cbgPayloadValues, dataSet, userIdParam);
    if (result) {
        console.log('Successfully created post with ID:', result);
        // The result variable now contains the response data
    }
    else {
        console.log('Failed to create post');
    }
}
export async function uploadMedtronicToCustodial(clinicIdParam, userIdParam, credentials) {
    const cbgPayloadValues = await Shift.shiftJsonFile('./data/medtronic.json', 7, 'shifted.json');
    const temp = cbgPayloadValues[0];
    const { default: dataSet } = await import('../data/medtronic_dataset.json', { with: { type: 'json' } });
    const result = await Upload.loginAndCreatePost(credentials.userName, credentials.password, credentials.baseUrl, cbgPayloadValues, dataSet, userIdParam);
    if (result) {
        console.log('Successfully created post with ID:', result);
        // The result variable now contains the response data
    }
    else {
        console.log('Failed to create post');
    }
}
