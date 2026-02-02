// src/commands/cliCreateTag.ts
import { Command, Args, Flags } from "@oclif/core";
import { createTag } from "../lib/createTag.js";
import { BaseCommand } from "../base-command.js";

import type { Flag, FlagInput } from "@oclif/core/lib/interfaces/parser.js";

export default class CreateTag extends BaseCommand<typeof CreateTag> {
  static description = "Create a new tag in a clinic";

  static flags: FlagInput = {
    clinicId: Flags.string({
      char: "c",
      description: "clinic id where the tag will be created",
      required: true,
    }),
    tagName: Flags.string({
      char: "t",
      description: "name of the tag to create",
      required: true,
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(CreateTag);
    this.recordHistory();

    const statusCode = await createTag(this.credentials, flags.clinicId, flags.tagName);

    if (statusCode === 200 || statusCode === 201) {
      this.log(`Successfully created tag "${flags.tagName}" in clinic: ${flags.clinicId}`);
    } else if (statusCode) {
      this.log(`Failed to create tag. Status code: ${statusCode}`);
    } else {
      this.log(`Error creating tag "${flags.tagName}" in clinic: ${flags.clinicId}`);
    }
  }
}
