// src/commands/cliFindTag.ts
import { Command, Args, Flags } from "@oclif/core";
import { findTagByName, findTagByNameAcrossAllClinics } from "../lib/findTagByName.js";
import { BaseCommand } from "../base-command.js";

import type { Flag, FlagInput } from "@oclif/core/lib/interfaces/parser.js";

export default class FindTag extends BaseCommand<typeof FindTag> {
  static description = "Find a tag ID by tag name within a specific clinic or across all clinics";

  static flags: FlagInput = {
    clinicId: Flags.string({
      char: "c",
      description: "clinic id to search within (optional - if not provided, searches all clinics)",
      required: false,
    }),
    tagName: Flags.string({
      char: "t",
      description: "tag name to search for",
      required: true,
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(FindTag);
    this.recordHistory();

    if (flags.clinicId) {
      // Search within a specific clinic
      const tagId = await findTagByName(this.credentials, flags.clinicId, flags.tagName);

      if (tagId) {
        this.log(`Found tag "${flags.tagName}" with ID: ${tagId} in clinic: ${flags.clinicId}`);
      } else {
        this.log(`Tag "${flags.tagName}" not found in clinic: ${flags.clinicId}`);
      }
    } else {
      // Search across all clinics
      const result = await findTagByNameAcrossAllClinics(this.credentials, flags.tagName);

      if (result) {
        this.log(`Found tag "${flags.tagName}" with ID: ${result.tagId} in clinic: ${result.clinicId}`);
      } else {
        this.log(`Tag "${flags.tagName}" not found in any clinic`);
      }
    }
  }
}
