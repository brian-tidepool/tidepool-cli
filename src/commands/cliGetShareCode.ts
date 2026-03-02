// src/commands/cliGetShareCode.ts
import { Flags } from "@oclif/core";
import {
  findShareCodeByClinicName,
  findShareCodeByClinicNameCaseInsensitive,
} from "../lib/findShareCodeByClinicName.js";
import { BaseCommand } from "../base-command.js";

import type { FlagInput } from "@oclif/core/lib/interfaces/parser.js";

export default class GetShareCode extends BaseCommand<typeof GetShareCode> {
  static description = "Get the shareCode of a clinic by its name";

  static flags: FlagInput = {
    clinicName: Flags.string({
      char: "n",
      description: "clinic name to search for",
      required: true,
    }),
    caseInsensitive: Flags.boolean({
      char: "i",
      description: "perform case-insensitive search",
      default: false,
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(GetShareCode);
    this.recordHistory();

    let shareCode: string | null;

    if (flags.caseInsensitive) {
      // Case-insensitive search
      shareCode = await findShareCodeByClinicNameCaseInsensitive(this.credentials, flags.clinicName);

      if (shareCode) {
        this.log(`ShareCode for clinic "${flags.clinicName}": ${shareCode} (case-insensitive match)`);
      } else {
        this.log(`Clinic "${flags.clinicName}" not found or has no shareCode (case-insensitive search)`);
      }
    } else {
      // Exact match (case-sensitive)
      shareCode = await findShareCodeByClinicName(this.credentials, flags.clinicName);

      if (shareCode) {
        this.log(`ShareCode for clinic "${flags.clinicName}": ${shareCode}`);
      } else {
        this.log(`Clinic "${flags.clinicName}" not found or has no shareCode (exact match)`);
      }
    }
  }
}
