import * as deletePatient from "./deletePatient.js";
import * as fetchPatients from "./fetchPatients.js";
import * as utils from "./Utils.js";
/**
 * Deletes all patients for a given clinic and tag.
 * @param creds User credentials
 * @param clinicId Clinic ID
 * @param tagId Tag ID
 */
export async function deletePatients(creds, clinicId, tagId) {
    let ids = [];
    do {
        ids = [];
        const result = await fetchPatients.fetchPatientsByClinicAndTag(creds, clinicId, tagId);
        if (Array.isArray(result)) {
            ids = result.map((row) => row.id);
        }
        else {
            console.warn('Failed to get patients or no data returned');
        }
        for (const id of ids) {
            // Optionally, log which ID is being deleted:
            // console.log(`Deleting patient ID: ${id}`);
            await utils.sleep(5000);
            await deletePatient.deletePatient(creds, id);
        }
        // Optionally, log how many were deleted:
        // console.log(`Deleted ${ids.length} patients in this batch.`);
    } while (ids.length > 0);
}
