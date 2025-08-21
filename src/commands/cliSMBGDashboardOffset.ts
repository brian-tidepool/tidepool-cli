// src/commands/hello.ts
import { Command, Args, Flags } from "@oclif/core";
import * as Dashboard from "../lib/dashboardScenarioSelector.js"

import { BaseCommand } from '../base-command.js'
import type { FlagInput } from '@oclif/core/lib/interfaces/parser.js'



let periodLength = 14;




export default class UserDashboardOffset extends BaseCommand<typeof UserDashboardOffset> {
    static description = 'Create offset dashboard where category flags (ex: meetingTargets) equals the number of users for that category created. Example contains empty required flags for clinicId and tagId';
    static examples = ['<%= config.bin %> <%= command.id %> --log-level=info --below3=0 --below39=0 --drop=0 --lesstir70=0 --lesscgm70=0 --meetingTargets=1 --clinicId= --tagId= --offset=1440 --patientName=test'    
    ];

    static flags: FlagInput = {
        // Integer flag
        numreadings1: Flags.integer({
            char: 'a',
            description: '1 reading per day, average 2.9 mmol/l',
            default: 0
        }),
        numreadings5: Flags.integer({
            char: 'b',
            description: '5 reading per day, average 3.8 mmol/l',
            default: 0
        }),
        numreadings10: Flags.integer({
            char: 'c',
            description: '10 readings per day, average 3.9 mmol/l',
            default: 0
        }),
        numreadings15: Flags.integer({
            char: 'd',
            description: '15 readings per day, average 10.1 mmol/l',
            default: 0
        }),
        numreadings100: Flags.integer({
            char: 'e',
            description: '100 readings per day, average 14.0 mmol/l',
            default: 0
        }),
        numreadings200: Flags.integer({
            char: 'f',
            description: '200 readings per day, average 19.5 mmol/l',
            default: 1
        }),
        clinicId: Flags.string({
            char: 'g',
            description: 'clinic id',
            default: '633b559d1d64ad2c9471178b'
        }),
        tagId: Flags.string({
            char: 'h',
            description: 'tag id',
            default: '6841e165edfe663ac4d8bff0'
        }),
        offset: Flags.integer({
            char: 'i',
            description: 'offset',
            default: 1440
        }),
        patientName: Flags.string({
            char: 'j',
            description: 'offset',
            default: 'test'
        })

    } 



    public async run(): Promise<void> {
        const { flags } = await this.parse(UserDashboardOffset);
        this.recordHistory();
       
        
            const smbgLookup: Record<string, number> = {
    "1 reading per day, average 2.9 mmol/l": flags.numreadings1,
    "5 reading per day, average 3.8 mmol/l ": flags.numreadings5,
    "10 readings per day, average 3.9 mmol/l": flags.numreadings10,
    "15 readings per day, average 10.1 mmol/l": flags.numreadings15,
    "100 readings per day, average 14.0 mmol/l": flags.numreadings100,
    "200 readings per day, average 19.5 mmol/l": flags.numreadings200
};

            const user = await Dashboard.createSMBGDashboardOffset(smbgLookup, periodLength, flags.offset, flags.patientName, flags.clinicId, flags.tagId,this.credentials)

        

    }
}



