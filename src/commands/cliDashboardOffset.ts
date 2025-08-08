// src/commands/hello.ts
import { Command, Args, Flags } from "@oclif/core";
import * as Dashboard from "../lib/dashboardScenarioSelector.js"

import { BaseCommand } from '../base-command.js'




let periodLength = 14;




export default class UserDashboardOffset extends BaseCommand<typeof UserDashboardOffset> {
    static description = 'Create offset dashboard where category flags (ex: meetingTargets) equals the number of users for that category created. Example contains empty required flags for clinicId and tagId';
    static examples = ['<%= config.bin %> <%= command.id %> --log-level=info --below3=0 --below39=0 --drop=0 --lesstir70=0 --lesscgm70=0 --meetingTargets=1 --clinicId= --tagId= --offset=1440 --patientName=test'    
    ];

    static flags = {
        // Integer flag
        below3: Flags.integer({
            char: 'a',
            description: 'Time below 3.0 mmol/L > 1%',
            default: 0
        }),
        below39: Flags.integer({
            char: 'b',
            description: 'Time below 3.9 mmol/L > 4%',
            default: 0
        }),
        drop: Flags.integer({
            char: 'c',
            description: 'Drop in Time in Range > 15%',
            default: 0
        }),
        lesstir70: Flags.integer({
            char: 'd',
            description: 'Time in Range < 70%',
            default: 0
        }),
        lesscgm70: Flags.integer({
            char: 'e',
            description: 'CGM Wear Time <70%',
            default: 0
        }),
        meetingTargets: Flags.integer({
            char: 'f',
            description: 'Meeting Targets',
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

    } as const



    public async run(): Promise<void> {
        const { flags } = await this.parse(UserDashboardOffset);
        this.recordHistory();
       

            const tirCounts: Record<string, number> = {
                "Time below 3.0 mmol/L > 1%": flags.below3,
                "Time below 3.9 mmol/L > 4%": flags.below39,
                "Drop in Time in Range > 15%": flags.drop,
                "Time in Range < 70%": flags.lesstir70,
                "CGM Wear Time <70%": flags.lesscgm70,
                "Meeting Targets": flags.meetingTargets
            };
            
            const user = await Dashboard.createDashboardOffset(tirCounts, periodLength, flags.offset, flags.patientName, flags.clinicId, flags.tagId,this.credentials)

        

    }
}



