import { Command } from '@oclif/core';
export default class Configure extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        help: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<void>;
        userName: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string | undefined, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        password: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string | undefined, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        baseUrl: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string | undefined, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        showEnv: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
        setEnv: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
        check: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
    };
    private credentialsManager;
    run(): Promise<void>;
}
