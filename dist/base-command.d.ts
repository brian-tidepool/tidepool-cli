import { Command, Interfaces } from '@oclif/core';
import { CredentialsManager, Credentials } from './lib/credentials.js';
export type Flags<T extends typeof Command> = Interfaces.InferredFlags<typeof BaseCommand['baseFlags'] & T['flags']>;
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>;
export declare abstract class BaseCommand<T extends typeof Command> extends Command {
    protected credentialsManager: CredentialsManager;
    protected credentials: Credentials;
    protected flags: Flags<T>;
    protected args: Args<T>;
    constructor(argv: string[], config: any);
    static enableJsonFlag: boolean;
    init(): Promise<void>;
    protected catch(error: any): Promise<any>;
    protected finally(_: Error | undefined): Promise<any>;
    protected recordHistory(): void;
    protected getParameterSuggestions(): Array<{
        args: string[];
        flags: Record<string, any>;
        creds: Record<string, any>;
    }>;
    protected printFilename(): string | undefined;
}
