// src/commands/cliDashboard14Day.ts
import { Flags } from "@oclif/core";
import * as Dashboard from "../lib/dashboardScenarioSelector.js";

import { BaseCommand } from "../base-command.js";
import type { FlagInput } from "@oclif/core/lib/interfaces/parser.js";

export default class UserDashboard14Day extends BaseCommand<typeof UserDashboard14Day> {
  static description =
    "Create an offset dashboard for the per-day 14-day scenarios (cbgCounts specified per day). Each array/flag is named 2.9-<a>_3.1-<total>, where <a> is the percent at 2.9 and <total> is the below-range total (2.9 + 3.1). Each flag's value is the number of users created for that category.";
  static examples = [
    "<%= config.bin %> <%= command.id %> --log-level=info --vl06l35=1 --clinicId= --tagId= --offset=1440 --patientName=test",
  ];

  static flags: FlagInput = {
    // One flag per per-day scenario; the flag value is the number of patients to create
    // for that scenario. The second number is the below-range TOTAL (2.9 + 3.1).
    vl04l32: Flags.integer({ description: "Array 2.9-0.4_3.1-3.2 (0.4% at 2.9, 2.8% at 3.1; 3.2% total below range)", default: 0 }),
    vl06l35: Flags.integer({ description: "Array 2.9-0.6_3.1-3.5 (0.6% at 2.9, 2.9% at 3.1; 3.5% total below range)", default: 0 }),
    vl1l52: Flags.integer({ description: "Array 2.9-1_3.1-5.2 (1% at 2.9, 4.2% at 3.1; 5.2% total below range)", default: 0 }),
    vl14l61: Flags.integer({ description: "Array 2.9-1.4_3.1-6.1 (1.4% at 2.9, 4.7% at 3.1; 6.1% total below range)", default: 0 }),
    vl0l4: Flags.integer({ description: "Array 2.9-0_3.1-4 (0% at 2.9, 4% at 3.1; 4% total below range)", default: 0 }),
    vl03l46: Flags.integer({ description: "Array 2.9-0.3_3.1-4.6 (0.3% at 2.9, 4.3% at 3.1; 4.6% total below range)", default: 0 }),
    vl05l39: Flags.integer({ description: "Array 2.9-0.5_3.1-3.9 (0.5% at 2.9, 3.4% at 3.1; 3.9% total below range)", default: 0 }),
    vl051l401: Flags.integer({ description: "Array 2.9-0.51_3.1-4.01 (0.512% at 2.9, 3.51% at 3.1; 4.02% total below range; 279 readings/day = ~96.9% CGM use)", default: 0 }),
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
      description: "patient name",
      default: "test",
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(UserDashboard14Day);
    this.recordHistory();

    const tirCounts: Record<string, number> = {
      "2.9-0.4_3.1-3.2": flags.vl04l32,
      "2.9-0.6_3.1-3.5": flags.vl06l35,
      "2.9-1_3.1-5.2": flags.vl1l52,
      "2.9-1.4_3.1-6.1": flags.vl14l61,
      "2.9-0_3.1-4": flags.vl0l4,
      "2.9-0.3_3.1-4.6": flags.vl03l46,
      "2.9-0.5_3.1-3.9": flags.vl05l39,
      "2.9-0.51_3.1-4.01": flags.vl051l401,
    };

    const user = await Dashboard.createPerDayDashboardOffset(
      tirCounts,
      flags.offset,
      flags.patientName,
      flags.clinicId,
      flags.tagId,
      this.credentials
    );
  }
}
