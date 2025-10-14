// src/commands/cliFindClinic.ts
import { Command, Args, Flags } from "@oclif/core";
import {
  findClinicByName,
  findClinicByNameCaseInsensitive,
  findClinicsByNamePartial,
} from "../lib/findClinicByName.js";
import { BaseCommand } from "../base-command.js";

import type { Flag, FlagInput } from "@oclif/core/lib/interfaces/parser.js";

export default class FindClinic extends BaseCommand<typeof FindClinic> {
  static description = "Find a clinic ID by clinic name with various search options";

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
    partial: Flags.boolean({
      char: "p",
      description: "find all clinics that contain the search text (partial match)",
      default: false,
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(FindClinic);
    this.recordHistory();

    if (flags.partial) {
      // Search for partial matches
      const results = await findClinicsByNamePartial(this.credentials, flags.clinicName);

      if (results.length > 0) {
        this.log(`Found ${results.length} clinic(s) containing "${flags.clinicName}":`);
        results.forEach((clinic, index) => {
          this.log(`${index + 1}. Name: "${clinic.name}" - ID: ${clinic.id}`);
        });
      } else {
        this.log(`No clinics found containing "${flags.clinicName}" in their name`);
      }
    } else if (flags.caseInsensitive) {
      // Case-insensitive exact match
      const clinicId = await findClinicByNameCaseInsensitive(this.credentials, flags.clinicName);

      if (clinicId) {
        this.log(`Found clinic "${flags.clinicName}" with ID: ${clinicId} (case-insensitive match)`);
      } else {
        this.log(`Clinic "${flags.clinicName}" not found (case-insensitive search)`);
      }
    } else {
      // Exact match (case-sensitive)
      const clinicId = await findClinicByName(this.credentials, flags.clinicName);

      if (clinicId) {
        this.log(`Found clinic "${flags.clinicName}" with ID: ${clinicId}`);
      } else {
        this.log(`Clinic "${flags.clinicName}" not found (exact match)`);
      }
    }
  }
}
