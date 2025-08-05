import { BaseCommand } from '../base-command.js';
export default class UsersSearch extends BaseCommand<typeof UsersSearch> {
    static description: string;
    static flags: {
        clinicId: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        tagId: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
    };
    static examples: string[];
    static args: {
        keyword: import("@oclif/core/lib/interfaces/parser.js").Arg<string, Record<string, unknown>>;
    };
    run(): Promise<void>;
}
