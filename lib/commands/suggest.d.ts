import { Command } from '@oclif/core';
export default class Suggest extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        limit: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<number, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
    };
    static args: {
        command: import("@oclif/core/lib/interfaces/parser.js").Arg<string, Record<string, unknown>>;
    };
    run(): Promise<void>;
}
