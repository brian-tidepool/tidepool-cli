import * as cbgPayload from "./cbgPayload.js";
import { authenticateAndUploadData, UploadDataSet, UploadPostDataPayload } from "./authAndUploader.js";
import * as utils from "./Utils.js";
import * as addTag from "./addTag.js";
import * as uploadToCustodial from "./uploadToCustodial.js";
import * as createPatient from "./createPatient.js";
import { off } from "process";
import { Credentials } from "./credentials.js";
import { time } from "console";

// Define the key-value pair structure
interface TirDataBasic {
  cbgValues: number[];
  cgmUse: number;
  tirPercent: number;
}

interface TirData2 {
  cbgValues: number[];
  cgmUse: number;
  tirPercent1: number;
  tirPercent2: number;
}

interface TirData3 {
  cbgValues: number[];
  cgmUse: number;
  cbgCounts: number[];
}

type TirData = TirDataBasic | TirData2 | TirData3;

interface TirLookupEntry {
  period1: TirData;
  period2: TirData;
}

const tirLookup: Record<string, TirLookupEntry> = {
  "Time below 3.0 mmol/L > 1%": {
    period1: { cbgValues: [2.9, 3], cgmUse: 69, tirPercent: 5 },
    period2: { cbgValues: [2.9, 3], cgmUse: 69, tirPercent: 5 },
  },
  "Time below 3.9 mmol/L > 4%": {
    period1: { cbgValues: [3.8, 3.9], cgmUse: 70, tirPercent: 5 },
    period2: { cbgValues: [3.8, 3.9], cgmUse: 70, tirPercent: 5 },
  },
  "Drop in Time in Range > 15%": {
    period1: { cbgValues: [10.1, 3.9], cgmUse: 80, tirPercent: 1 },
    period2: { cbgValues: [10.1, 3.9], cgmUse: 80, tirPercent: 25 },
  },
  "Rise in Time in Range > 15%": {
    period1: { cbgValues: [10.1, 3.9], cgmUse: 80, tirPercent: 25 },
    period2: { cbgValues: [10.1, 3.9], cgmUse: 80, tirPercent: 1 },
  },
  "Time in Range < 70%": {
    period1: { cbgValues: [10.0, 10.1], cgmUse: 80, tirPercent: 69 },
    period2: { cbgValues: [10.0, 10.1], cgmUse: 80, tirPercent: 69 },
  },
  "CGM Wear Time < 70%": {
    period1: { cbgValues: [3.8, 3.9], cgmUse: 69, tirPercent: 1 },
    period2: { cbgValues: [3.8, 3.9], cgmUse: 69, tirPercent: 1 },
  },
  "CGM Wear Time < 60%": {
    period1: { cbgValues: [3.8, 3.9], cgmUse: 59, tirPercent: 1 },
    period2: { cbgValues: [3.8, 3.9], cgmUse: 59, tirPercent: 1 },
  },
  "Meeting Targets": {
    period1: { cbgValues: [3.8, 3.9], cgmUse: 75, tirPercent: 1 },
    period2: { cbgValues: [3.8, 3.9], cgmUse: 75, tirPercent: 1 },
  },
  "Drop in Time in Very Low > 15%": {
    period1: { cbgValues: [10.1, 2.9], cgmUse: 80, tirPercent: 1 },
    period2: { cbgValues: [10.1, 2.9], cgmUse: 80, tirPercent: 25 },
  },
  "Rise in Time in Very Low > 15%": {
    period1: { cbgValues: [10.1, 2.9], cgmUse: 80, tirPercent: 25 },
    period2: { cbgValues: [10.1, 2.9], cgmUse: 80, tirPercent: 1 },
  },
  "Drop in Time in Low > 15%": {
    period1: { cbgValues: [10.1, 3.8], cgmUse: 80, tirPercent: 1 },
    period2: { cbgValues: [10.1, 3.8], cgmUse: 80, tirPercent: 25 },
  },
  "Rise in Time in Low > 15%": {
    period1: { cbgValues: [10.1, 3.8], cgmUse: 80, tirPercent: 25 },
    period2: { cbgValues: [10.1, 3.8], cgmUse: 80, tirPercent: 1 },
  },
  "Drop in Time in High > 15%": {
    period1: { cbgValues: [2.9, 10.1], cgmUse: 80, tirPercent: 1 },
    period2: { cbgValues: [2.9, 10.1], cgmUse: 80, tirPercent: 25 },
  },
  "Rise in Time in High > 15%": {
    period1: { cbgValues: [2.9, 10.1], cgmUse: 80, tirPercent: 25 },
    period2: { cbgValues: [2.9, 10.1], cgmUse: 80, tirPercent: 1 },
  },
  "Drop in Time in Very High > 15%": {
    period1: { cbgValues: [10.1, 14.0], cgmUse: 80, tirPercent: 1 },
    period2: { cbgValues: [10.1, 14.0], cgmUse: 80, tirPercent: 25 },
  },
  "Rise in Time in Very High > 15%": {
    period1: { cbgValues: [10.1, 14.0], cgmUse: 80, tirPercent: 25 },
    period2: { cbgValues: [10.1, 14.0], cgmUse: 80, tirPercent: 1 },
  },
  "Very Low > 1% Time below 3.0 mmol/L": {
    period1: { cbgValues: [2.9, 3], cgmUse: 69, tirPercent: 5 },
    period2: { cbgValues: [2.9, 3], cgmUse: 69, tirPercent: 5 },
  },
  "Low > 4% Time below 3.9 mmol/L": {
    period1: { cbgValues: [3.8, 3.9], cgmUse: 70, tirPercent: 5 },
    period2: { cbgValues: [3.8, 3.9], cgmUse: 70, tirPercent: 5 },
  },
  "Highest > 1% Time above 19.4 mmol/L": {
    period1: { cbgValues: [10.0, 19.5], cgmUse: 69, tirPercent: 98 },
    period2: { cbgValues: [10.0, 19.5], cgmUse: 69, tirPercent: 98 },
  },
  "Very High > 5% Time above 13.9 mmol/L": {
    period1: { cbgValues: [10.0, 14.0], cgmUse: 69, tirPercent: 94 },
    period2: { cbgValues: [10.0, 14.0], cgmUse: 69, tirPercent: 94 },
  },
  "High > 25% Time above 10.0 mmol/L": {
    period1: { cbgValues: [10.0, 10.1], cgmUse: 69, tirPercent: 70 },
    period2: { cbgValues: [10.0, 10.1], cgmUse: 69, tirPercent: 70 },
  },
  "High > 25% Time above 10.0 mmol/L 2": {
    period1: { cbgValues: [14.0, 10.1, 10.0], cgmUse: 69, tirPercent1: 4, tirPercent2: 22 },
    period2: { cbgValues: [14.0, 10.1, 10.0], cgmUse: 69, tirPercent1: 4, tirPercent2: 22 },
  },
  "exact101_3": {
    period1: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [85, 81, 72, 25,25] },
    period2: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [85, 81, 72, 25,25] },
  },
  "exact99_3": {
    period1: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [ 73, 73, 72, 35,35] },
    period2: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [ 73, 73, 72, 35,35] },
  },
  "exact101a_3": {
    period1: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [157, 81, 25, 0, 25] },
    period2: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [157, 81, 25, 0,25] },
  },
  "verylow2_3": {
    period1: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [6, 0, 282, 0, 0] },
    period2: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [6, 0, 282, 0, 0] },
  },
  "verylow4_3": {
    period1: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [12, 0, 276, 0, 0] },
    period2: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [12, 0, 276, 0, 0] },
  },
  "verylow3_3": {
    period1: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [9, 0, 279, 0, 0] },
    period2: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [9, 0, 279, 0, 0] },
  },
   "low5_3": {
    period1: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [2, 13, 273, 0, 0] },
    period2: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [2, 13, 273, 0, 0] },
  },
    "low7_3": {
    period1: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [2, 19, 267, 0, 0] },
    period2: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [2, 19, 267, 0, 0] },
  },
     "low6_3": {
    period1: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [2, 16, 270, 0, 0] },
    period2: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [2, 16, 270, 0, 0] },
  },
    "drop20_3": {
    period1: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 288, 0, 0] },
    period2: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 231, 57, 0] },
  },
    "drop15_3": {
    period1: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 288, 0, 0] },
    period2: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 243, 45, 0] },
  },
     "drop17_3": {
    period1: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 288, 0, 0] },
    period2: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 239, 49, 0] },
  },
    "high30_3": {
    period1: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 202, 86, 0] },
    period2: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 202, 86, 0] },
  },
    "high26_3": {
    period1: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 213, 75, 0] },
    period2: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 213, 75, 0] },
  },
     "high28_3": {
    period1: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 207,81, 0] },
    period2: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 207, 81, 0] },
  },
    "veryhigh8_3": {
    period1: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 265, 0, 23] },
    period2: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 265, 0, 23] },
  },
    "veryhigh6_3": {
    period1: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 271, 0, 17] },
    period2: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 271, 0, 17] },
  },
     "veryhigh7_3": {
    period1: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 268,0, 20] },
    period2: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 268,0, 20] },
  },
  
    "cgm60_3": {
    period1: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 172, 0, 0] },
    period2: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 172, 0, 0] },
  },
    "cgm20_3": {
    period1: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 57, 0, 0] },
    period2: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 57, 0, 0] },
  },
     "cgm40_3": {
    period1: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 115,0, 0] },
    period2: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 115,0, 0] },
  },
   
    "meetingtargets100_3": {
    period1: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 288, 0, 0] },
    period2: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 288, 0, 0] },
  },
    "meetingtargets90_3": {
    period1: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 259, 29, 0] },
    period2: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 259, 29, 0] },
  },
     "meetingtargets95_3": {
    period1: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 274,14, 0] },
    period2: { cbgValues: [2.9, 3.1, 4, 10.2, 14], cgmUse: 10.0, cbgCounts: [0, 0, 274,14, 0] },
  },
  "Large Drop in Time in Range > 15%": {
    period1: { cbgValues: [10.1, 3.9], cgmUse: 80, tirPercent: 1 },
    period2: { cbgValues: [10.1, 3.9], cgmUse: 80, tirPercent: 20 },
  },
  "Low Time in Range < 70%": {
    period1: { cbgValues: [10.0, 10.1], cgmUse: 80, tirPercent: 69 },
    period2: { cbgValues: [10.0, 10.1], cgmUse: 80, tirPercent: 69 },
  },
  "Low CGM Wear Time < 70%": {
    period1: { cbgValues: [3.8, 3.9], cgmUse: 69, tirPercent: 1 },
    period2: { cbgValues: [3.8, 3.9], cgmUse: 69, tirPercent: 1 },
  },
};

const smbgLookup: Record<string, number[][]> = {
  "1 reading per day, average 2.9 mmol/l": [
    [2.9, 1],
    [2.9, 1],
  ],
  "5 reading per day, average 3.8 mmol/l ": [
    [3.8, 5],
    [3.8, 5],
  ],
  "10 readings per day, average 3.9 mmol/l": [
    [3.9, 10],
    [3.9, 10],
  ],
  "15 readings per day, average 10.1 mmol/l": [
    [10.1, 15],
    [10.1, 15],
  ],
  "100 readings per day, average 14.0 mmol/l": [
    [14.0, 100],
    [14.0, 100],
  ],
  "200 readings per day, average 19.5 mmol/l": [
    [19.5, 200],
    [19.5, 200],
  ],
};

const smbgLowAndHighLookup: Record<string, number[][]> = {
  "1 low, 1 high": [
    [1, 1],
    [1, 1],
  ],
  "5 low, 0 high": [
    [5, 0],
    [5, 0],
  ],
  "0 low, 10 high": [
    [0, 10],
    [0, 10],
  ],
  "15 low, 15 high": [
    [15, 15],
    [15, 15],
  ],
  "100 low, 100 high": [
    [100, 100],
    [100, 100],
  ],
  "0 low, 0 high": [
    [0, 0],
    [0, 0],
  ],
};

const tirLookup2: Record<string, TirLookupEntry> = {
  Low: {
    period1: { cbgValues: [2.9, 2.9], cgmUse: 100, tirPercent: 100 },
    period2: { cbgValues: [2.9, 2.9], cgmUse: 100, tirPercent: 100 },
  },
  High: {
    period1: { cbgValues: [10.1, 10.1], cgmUse: 100, tirPercent: 100 },
    period2: { cbgValues: [10.1, 10.1], cgmUse: 100, tirPercent: 100 },
  },
};

export async function createDashboard(
  tirCounts: Record<string, number>,
  periodLength: number,
  clinicId: string,
  tagId: string,
  creds: Credentials
) {
  let patientIds = [];
  console.log("Creating patients");
  let counter = 0;
  for (const key in tirCounts) {
    for (let i = 0; i < tirCounts[key]; i++) {
      let payload = {
        password: "tidepool",
        birthDate: "2000-01-01",
        fullName: `${key}  ${counter}`,
        tags: [],
        connectDexcom: false,
      };
      let patientId = await createPatient.createPatient<typeof payload>(creds, clinicId, payload);
      counter++;
      if (patientId) {
        patientIds.push(patientId);
      }
    }
  }

  let tagResult = addTag.addTag(creds, clinicId, patientIds, tagId);
  await utils.sleep(20000);
  let patientCounter = 0;
  const end = new Date(Date.now());
  const start2 = new Date(end.getTime() - 1440 * periodLength * 60000);
  const end2 = new Date(end.getTime());
  const start1 = new Date(end.getTime() - 1440 * 2 * periodLength * 60000);
  const end1 = new Date(end.getTime() - 1440 * periodLength * 60000);

  for (const key in tirCounts) {
    for (let i = 0; i < tirCounts[key]; i++) {
      console.log("patientId", patientIds[patientCounter]);

      await uploadToCustodial.uploadToCustodial(
        start1,
        end1,
        clinicId,
        tirLookup[key].period1.cbgValues,
        tirLookup[key].period1.cgmUse,
        (tirLookup[key].period1 as TirDataBasic).tirPercent,
        patientIds[patientCounter],
        creds
      );
      await uploadToCustodial.uploadToCustodial(
        start2,
        end2,
        clinicId,
        tirLookup[key].period2.cbgValues,
        tirLookup[key].period2.cgmUse,
        (tirLookup[key].period2 as TirDataBasic).tirPercent,
        patientIds[patientCounter],
        creds
      );
      patientCounter++;
    }
  }
}

export async function createMedtronicDashboard(tirCounts: number, clinicId: string, tagId: string, creds: Credentials) {
  let patientIds = [];
  console.log("Creating patients");
  let counter = 0;
  for (let i = 0; i < tirCounts; i++) {
    let payload = {
      password: "tidepool",
      birthDate: "2000-01-01",
      fullName: `Medtronic  ${i}`,
      tags: [],
      connectDexcom: false,
    };
    let patientId = await createPatient.createPatient<typeof payload>(creds, clinicId, payload);
    counter++;
    if (patientId) {
      patientIds.push(patientId);
    }
  }
  let tagResult = addTag.addTag(creds, clinicId, patientIds, tagId);
  await utils.sleep(20000);

  for (let i = 0; i < tirCounts; i++) {
    console.log("patientId", patientIds[i]);

    await uploadToCustodial.uploadMedtronicToCustodial(clinicId, patientIds[i], creds);
  }
}

export async function createDashboardOffset(
  tirCounts: Record<string, number>,
  periodLength: number,
  offsetTimeMinutes: number,
  patientName: string,
  clinicId: string,
  tagId: string,
  creds: Credentials
) {
  let patientIds = [];
  console.log("Creating patients");
  let counter = 0;
  for (const key in tirCounts) {
    for (let i = 0; i < tirCounts[key]; i++) {
      let payload = {
        password: "tidepool",
        birthDate: "2000-01-01",
        fullName: `${key}  ${counter}`,
        tags: [],
        connectDexcom: false,
      };
      let patientId = await createPatient.createPatient<typeof payload>(creds, clinicId, payload);
      counter++;
      if (patientId) {
        patientIds.push(patientId);
      }
    }
  }

  let tagResult = addTag.addTag(creds, clinicId, patientIds, tagId);
  await utils.sleep(20000);
  let patientCounter = 0;
  const end = new Date(Date.now() - offsetTimeMinutes * 60000);
  const start2 = new Date(end.getTime() - 1440 * periodLength * 60000);
  const end2 = new Date(end.getTime());
  const start1 = new Date(end.getTime() - 1440 * 2 * periodLength * 60000);
  const end1 = new Date(end.getTime() - 1440 * periodLength * 60000);

  for (const key in tirCounts) {
    for (let i = 0; i < tirCounts[key]; i++) {
      console.log("patientId", patientIds[patientCounter]);
      console.log(end);
      console.log(end2);
      if (key.endsWith("2")) {
        await uploadToCustodial.uploadToCustodial2(
          start1,
          end1,
          clinicId,
          tirLookup[key].period1.cbgValues,
          tirLookup[key].period1.cgmUse,
          (tirLookup[key].period1 as TirData2).tirPercent1,
          (tirLookup[key].period1 as TirData2).tirPercent2,
          patientIds[patientCounter],
          creds
        );
        await uploadToCustodial.uploadToCustodial2(
          start2,
          end2,
          clinicId,
          tirLookup[key].period2.cbgValues,
          tirLookup[key].period2.cgmUse,
          (tirLookup[key].period2 as TirData2).tirPercent1,
          (tirLookup[key].period2 as TirData2).tirPercent2,
          patientIds[patientCounter],
          creds
        );
        patientCounter++;
      } else if (key.endsWith("3")) {
        await uploadToCustodial.uploadToCustodial3(
          start1,
          end1,
          clinicId,
          tirLookup[key].period1.cbgValues,
          tirLookup[key].period1.cgmUse,
          (tirLookup[key].period1 as TirData3).cbgCounts,
          patientIds[patientCounter],
          creds
        );
        await uploadToCustodial.uploadToCustodial3(
          start2,
          end2,
          clinicId,
          tirLookup[key].period2.cbgValues,
          tirLookup[key].period2.cgmUse,
          (tirLookup[key].period2 as TirData3).cbgCounts,
          patientIds[patientCounter],
          creds
        );
        patientCounter++;
      } else {
        await uploadToCustodial.uploadToCustodial(
          start1,
          end1,
          clinicId,
          tirLookup[key].period1.cbgValues,
          tirLookup[key].period1.cgmUse,
          (tirLookup[key].period1 as TirDataBasic).tirPercent,
          patientIds[patientCounter],
          creds
        );
        await uploadToCustodial.uploadToCustodial(
          start2,
          end2,
          clinicId,
          tirLookup[key].period2.cbgValues,
          tirLookup[key].period2.cgmUse,
          (tirLookup[key].period2 as TirDataBasic).tirPercent,
          patientIds[patientCounter],
          creds
        );
        patientCounter++;
      }
    }
  }
}

export async function createCGMUseDashboardOffset(
  multiplier: number,
  cgmUse: number,
  tirCounts: Record<string, number>,
  periodLength: number,
  offsetTimeMinutes: number,
  patientName: string,
  clinicId: string,
  tagId: string,
  creds: Credentials
) {
  let patientIds = [];
  console.log("Creating patients");
  let counter = 0;
  for (const key in tirCounts) {
    for (let i = 0; i < tirCounts[key]; i++) {
      let payload = {
        password: "tidepool",
        birthDate: "2000-01-01",
        fullName: `${key}  ${counter}`,
        tags: [],
        connectDexcom: false,
      };
      let patientId = await createPatient.createPatient<typeof payload>(creds, clinicId, payload);
      counter++;
      if (patientId) {
        patientIds.push(patientId);
      }
    }
  }

  let tagResult = addTag.addTag(creds, clinicId, patientIds, tagId);
  await utils.sleep(20000);
  let patientCounter = 0;
  const end = new Date(Date.now() - offsetTimeMinutes * 60000);
  const start2 = new Date(end.getTime() - 1440 * periodLength * 60000);
  const end2 = new Date(end.getTime());
  const start1 = new Date(end.getTime() - 1440 * 2 * periodLength * 60000);
  const end1 = new Date(end.getTime() - 1440 * periodLength * 60000);

  for (const key in tirCounts) {
    for (let i = 0; i < tirCounts[key]; i++) {
      console.log("patientId", patientIds[patientCounter]);
      console.log("tir category", key);
      console.log("end of upload", end2);
      await uploadToCustodial.uploadToRepeatCustodial(
        multiplier,
        start1,
        end1,
        clinicId,
        tirLookup[key].period1.cbgValues,
        cgmUse,
        (tirLookup[key].period1 as TirDataBasic).tirPercent,
        patientIds[patientCounter],
        creds
      );
      await uploadToCustodial.uploadToRepeatCustodial(
        multiplier,
        start2,
        end2,
        clinicId,
        tirLookup[key].period2.cbgValues,
        cgmUse,
        (tirLookup[key].period2 as TirDataBasic).tirPercent,
        patientIds[patientCounter],
        creds
      );

      patientCounter++;
    }
  }
}

export async function createDSAData(key: string, periodLength: number, offsetTimeMinutes: number, creds: Credentials) {
  const end = new Date(Date.now() - offsetTimeMinutes * 60000);
  const start2 = new Date(end.getTime() - 1440 * periodLength * 60000);
  const end2 = new Date(end.getTime());
  const start1 = new Date(end.getTime() - 1440 * 2 * periodLength * 60000);
  const end1 = new Date(end.getTime() - 1440 * periodLength * 60000);

  await uploadToCustodial.uploadToDSA(
    start1,
    end1,
    tirLookup[key].period1.cbgValues,
    tirLookup[key].period1.cgmUse,
    (tirLookup[key].period1 as TirDataBasic).tirPercent,
    creds
  );
  await uploadToCustodial.uploadToDSA(
    start2,
    end2,
    tirLookup[key].period2.cbgValues,
    tirLookup[key].period2.cgmUse,
    (tirLookup[key].period2 as TirDataBasic).tirPercent,
    creds
  );
}

export async function createSMBGDashboardOffset(
  smbgCounts: Record<string, number>,
  periodLength: number,
  offsetTimeMinutes: number,
  patientName: string,
  clinicId: string,
  tagId: string,
  creds: Credentials,
  interval: number
) {
  let patientIds = [];
  console.log("Creating patients");
  let counter = 0;
  for (const key in smbgCounts) {
    for (let i = 0; i < smbgCounts[key]; i++) {
      let payload = {
        password: "tidepool",
        birthDate: "2000-01-01",
        fullName: `${key}  ${counter}`,
        tags: [],
        connectDexcom: false,
      };
      let patientId = await createPatient.createPatient<typeof payload>(creds, clinicId, payload);
      counter++;
      if (patientId) {
        patientIds.push(patientId);
      }
    }
  }

  let tagResult = addTag.addTag(creds, clinicId, patientIds, tagId);
  await utils.sleep(20000);
  let patientCounter = 0;
  
  // Align to midnight UTC to ensure consistent day counts
  const end = new Date(Date.now() - offsetTimeMinutes * 60000);
  end.setUTCHours(0, 0, 0, 0);
  
  const start2 = new Date(end.getTime() - 1440 * periodLength * 60000);
  const end2 = new Date(end.getTime());
  const start1 = new Date(end.getTime() - 1440 * 2 * periodLength * 60000);
  const end1 = new Date(end.getTime() - 1440 * periodLength * 60000);

  for (const key in smbgCounts) {
    for (let i = 0; i < smbgCounts[key]; i++) {
      console.log("patientId", patientIds[patientCounter]);
      console.log(end);
      console.log(end2);
      await uploadToCustodial.uploadSMBGToCustodial(
        start1,
        end1,
        clinicId,
        smbgLookup[key][0][0],
        smbgLookup[key][0][1],
        patientIds[patientCounter],
        creds,
        interval
      );
      await uploadToCustodial.uploadSMBGToCustodial(
        start2,
        end2,
        clinicId,
        smbgLookup[key][1][0],
        smbgLookup[key][1][1],
        patientIds[patientCounter],
        creds,
        interval
      );
      patientCounter++;
    }
  }
}

export async function createLowAndHighSMBGDashboardOffset(
  smbgCounts: Record<string, number>,
  periodLength: number,
  offsetTimeMinutes: number,
  patientName: string,
  clinicId: string,
  tagId: string,
  creds: Credentials
) {
  let patientIds = [];
  console.log("Creating patients");
  let counter = 0;
  for (const key in smbgCounts) {
    for (let i = 0; i < smbgCounts[key]; i++) {
      let payload = {
        password: "tidepool",
        birthDate: "2000-01-01",
        fullName: `${key}  ${counter}`,
        tags: [],
        connectDexcom: false,
      };
      let patientId = await createPatient.createPatient<typeof payload>(creds, clinicId, payload);
      counter++;
      if (patientId) {
        patientIds.push(patientId);
      }
    }
  }

  let tagResult = addTag.addTag(creds, clinicId, patientIds, tagId);
  await utils.sleep(20000);
  let patientCounter = 0;
  const end = new Date(Date.now() - offsetTimeMinutes * 60000);
  const start2 = new Date(end.getTime() - 1440 * periodLength * 60000);
  const end2 = new Date(end.getTime());
  const start1 = new Date(end.getTime() - 1440 * 2 * periodLength * 60000);
  const end1 = new Date(end.getTime() - 1440 * periodLength * 60000);

  for (const key in smbgCounts) {
    for (let i = 0; i < smbgCounts[key]; i++) {
      console.log("patientId", patientIds[patientCounter]);
      console.log(end);
      console.log(end2);
      await uploadToCustodial.uploadLowAndHighSMBGToCustodial(
        start1,
        end1,
        clinicId,
        smbgLowAndHighLookup[key][0][0],
        smbgLowAndHighLookup[key][0][1],
        patientIds[patientCounter],
        creds
      );
      await uploadToCustodial.uploadLowAndHighSMBGToCustodial(
        start2,
        end2,
        clinicId,
        smbgLowAndHighLookup[key][1][0],
        smbgLowAndHighLookup[key][1][1],
        patientIds[patientCounter],
        creds
      );
      patientCounter++;
    }
  }
}

export async function createSourceDashboard(clinicId: string, creds: Credentials) {
  let patientIds = [];
  console.log("Creating source patients");
  let counter = 0;
  let payloads = [
    {
      password: "tidepool",
      birthDate: "2024-04-05",
      fullName: "real duplicate source",
      mrn: "REALDUPLICATESOURCETAG1",
      tags: [],
      connectDexcom: false,
    },
    {
      password: "tidepool",
      birthDate: "2000-01-01",
      fullName: "duplicate 1",
      mrn: "DUPLICATE1ASOURCE",
      tags: [],
      connectDexcom: false,
    },
    {
      password: "tidepool",
      birthDate: "2000-01-01",
      fullName: "duplicate 1",
      mrn: "DUPLICATE1BSOURCE",
      tags: [],
      connectDexcom: false,
    },
    {
      password: "tidepool",
      birthDate: "2002-01-01",
      fullName: "duplicate mrn only source",
      mrn: "DUPLICATENAMEONLYTAG1TAG2",
      tags: [],
      connectDexcom: false,
    },
    {
      password: "tidepool",
      birthDate: "2000-01-01",
      fullName: "source 1",
      mrn: "SOURCE1",
      tags: [],
      connectDexcom: false,
    },
    {
      password: "tidepool",
      birthDate: "2000-01-01",
      fullName: "source 2",
      mrn: "SOURCE2",
      tags: [],
      connectDexcom: false,
    },
    {
      password: "tidepool",
      birthDate: "2000-01-01",
      fullName: "source 3",
      mrn: "SOURCE3",
      tags: [],
      connectDexcom: false,
    },
  ];

  for (let i = 0; i < payloads.length; i++) {
    let payload = payloads[i];
    let patientId = await createPatient.createPatient<typeof payload>(creds, clinicId, payload);
    counter++;
    if (patientId) {
      patientIds.push(patientId);
    }
  }
  await utils.sleep(20000);

  await uploadToCustodial.uploadMedtronicToCustodial(clinicId, patientIds[0], creds);
}

export async function createTargetDashboard(clinicId: string, creds: Credentials) {
  let patientIds = [];
  console.log("Creating target patients");
  let counter = 0;
  let payloads = [
    {
      password: "tidepool",
      birthDate: "2024-04-05",
      fullName: "real duplicate target",
      mrn: "REALDUPLICATESOURCETAG3",
      tags: [],
      connectDexcom: false,
    },
    {
      password: "tidepool",
      birthDate: "2000-01-01",
      fullName: "duplicate 2",
      mrn: "DUPLICATE2",
      tags: [],
      connectDexcom: false,
    },
    {
      password: "tidepool",
      birthDate: "2000-01-01",
      fullName: "duplicate 2",
      mrn: "DUPLICATE1",
      tags: [],
      connectDexcom: false,
    },
    {
      password: "tidepool",
      birthDate: "2001-01-01",
      fullName: "duplicate mrn only target",
      mrn: "MRNONLY",
      tags: [],
      connectDexcom: false,
    },
    {
      password: "tidepool",
      birthDate: "2000-01-01",
      fullName: "target 1",
      mrn: "TARGET1TAG1",
      tags: [],
      connectDexcom: false,
    },
    {
      password: "tidepool",
      birthDate: "2000-01-01",
      fullName: "target 2",
      mrn: "TARGET2TAG3",
      tags: [],
      connectDexcom: false,
    },
    {
      password: "tidepool",
      birthDate: "2000-01-01",
      fullName: "target 3",
      mrn: "TARGET3",
      tags: [],
      connectDexcom: false,
    },
  ];

  for (let i = 0; i < payloads.length; i++) {
    let payload = payloads[i];
    let patientId = await createPatient.createPatient<typeof payload>(creds, clinicId, payload);
    counter++;
    if (patientId) {
      patientIds.push(patientId);
    }
  }
  await utils.sleep(20000);

  await uploadToCustodial.uploadMedtronicToCustodial(clinicId, patientIds[0], creds);
}

export async function createDeviceIdDashboardOffset(
  periodLength: number,
  offsetTimeMinutes: number,
  patientName: string,
  clinicId: string,
  tagId: string,
  creds: Credentials
) {
  let patientIds = [];
  console.log("Creating patients");
  let counter = 0;

  let payload = {
    password: "tidepool",
    birthDate: "2000-01-01",
    fullName: patientName,
    tags: [],
    connectDexcom: false,
  };
  let patientId = await createPatient.createPatient<typeof payload>(creds, clinicId, payload);
  counter++;
  if (patientId) {
    patientIds.push(patientId);
  }

  let tagResult = addTag.addTag(creds, clinicId, patientIds, tagId);
  await utils.sleep(20000);
  let patientCounter = 0;
  const end = new Date(Date.now() - offsetTimeMinutes * 60000);
  const start2 = new Date(end.getTime() - 1440 * periodLength * 60000);
  const end2 = new Date(end.getTime());
  const start1 = new Date(end.getTime() - 1440 * 2 * periodLength * 60000);
  const end1 = new Date(end.getTime() - 1440 * periodLength * 60000);

  const end_ = new Date(Date.now() - (offsetTimeMinutes - 1) * 60000);
  const start2_ = new Date(end_.getTime() - 1440 * periodLength * 60000);
  const end2_ = new Date(end_.getTime());
  const start1_ = new Date(end_.getTime() - 1440 * 2 * periodLength * 60000);
  const end1_ = new Date(end_.getTime() - 1440 * periodLength * 60000);

  console.log("patientId", patientIds[patientCounter]);

  console.log("end of upload", end2);
  await uploadToCustodial.uploadToDeviceIdCustodial(
    1,
    start1,
    end1,
    clinicId,
    tirLookup2["Low"].period1.cbgValues,
    tirLookup2["Low"].period1.cgmUse,
    (tirLookup2["Low"].period1 as TirDataBasic).tirPercent,
    patientIds[patientCounter],
    creds
  );
  await uploadToCustodial.uploadToDeviceIdCustodial(
    1,
    start2,
    end2,
    clinicId,
    tirLookup2["Low"].period2.cbgValues,
    tirLookup2["Low"].period1.cgmUse,
    (tirLookup2["Low"].period2 as TirDataBasic).tirPercent,
    patientIds[patientCounter],
    creds
  );

  console.log("patientId", patientIds[patientCounter]);

  console.log("end of upload", end2);
  await uploadToCustodial.uploadToDeviceIdCustodial(
    2,
    start1_,
    end1_,
    clinicId,
    tirLookup2["High"].period1.cbgValues,
    tirLookup2["High"].period1.cgmUse,
    (tirLookup2["High"].period1 as TirDataBasic).tirPercent,
    patientIds[patientCounter],
    creds
  );
  await uploadToCustodial.uploadToDeviceIdCustodial(
    2,
    start2_,
    end2_,
    clinicId,
    tirLookup2["High"].period2.cbgValues,
    tirLookup2["High"].period1.cgmUse,
    (tirLookup2["High"].period2 as TirDataBasic).tirPercent,
    patientIds[patientCounter],
    creds
  );
}

export async function createDashboardSampleInterval(
  timeInSeconds: number[],
  sampleIntervals: number[],
  dayOffset: number,
  clinicId: string,
  tagId: string,
  creds: Credentials,
  patientName: string
) {
  let patientIds = [];
  console.log("Creating patients");
  let counter = 0;

  let payload = {
    password: "tidepool",
    birthDate: "2000-01-01",
    fullName: `sampleInterval ${patientName}`,
    tags: [],
    connectDexcom: false,
  };
  let patientId = await createPatient.createPatient<typeof payload>(creds, clinicId, payload);
  counter++;
  if (patientId) {
    patientIds.push(patientId);
  }

  let tagResult = addTag.addTag(creds, clinicId, patientIds, tagId);
  await utils.sleep(20000);
  let patientCounter = 0;
  const start = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
  start.setDate(start.getDate() - dayOffset);
  start.setHours(0, 0, 0, 0);

  console.log("patientId", patientIds[patientCounter]);

  await uploadToCustodial.uploadToCustodialSampleInterval(
    start,
    timeInSeconds,
    sampleIntervals,
    patientIds[patientCounter],
    creds
  );
}
