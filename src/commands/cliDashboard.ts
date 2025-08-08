// src/commands/hello.ts
import { Command, Args, Flags } from "@oclif/core";
import * as Dashboard from "../lib/dashboardScenarioSelector.js"
import { BaseCommand } from '../base-command.js'






let periodLength = 14;





export default class UserDashboard extends BaseCommand<typeof UserDashboard> {
    static description = 'Create a full dashboard of 51 users. See flag details for default counts for each categories'

    static flags = {
        // Integer flag
        below3: Flags.integer({
            char: 'a',
            description: 'Time below 3.0 mmol/L > 1%',
            default: 10
        }),
        below39: Flags.integer({
            char: 'b',
            description: 'Time below 3.9 mmol/L > 4%',
            default: 10
        }),
        drop: Flags.integer({
            char: 'c',
            description: 'Drop in Time in Range > 15%',
            default: 10
        }),
        lesstir70: Flags.integer({
            char: 'd',
            description: 'Time in Range < 70%',
            default: 10
        }),
        lesscgm70: Flags.integer({
            char: 'e',
            description: 'CGM Wear Time <70%',
            default: 6
        }),
        meetingTargets: Flags.integer({
            char: 'f',
            description: 'Meeting Targets',
            default: 5
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
        })

    } 

    

    public async run(): Promise<void> {
        const { flags } = await this.parse(UserDashboard);
       

            const tirCounts: Record<string, number> = {
                "Time below 3.0 mmol/L > 1%": flags.below3,
                "Time below 3.9 mmol/L > 4%":flags.below39,
                "Drop in Time in Range > 15%": flags.drop,
                "Time in Range < 70%": flags.lesstir70,
                "CGM Wear Time <70%": flags.lesscgm70,
                "Meeting Targets": flags.meetingTargets
            };
            
            const user = await Dashboard.createDashboard(tirCounts, periodLength, flags.clinicId,flags.tagId, this.credentials)

       

    }
}



