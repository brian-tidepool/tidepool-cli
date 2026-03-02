import { Credentials } from "./credentials.js";
import { fetchClinicsByCredentials, ClinicData } from "./fetchClinics.js";

/**
 * Finds and returns the shareCode of a clinic that matches the specified clinic name.
 * @param creds - User credentials
 * @param clinicName - The clinic name to search for
 * @returns The shareCode if found, null if not found or an error occurs
 */
export async function findShareCodeByClinicName(creds: Credentials, clinicName: string): Promise<string | null> {
  try {
    // Fetch all clinics
    const clinics: ClinicData[] | null = await fetchClinicsByCredentials(creds);

    if (!clinics || clinics.length === 0) {
      console.error("No clinics found for the current user.");
      return null;
    }

    // Find the clinic with the matching name
    const matchingClinic = clinics.find((clinic) => clinic.clinic.name === clinicName);

    if (!matchingClinic) {
      console.error(`Clinic with name "${clinicName}" not found.`);
      return null;
    }

    if (!matchingClinic.clinic.shareCode) {
      console.error(`Clinic "${clinicName}" found but has no shareCode.`);
      return null;
    }

    return matchingClinic.clinic.shareCode;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in findShareCodeByClinicName:", error.message);
    } else {
      console.error("Unknown error in findShareCodeByClinicName:", error);
    }
    return null;
  }
}

/**
 * Finds and returns the shareCode of a clinic that matches the specified clinic name (case-insensitive).
 * @param creds - User credentials
 * @param clinicName - The clinic name to search for (case-insensitive)
 * @returns The shareCode if found, null if not found or an error occurs
 */
export async function findShareCodeByClinicNameCaseInsensitive(creds: Credentials, clinicName: string): Promise<string | null> {
  try {
    // Fetch all clinics
    const clinics: ClinicData[] | null = await fetchClinicsByCredentials(creds);

    if (!clinics || clinics.length === 0) {
      console.error("No clinics found for the current user.");
      return null;
    }

    // Find the clinic with the matching name (case-insensitive)
    const matchingClinic = clinics.find(
      (clinic) => clinic.clinic.name.toLowerCase() === clinicName.toLowerCase()
    );

    if (!matchingClinic) {
      console.error(`Clinic with name "${clinicName}" not found.`);
      return null;
    }

    if (!matchingClinic.clinic.shareCode) {
      console.error(`Clinic "${clinicName}" found but has no shareCode.`);
      return null;
    }

    return matchingClinic.clinic.shareCode;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in findShareCodeByClinicNameCaseInsensitive:", error.message);
    } else {
      console.error("Unknown error in findShareCodeByClinicNameCaseInsensitive:", error);
    }
    return null;
  }
}
