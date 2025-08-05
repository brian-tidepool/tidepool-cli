// src/commands/hello.ts
import { Command, Args, Flags } from "@oclif/core";
import { fetchClinicsWithTags, ClinicWithTags } from "../lib/fetchTags.js"
import { BaseCommand } from '../base-command.js'






let periodLength = 14;





export default class TagList extends BaseCommand<typeof TagList> {
    static description = 'List clinics by id and name'


    static flags = {

        clinicId: Flags.string({
            char: 'g',
            description: 'clinic id',
            required: true
        }),


    }


    public async run(): Promise<void> {


            const { flags } = await this.parse(TagList);
            this.recordHistory();

        const clinicsWithTags: ClinicWithTags[] | null = await fetchClinicsWithTags(this.credentials);
        if (!clinicsWithTags || clinicsWithTags.length === 0) {
            this.log('No clinics or tags found for the current user.');
            return;
        }
        clinicsWithTags.forEach((clinicWithTags, clinicIdx) => {
            if (clinicWithTags.clinic.patientTags.length === 0) {
                this.log(`Clinic ${clinicIdx + 1} has no tags.`);
            } else {
                clinicWithTags.clinic.patientTags.forEach((tag, tagIdx) => {
                    this.log(`${tagIdx + 1}. tagName: ${tag.name}, id: ${tag.id}`);
                });
            }
        });

        

    }
}



