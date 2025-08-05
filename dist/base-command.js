import { Command } from '@oclif/core';
import { ParameterHistory } from './lib/commandHistory.js';
import { CredentialsManager } from './lib/credentials.js';
export class BaseCommand extends Command {
    credentialsManager;
    credentials;
    flags;
    args;
    constructor(argv, config) {
        super(argv, config);
        this.credentialsManager = new CredentialsManager();
    }
    // add the --json flag
    static enableJsonFlag = true;
    // define flags that can be inherited by any command that extends BaseCommand
    async init() {
        await super.init();
        const { args, flags } = await this.parse({
            flags: this.ctor.flags,
            baseFlags: super.ctor.baseFlags,
            enableJsonFlag: this.ctor.enableJsonFlag,
            args: this.ctor.args,
            strict: this.ctor.strict,
        });
        this.flags = flags;
        this.args = args;
        // Load credentials for all commands except configure
        if (this.constructor.name !== 'Configure') {
            try {
                this.credentials = this.credentialsManager.loadCredentials();
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(error.message); // TypeScript knows it's an Error now
                }
                else {
                    console.error("Unknown error:", error);
                }
            }
        }
    }
    async catch(error) {
        // Log the error before handling
        console.error('Error caught:', error);
        // Call parent's catch method
        return super.catch(error);
    }
    async finally(_) {
        // called after run and catch regardless of whether or not the command errored
        return super.finally(_);
    }
    recordHistory() {
        const history = new ParameterHistory();
        const command = this.id || '';
        const args = Object.values(this.args).filter(Boolean);
        const flags = this.flags || {};
        const creds = this.credentials;
        console.log('record');
        console.log(command, args, flags, creds);
        history.addEntry(command, args, flags, creds);
    }
    getParameterSuggestions() {
        const history = new ParameterHistory();
        const command = this.constructor.name.toLowerCase();
        return history.getRecentParameters(command, 5);
    }
    printFilename() {
        //const fileName = (new Error().stack?.split('\n')[2]?.match(/\(([^)]+)\)/)?.[1]?.split('/').pop()?.split(':')[0] || 'unknown').split('.').slice(0, -1).join('.') || 'unknown';
        const fileName = this.id;
        return fileName;
    }
}
