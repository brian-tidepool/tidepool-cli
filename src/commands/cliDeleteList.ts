// src/commands/hello.ts

import { Flags } from "@oclif/core";
import * as Delete from "../lib/deletePatients.js";
import { BaseCommand } from "../base-command.js";

export default class UserDelete extends BaseCommand<typeof UserDelete> {
    static description = 'Delete dashboard by tag id';

    static flags = {
        clinicId: Flags.string({
            char: 'g',
            description: 'clinic id',
            required: true
        }),
        tagId: Flags.string({
            char: 'h',
            description: 'tag id',
            required: true
        })
    };

    public async run(): Promise<void> {
        try {
            const user = await Delete.deletePatients(this.credentials, this.flags.tagId, this.flags.clinicId);
            this.log('✅ Delete operation completed successfully');
        } catch (error) {
            this.error(`Failed to delete dashboard: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}



