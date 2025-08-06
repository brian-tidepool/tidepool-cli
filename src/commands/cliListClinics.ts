// src/commands/hello.ts
import { Command, Args, Flags } from "@oclif/core";
import { fetchClinicsByCredentials, ClinicData} from "../lib/fetchClinics.js"
import { BaseCommand } from '../base-command.js'






let periodLength = 14;





export default class ClinicList extends BaseCommand<typeof ClinicList> {
    static description = 'List clinics by id and name'

  
    static flags = {};


    public async run(): Promise<void> {
        const { flags } = await this.parse(ClinicList);
        this.recordHistory();
        


        const clinics: ClinicData[] | null = await fetchClinicsByCredentials(this.credentials);
        if (!clinics || clinics.length === 0) {
            this.log('No clinics found for the current user.');
            return;
        }
        clinics.forEach((clinic, index) => {
            this.log(`${index + 1}. clinicName: ${clinic.clinic.name}, id: ${clinic.clinic.id}`);
        });
    }
}



