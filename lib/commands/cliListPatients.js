// src/commands/hello.ts
import { Flags } from "@oclif/core";
import * as Get from "../lib/getPatients.js";
import { BaseCommand } from '../base-command.js';
let periodLength = 14;
export default class UserList extends BaseCommand {
    static description = 'List dashboard by tagId';
    static flags = {
        clinicId: Flags.string({
            char: 'g',
            description: 'clinic id',
            default: '633b559d1d64ad2c9471178b'
        }),
        tagId: Flags.string({
            char: 'h',
            description: 'tag id',
            default: '6841e165edfe663ac4d8bff0'
        })
    };
    async run() {
        const { flags } = await this.parse(UserList);
        this.recordHistory();
        const user = await Get.getPatients(this.credentials, flags.clinicId, flags.tagId);
        console.log(`clinicId: ${flags.clinicId}, tagId: ${flags.tagId}`);
        user.data.forEach((user1, index) => {
            console.log(`${index + 1}.  fullName: ${user1.fullName}, id:${user1.id}`);
        });
    }
}
