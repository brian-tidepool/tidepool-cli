// src/commands/hello.ts
import { Flags } from "@oclif/core";
import * as Get from "../lib/getTags.js";
import { BaseCommand } from '../base-command.js';
let periodLength = 14;
export default class TagList extends BaseCommand {
    static description = 'List clinics by id and name';
    static flags = {
        clinicId: Flags.string({
            char: 'g',
            description: 'clinic id',
            required: true
        }),
    };
    async run() {
        const { flags } = await this.parse(TagList);
        this.recordHistory();
        const user = await Get.getTags(this.credentials);
        console.log(user);
        user.forEach((user1, index1) => {
            user1.clinic.patientTags.forEach((user2, index2) => {
                console.log(`${index2 + 1}.  tagName: ${user2.name}, id:${user2.id}`);
            });
        });
    }
}
