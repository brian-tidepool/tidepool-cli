// src/commands/hello.ts
import { Command, Args, Flags } from "@oclif/core";
import * as Dashboard from "../lib/dashboardScenarioSelector.js"

import { BaseCommand } from '../base-command.js'
import type { FlagInput } from '@oclif/core/lib/interfaces/parser.js'



let periodLength = 14;




export default class PatientUpload extends BaseCommand<typeof PatientUpload> {
    static description = 'Create user upload for single user';
    static examples = ['<%= config.bin %> <%= command.id %> --log-level=info --meetingTargets=true'    
    ];

    static flags: FlagInput = {
        // Integer flag
        below3: Flags.boolean({
            char: 'a',
            description: 'Time below 3.0 mmol/L > 1%',
            default: false
        }),
        below39: Flags.boolean({
            char: 'b',
            description: 'Time below 3.9 mmol/L > 4%',
            default: false
        }),
        drop: Flags.boolean({
            char: 'c',
            description: 'Drop in Time in Range > 15%',
            default: false
        }),
        lesstir70: Flags.boolean({
            char: 'd',
            description: 'Time in Range < 70%',
            default: false      
        }),
        lesscgm70: Flags.boolean({
            char: 'e',
            description: 'CGM Wear Time < 70%',
            default: false
        }),
        meetingTargets: Flags.boolean({
            char: 'f',
            description: 'Meeting Targets',
            default: true
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
        const { flags } = await this.parse(PatientUpload);
        this.recordHistory();
       

            const tirCounts: Record<string, boolean> = {
                "Time below 3.0 mmol/L > 1%": flags.below3,
                "Time below 3.9 mmol/L > 4%": flags.below39,
                "Drop in Time in Range > 15%": flags.drop,
                "Time in Range < 70%": flags.lesstir70,
                "CGM Wear Time < 70%": flags.lesscgm70,
                "Meeting Targets": flags.meetingTargets
            };
            for (const key in tirCounts) {
                if (tirCounts[key] === true) {
                     const user = await Dashboard.createDSAData(key, periodLength, flags.offset, this.credentials)
                     break;
                }
            }
           

        

    }
}



