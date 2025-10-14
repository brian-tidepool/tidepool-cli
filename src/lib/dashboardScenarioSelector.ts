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
const tirLookup: Record<string, number[][]> = {
  "Time below 3.0 mmol/L > 1%": [
    [2.9, 3, 69, 5],
    [2.9, 3, 69, 5],
  ],
  "Time below 3.9 mmol/L > 4%": [
    [3.8, 3.9, 70, 5],
    [3.8, 3.9, 70, 5],
  ],
  "Drop in Time in Range > 15%": [
    [10.1, 3.9, 80, 1],
    [10.1, 3.9, 80, 25],
  ],
  "Rise in Time in Range > 15%": [
    [10.1, 3.9, 80, 25],
    [10.1, 3.9, 80, 1],
  ],
  "Time in Range < 70%": [
    [10.0, 10.1, 80, 69],
    [10.0, 10.1, 80, 69],
  ],
  "CGM Wear Time < 70%": [
    [3.8, 3.9, 69, 1],
    [3.8, 3.9, 69, 1],
  ],
  "CGM Wear Time < 60%": [
    [3.8, 3.9, 59, 1],
    [3.8, 3.9, 59, 1],
  ],
  "Meeting Targets": [
    [3.8, 3.9, 100, 1],
    [3.8, 3.9, 100, 1],
  ],
  "Drop in Time in Very Low > 15%": [
    [10.1, 2.9, 80, 1],
    [10.1, 2.9, 80, 25],
  ],
  "Rise in Time in Very Low > 15%": [
    [10.1, 2.9, 80, 25],
    [10.1, 2.9, 80, 1],
  ],
  "Drop in Time in Low > 15%": [
    [10.1, 3.8, 80, 1],
    [10.1, 3.8, 80, 25],
  ],
  "Rise in Time in Low > 15%": [
    [10.1, 3.8, 80, 25],
    [10.1, 3.8, 80, 1],
  ],
  "Drop in Time in High > 15%": [
    [2.9, 10.1, 80, 1],
    [2.9, 10.1, 80, 25],
  ],
  "Rise in Time in High > 15%": [
    [2.9, 10.1, 80, 25],
    [2.9, 10.1, 80, 1],
  ],
  "Drop in Time in Very High > 15%": [
    [10.1, 14.0, 80, 1],
    [10.1, 14.0, 80, 25],
  ],
  "Rise in Time in Very High > 15%": [
    [10.1, 14.0, 80, 25],
    [10.1, 14.0, 80, 1],
  ],
  "Very Low > 1% Time below 3.0 mmol/L": [
    [2.9, 3, 69, 5],
    [2.9, 3, 69, 5],
  ],
  "Low > 4% Time below 3.9 mmol/L": [
    [3.8, 3.9, 70, 5],
    [3.8, 3.9, 70, 5],
  ],
  "Highest > 1% Time above 19.4 mmol/L": [
    [10.0, 19.5, 69, 98],
    [10.0, 19.5, 69, 98],
  ],
  "Very High > 5% Time above 13.9 mmol/L": [
    [10.0, 14.0, 69, 94],
    [10.0, 14.0, 69, 94],
  ],
  "High > 25% Time above 10.0 mmol/L": [
    [10.0, 10.1, 69, 70],
    [10.0, 10.1, 69, 70],
  ],
  "High > 25% Time above 10.0 mmol/L 2": [
    [14.0, 10.1, 10.0, 69, 4, 22],
    [14.0, 10.1, 10.0, 69, 4, 22],
  ],
  "Large Drop in Time in Range > 15%": [
    [10.1, 3.9, 80, 1],
    [10.1, 3.9, 80, 20],
  ],
  "Low Time in Range < 70%": [
    [10.0, 10.1, 80, 69],
    [10.0, 10.1, 80, 69],
  ],
  "Low CGM Wear Time < 70%": [
    [3.8, 3.9, 69, 1],
    [3.8, 3.9, 69, 1],
  ],
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

const tirLookup2: Record<string, number[][]> = {
  Low: [
    [2.9, 2.9, 100, 100],
    [2.9, 2.9, 100, 100],
  ],
  High: [
    [10.1, 10.1, 100, 100],
    [10.1, 10.1, 100, 100],
  ],
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
        tirLookup[key][0].slice(0, 2),
        tirLookup[key][0][2],
        tirLookup[key][0][3],
        patientIds[patientCounter],
        creds
      );
      await uploadToCustodial.uploadToCustodial(
        start2,
        end2,
        clinicId,
        tirLookup[key][1].slice(0, 2),
        tirLookup[key][1][2],
        tirLookup[key][1][3],
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
          tirLookup[key][0].slice(0, 3),
          tirLookup[key][0][3],
          tirLookup[key][0][4],
          tirLookup[key][0][5],
          patientIds[patientCounter],
          creds
        );
        await uploadToCustodial.uploadToCustodial2(
          start2,
          end2,
          clinicId,
          tirLookup[key][1].slice(0, 3),
          tirLookup[key][1][3],
          tirLookup[key][1][4],
          tirLookup[key][1][5],
          patientIds[patientCounter],
          creds
        );
        patientCounter++;
      } else {
        await uploadToCustodial.uploadToCustodial(
          start1,
          end1,
          clinicId,
          tirLookup[key][0].slice(0, 2),
          tirLookup[key][0][2],
          tirLookup[key][0][3],
          patientIds[patientCounter],
          creds
        );
        await uploadToCustodial.uploadToCustodial(
          start2,
          end2,
          clinicId,
          tirLookup[key][1].slice(0, 2),
          tirLookup[key][1][2],
          tirLookup[key][1][3],
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
        tirLookup[key][0].slice(0, 2),
        cgmUse,
        tirLookup[key][0][3],
        patientIds[patientCounter],
        creds
      );
      await uploadToCustodial.uploadToRepeatCustodial(
        multiplier,
        start2,
        end2,
        clinicId,
        tirLookup[key][1].slice(0, 2),
        cgmUse,
        tirLookup[key][1][3],
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
    tirLookup[key][0].slice(0, 2),
    tirLookup[key][0][2],
    tirLookup[key][0][3],
    creds
  );
  await uploadToCustodial.uploadToDSA(
    start2,
    end2,
    tirLookup[key][1].slice(0, 2),
    tirLookup[key][1][2],
    tirLookup[key][1][3],
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
      await uploadToCustodial.uploadSMBGToCustodial(
        start1,
        end1,
        clinicId,
        smbgLookup[key][0][0],
        smbgLookup[key][0][1],
        patientIds[patientCounter],
        creds
      );
      await uploadToCustodial.uploadSMBGToCustodial(
        start2,
        end2,
        clinicId,
        smbgLookup[key][1][0],
        smbgLookup[key][1][1],
        patientIds[patientCounter],
        creds
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
    tirLookup2["Low"][0].slice(0, 2),
    tirLookup2["Low"][0][2],
    tirLookup2["Low"][0][3],
    patientIds[patientCounter],
    creds
  );
  await uploadToCustodial.uploadToDeviceIdCustodial(
    1,
    start2,
    end2,
    clinicId,
    tirLookup2["Low"][1].slice(0, 2),
    tirLookup2["Low"][0][2],
    tirLookup2["Low"][1][3],
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
    tirLookup2["High"][0].slice(0, 2),
    tirLookup2["High"][0][2],
    tirLookup2["High"][0][3],
    patientIds[patientCounter],
    creds
  );
  await uploadToCustodial.uploadToDeviceIdCustodial(
    2,
    start2_,
    end2_,
    clinicId,
    tirLookup2["High"][1].slice(0, 2),
    tirLookup2["High"][0][2],
    tirLookup2["High"][1][3],
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
