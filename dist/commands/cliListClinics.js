import { fetchClinicsByCredentials } from "../lib/fetchClinics.js";
import { BaseCommand } from '../base-command.js';
let periodLength = 14;
export default class ClinicList extends BaseCommand {
    static description = 'List clinics by id and name';
    static flags = {};
    async run() {
        const { flags } = await this.parse(ClinicList);
        this.recordHistory();
        const clinics = await fetchClinicsByCredentials(this.credentials);
        if (!clinics || clinics.length === 0) {
            this.log('No clinics found for the current user.');
            return;
        }
        clinics.forEach((clinic, index) => {
            this.log(`${index + 1}. clinicName: ${clinic.name}, id: ${clinic.id}`);
        });
    }
}
