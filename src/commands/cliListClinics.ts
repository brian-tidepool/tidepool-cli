// src/commands/hello.ts
import { Command, Args, Flags } from "@oclif/core";
import * as Get from "../lib/getClinics.js"
import { BaseCommand } from '../base-command.js'






let periodLength = 14;





export default class ClinicList extends BaseCommand<typeof ClinicList> {
    static description = 'List clinics by id and name'

  
    static flags = {};


    public async run(): Promise<void> {
        const { flags } = await this.parse(ClinicList);
        this.recordHistory();
        

            const user = await Get.getClinics(this.credentials,
                ) ;
      
         user!.forEach((user1, index) => {
            console.log(`${index+1}.  clinicName: ${user1.clinic.name}, id:${user1.clinic.id}`)
        });

        

    }
}



