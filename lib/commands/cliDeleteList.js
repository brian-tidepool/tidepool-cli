// src/commands/hello.ts
import { Command, Flags } from "@oclif/core";
import * as Delete from "../lib/deletePatients.js";
import { CredentialsManager } from '../lib/credentials.js';
export default class UserDelete extends Command {
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
    credentialsManager = new CredentialsManager();
    async run() {
        const { flags } = await this.parse(UserDelete);
        try {
            // Load credentials
            const storedCredentials = this.credentialsManager.loadCredentials();
            const creds = {
                userName: storedCredentials.userName,
                password: storedCredentials.password,
                baseUrl: storedCredentials.baseUrl,
                clinicId: flags.clinicId,
                tagId: flags.tagId
            };
            const user = await Delete.deletePatients(creds, flags.tagId, flags.clinicId);
            this.log('✅ Delete operation completed successfully');
        }
        catch (error) {
            this.error(`Failed to delete dashboard: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
