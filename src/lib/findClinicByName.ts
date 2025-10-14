import { Credentials } from './credentials.js';
import { fetchClinicsWithTags, ClinicPatientTag } from './fetchTags.js';

/**
 * Finds and returns the clinic ID that matches the specified clinic name.
 * @param creds - User credentials
 * @param clinicName - The clinic name to search for
 * @returns The clinic ID if found, null if not found or an error occurs
 */
export async function findClinicByName(
  creds: Credentials,
  clinicName: string
): Promise<string | null> {
  try {
    // Fetch all clinics with their tags
    const clinicsWithTags: ClinicPatientTag[] | null = await fetchClinicsWithTags(creds);
    
    if (!clinicsWithTags || clinicsWithTags.length === 0) {
      console.error('No clinics found for the current user.');
      return null;
    }

    // Find the clinic with the matching name
    const matchingClinic = clinicsWithTags.find(
      (clinicWithTags) => clinicWithTags.clinic.name === clinicName
    );

    if (!matchingClinic) {
      console.error(`Clinic with name "${clinicName}" not found.`);
      return null;
    }

    return matchingClinic.clinic.id;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in findClinicByName:', error.message);
    } else {
      console.error('Unknown error in findClinicByName:', error);
    }
    return null;
  }
}

/**
 * Finds and returns the clinic ID that matches the specified clinic name (case-insensitive).
 * @param creds - User credentials
 * @param clinicName - The clinic name to search for (case-insensitive)
 * @returns The clinic ID if found, null if not found or an error occurs
 */
export async function findClinicByNameCaseInsensitive(
  creds: Credentials,
  clinicName: string
): Promise<string | null> {
  try {
    // Fetch all clinics with their tags
    const clinicsWithTags: ClinicPatientTag[] | null = await fetchClinicsWithTags(creds);
    
    if (!clinicsWithTags || clinicsWithTags.length === 0) {
      console.error('No clinics found for the current user.');
      return null;
    }

    // Find the clinic with the matching name (case-insensitive)
    const matchingClinic = clinicsWithTags.find(
      (clinicWithTags) => clinicWithTags.clinic.name.toLowerCase() === clinicName.toLowerCase()
    );

    if (!matchingClinic) {
      console.error(`Clinic with name "${clinicName}" not found.`);
      return null;
    }

    return matchingClinic.clinic.id;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in findClinicByNameCaseInsensitive:', error.message);
    } else {
      console.error('Unknown error in findClinicByNameCaseInsensitive:', error);
    }
    return null;
  }
}

/**
 * Finds and returns all clinics that contain the specified text in their name (partial match).
 * @param creds - User credentials
 * @param searchText - The text to search for within clinic names
 * @returns Array of objects containing clinic ID and name if found, empty array if none found
 */
export async function findClinicsByNamePartial(
  creds: Credentials,
  searchText: string
): Promise<{ id: string; name: string }[]> {
  try {
    // Fetch all clinics with their tags
    const clinicsWithTags: ClinicPatientTag[] | null = await fetchClinicsWithTags(creds);
    
    if (!clinicsWithTags || clinicsWithTags.length === 0) {
      console.error('No clinics found for the current user.');
      return [];
    }

    // Find all clinics that contain the search text (case-insensitive)
    const matchingClinics = clinicsWithTags.filter(
      (clinicWithTags) => clinicWithTags.clinic.name.toLowerCase().includes(searchText.toLowerCase())
    );

    if (matchingClinics.length === 0) {
      console.error(`No clinics found containing "${searchText}" in their name.`);
      return [];
    }

    return matchingClinics.map(clinic => ({
      id: clinic.clinic.id,
      name: clinic.clinic.name
    }));
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in findClinicsByNamePartial:', error.message);
    } else {
      console.error('Unknown error in findClinicsByNamePartial:', error);
    }
    return [];
  }
}