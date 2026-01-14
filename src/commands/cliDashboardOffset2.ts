// src/commands/hello.ts
import { Command, Args, Flags } from "@oclif/core";
import * as Dashboard from "../lib/dashboardScenarioSelector.js";

import { BaseCommand } from "../base-command.js";
import type { FlagInput } from "@oclif/core/lib/interfaces/parser.js";

export default class UserDashboardOffset2 extends BaseCommand<typeof UserDashboardOffset2> {
  static description =
    "Create offset dashboard where category flags (ex: meetingTargets) equals the number of users for that category created. Example contains empty required flags for clinicId and tagId";
  static examples = [
    "<%= config.bin %> <%= command.id %> --log-level=info --below3=0 --below39=0 --drop=0 --lesstir70=0 --lesscgm70=0 --meetingTargets=1 --clinicId= --tagId= --offset=1440 --patientName=test",
  ];

  static flags: FlagInput = {
    // Integer flag
    below3: Flags.integer({
      char: "a",
      description: "Time below 3.0 mmol/L > 1%",
      default: 0,
    }),
    below39: Flags.integer({
      char: "b",
      description: "Time below 3.9 mmol/L > 4%",
      default: 0,
    }),
    drop: Flags.integer({
      char: "c",
      description: "Drop in Time in Range > 15%",
      default: 0,
    }),
    lesstir70: Flags.integer({
      char: "d",
      description: "Time in Range < 70%",
      default: 0,
    }),
    lesscgm70: Flags.integer({
      char: "e",
      description: "CGM Wear Time <70%",
      default: 0,
    }),
    meetingTargets: Flags.integer({
      char: "f",
      description: "Meeting Targets",
      default: 1,
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
    offset: Flags.integer({
      char: "i",
      description: "offset",
      default: 1440,
    }),
    patientName: Flags.string({
      char: "j",
      description: "offset",
      default: "test",
    }),
    verylow: Flags.integer({
      char: "k",
      description: "Very Low > 1% Time below 3.0 mmol/L",
      default: 0,
    }),
    low: Flags.integer({
      char: "l",
      description: "Low > 4% Time below 3.9 mmol/L",
      default: 0,
    }),
    highest: Flags.integer({
      char: "m",
      description: "Highest > 1% Time above 19.4 mmol/L",
      default: 0,
    }),
    veryhigh: Flags.integer({
      char: "n",
      description: "Very High > 5% Time above 13.9 mmol/L",
      default: 0,
    }),
    high: Flags.integer({
      char: "o",
      description: "High > 25% Time above 10.0 mmol/L",
      default: 0,
    }),
    largedrop: Flags.integer({
      char: "p",
      description: "Large Drop in Time in Range > 15%",
      default: 0,
    }),
    lowtime: Flags.integer({
      char: "q",
      description: "Low Time in Range < 70%",
      default: 0,
    }),
    lowcgm: Flags.integer({
      char: "r",
      description: "Low CGM Wear Time < 70%",
      default: 0,
    }),
    periodLength: Flags.integer({
      char: "t",
      description: "period length",
      default: 14,
    }),
    high2: Flags.integer({
      char: "u",
      description: "High > 25% Time above 10.0 mmol/L 2",
      default: 0,
    }),
    exact101: Flags.integer({
      char: "v",
      description: "High > 25% Time above 10.0 mmol/L 2",
      default: 0,
    }),
    exact99: Flags.integer({
      char: "w",
      description: "High > 25% Time above 10.0 mmol/L 2",
      default: 0,
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(UserDashboardOffset2);
    this.recordHistory();

    const tirCounts: Record<string, number> = {
      "exact101_3": flags.exact101,
      "exact99_3": flags.exact99,
      "Time below 3.0 mmol/L > 1%": flags.below3,
      "Time below 3.9 mmol/L > 4%": flags.below39,
      "Drop in Time in Range > 15%": flags.drop,
      "Time in Range < 70%": flags.lesstir70,
      "CGM Wear Time < 70%": flags.lesscgm70,
      "Meeting Targets": flags.meetingTargets,
      "Very Low > 1% Time below 3.0 mmol/L": flags.verylow,
      "Low > 4% Time below 3.9 mmol/L": flags.low,
      "Highest > 1% Time above 19.4 mmol/L": flags.highest,
      "Very High > 5% Time above 13.9 mmol/L": flags.veryhigh,
      "High > 25% Time above 10.0 mmol/L": flags.high,
      "High > 25% Time above 10.0 mmol/L 2": flags.high2,
      "Large Drop in Time in Range > 15%": flags.largedrop,
      "Low Time in Range < 70%": flags.lowtime,
      "Low CGM Wear Time < 70%": flags.lowcgm,
    };

    const user = await Dashboard.createDashboardOffset(
      tirCounts,
      flags.periodLength,
      flags.offset,
      flags.patientName,
      flags.clinicId,
      flags.tagId,
      this.credentials
    );
  }
}
