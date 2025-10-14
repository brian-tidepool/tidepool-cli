// src/commands/hello.ts
import { Command, Args, Flags } from "@oclif/core";
import * as Dashboard from "../lib/dashboardScenarioSelector.js";

import { BaseCommand } from "../base-command.js";
import type { FlagInput } from "@oclif/core/lib/interfaces/parser.js";

export default class UserDashboardSampleInterval extends BaseCommand<typeof UserDashboardSampleInterval> {
  static description =
    "Create offset dashboard where category flags (ex: meetingTargets) equals the number of users for that category created. Example contains empty required flags for clinicId and tagId";
  static examples = [
    "<%= config.bin %> <%= command.id %> --log-level=info --below3=0 --below39=0 --drop=0 --lesstir70=0 --lesscgm70=0 --meetingTargets=1 --clinicId= --tagId= --offset=1440 --patientName=test",
  ];

  static flags: FlagInput = {
    // Integer flag
    timeInSeconds: Flags.integer({
      char: "a",
      description: "time in seconds",
      multiple: true,
    }),
    sampleIntervals: Flags.integer({
      char: "b",
      description: "sample intervals",
      multiple: true,
    }),
    clinicId: Flags.string({
      char: "g",
      description: "clinic id",
      default: "633b559d1d64ad2c9471178b",
    }),
    tagId: Flags.string({
      char: "h",
      description: "tag id",
      default: "6841e165edfe663ac4d8bff0",
    }),
    dayOffset: Flags.integer({
      char: "i",
      description: "offset",
      default: 1,
    }),
    patientName: Flags.string({
      char: "j",
      description: "offset",
      default: "test",
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(UserDashboardSampleInterval);
    this.recordHistory();

    const user = await Dashboard.createDashboardSampleInterval(
      flags.timeInSeconds,
      flags.sampleIntervals,
      flags.dayOffset,
      flags.clinicId,
      flags.tagId,
      this.credentials,
      flags.patientName
    );
  }
}
