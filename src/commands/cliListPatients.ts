// src/commands/hello.ts
import { Command, Args, Flags } from "@oclif/core";
import { fetchPatientsByClinicAndTag, Patient } from "../lib/fetchPatients.js"
import { BaseCommand } from '../base-command.js'






let periodLength = 14;





export default class UserList extends BaseCommand<typeof UserList> {
    static description = 'List dashboard by tagId'

    static flags = {

        clinicId: Flags.string({
            char: 'g',
            description: 'clinic id',
            default: '633b559d1d64ad2c9471178b'
        }),
        tagId: Flags.string({
            char: 'h',
            description: 'tag id',
            default: '6841e165edfe663ac4d8bff0'
        })

    } as const



    public async run(): Promise<void> {
        const { flags } = await this.parse(UserList);
        this.recordHistory();
       

        const patients: Patient[] | null = await fetchPatientsByClinicAndTag(this.credentials, flags.clinicId, flags.tagId);
        console.log(`clinicId: ${flags.clinicId}, tagId: ${flags.tagId}`);
        if (!patients || patients.length === 0) {
            this.log('No patients found for the given clinic and tag.');
            return;
        }
        patients.forEach((user1: Patient, index: number) => {
            console.log(`${index + 1}.  fullName: ${user1.fullName}, id:${user1.id}`);
        });

      

    }
}



