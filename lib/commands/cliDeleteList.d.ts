import { Command } from "@oclif/core";
export default class UserDelete extends Command {
    static description: string;
    static flags: {
        clinicId: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        tagId: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
    };
    private credentialsManager;
    run(): Promise<void>;
}
