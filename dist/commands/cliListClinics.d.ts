import { BaseCommand } from '../base-command.js';
export default class ClinicList extends BaseCommand<typeof ClinicList> {
    static description: string;
    static flags: {};
    run(): Promise<void>;
}
