// src/commands/suggest.ts
import { Command, Flags, Args, Config } from '@oclif/core';
import { ParameterHistory } from '../lib/history.js';
export default class Suggest extends Command {
    static description = 'Get parameter suggestions based on history';
    static examples = [
        '<%= config.bin %> <%= command.id %> deploy',
    ];
    static flags = {
        limit: Flags.integer({
            char: 'l',
            description: 'limit number of suggestions',
            default: 5,
        }),
    };
    static args = {
        command: Args.string({
            description: 'command to get suggestions for',
            required: true,
        }),
    };
    async run() {
        const { args, flags } = await this.parse(Suggest);
        const history = new ParameterHistory();
        const config = await Config.load();
        const suggestions = history.getRecentParameters(args.command, flags.limit);
        if (suggestions.length === 0) {
            this.log(`No parameter history found for command: ${args.command}`);
            return;
        }
        this.log(`\nParameter suggestions for '${args.command}':\n`);
        suggestions.forEach((suggestion, index) => {
            const argsStr = suggestion.args.length > 0 ? suggestion.args.join(' ') : '';
            const flagsStr = Object.entries(suggestion.flags)
                .map(([key, value]) => `--${key}${value === true ? '' : `=${value}`}`)
                .join(' ');
            const credsStr = Object.entries(suggestion.creds)
                .map(([key, value]) => `${key}:${value}`)
                .join(' ');
            const params = [argsStr, flagsStr].filter(Boolean).join(', ');
            this.log(`${suggestion.timestamp},${credsStr}: ${this.config.bin} ${args.command} ${params}`);
        });
        this.log('\nUse these suggestions to quickly rerun previous commands with similar parameters.');
    }
}
