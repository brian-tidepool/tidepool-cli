// src/commands/hello.ts
import { Flags } from '@oclif/core';
import { BaseCommand } from '../../base-command.js';
import { Dashboard } from '../lib/selectScenarios.js';
import { CredentialsManager } from '../lib/credentials.js';

interface Credentials {
    userName: string;
    password: string;
    baseUrl: string;
    clinicId: string;
    tagId: string;
}

let clinicId = '633b559d1d64ad2c9471178b';
var cleanup = true;
var create = true;
var createMedtronic = true;
var search = false;
let tagId = '6841e165edfe663ac4d8bff0';
let periodLength = 14;

export default class UserDashboardOffset extends BaseCommand<typeof UserDashboardOffset> {
    static description = 'Create offset dashboard'

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

    }

    

    public async run(): Promise<void> {
        const { flags } = await this.parse(UserDashboardOffset);
        this.recordHistory();
        try {
            // Load credentials using CredentialsManager
            const credentialsManager = new CredentialsManager();
            const credentials = credentialsManager.loadCredentials();

            const tirCounts: Record<string, number> = {
                "Time below 3.0 mmol/L > 1%": flags.below3,
                "Time below 3.9 mmol/L > 4%":flags.below39,
                "Drop in Time in Range > 15%": flags.drop,
                "Time in Range < 70%": flags.lesstir70,
                "CGM Wear Time <70%": flags.lesscgm70,
                "Meeting Targets": flags.meetingTargets
            };
            
            const creds: Credentials = {
                userName: credentials.userName,
                password: credentials.password,
                baseUrl: credentials.baseUrl,
                clinicId: flags.clinicId,
                tagId: flags.tagId
            };
            
            const user = await Dashboard.createDashboardOffset(tirCounts, periodLength,flags.offset,flags.patientName, creds)

        } catch (error) {
            this.error('Failed to create dashboard: ${error.message}');
        }

    }
}



