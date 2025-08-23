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
        lowhigh1: Flags.integer({
            char: 'a',
            description: '1 low, 1 high',
            default: 0
        }),
        lowhigh5: Flags.integer({
            char: 'b',
            description: '5 low, 0 high',
            default: 0
        }),
        lowhigh10: Flags.integer({
            char: 'c',
            description: '0 low, 10 high',
            default: 0
        }),
        lowhigh15: Flags.integer({
            char: 'd',
            description: '15 low, 15 high',
            default: 0
        }),
        lowhigh100: Flags.integer({
            char: 'e',
            description: '100 low, 100 high',
            default: 0
        }),
        lowhigh0: Flags.integer({
            char: 'f',
            description: '0 low, 0 high',
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
    "1 low, 1 high": flags.lowhigh1,
    "5 low, 0 high": flags.lowhigh5,
    "0 low, 10 high": flags.lowhigh10,
    "15 low, 15 high": flags.lowhigh15,
    "100 low, 100 high": flags.lowhigh100,
    "0 low, 0 high": flags.lowhigh0
};

            const user = await Dashboard.createLowAndHighSMBGDashboardOffset(smbgLookup, periodLength, flags.offset, flags.patientName, flags.clinicId, flags.tagId,this.credentials)

        

    }
}



