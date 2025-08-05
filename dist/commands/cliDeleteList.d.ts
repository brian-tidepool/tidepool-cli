import { BaseCommand } from "../base-command.js";
export default class UserDelete extends BaseCommand<typeof UserDelete> {
    static description: string;
    static flags: {
        clinicId: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        tagId: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
    };
    run(): Promise<void>;
}
