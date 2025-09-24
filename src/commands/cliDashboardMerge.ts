// src/commands/hello.ts
import { Command, Args, Flags } from "@oclif/core";
import * as Dashboard from "../lib/dashboardScenarioSelector.js";
import { BaseCommand } from "../base-command.js";
import type { FlagInput } from "@oclif/core/lib/interfaces/parser.js";

let periodLength = 14;

export default class UserDashboardMerge extends BaseCommand<typeof UserDashboardMerge> {
  static description = "Create a full dashboard of 51 users. See flag details for default counts for each categories";

  static flags: FlagInput = {
    // Integer flag

    clinicIdSource: Flags.string({
      char: "g",
      description: "clinic id",
      default: "633b559d1d64ad2c9471178b",
    }),
    clinicIdTarget: Flags.string({
      char: "h",
      description: "clinic id",
      default: "633b559d1d64ad2c9471178b",
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(UserDashboardMerge);

    await Dashboard.createSourceDashboard(flags.clinicIdSource, this.credentials);
    await Dashboard.createTargetDashboard(flags.clinicIdTarget, this.credentials);
  }
}
