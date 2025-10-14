import { Credentials } from "./credentials.js";
import { fetchClinicsWithTags, ClinicPatientTag } from "./fetchTags.js";

/**
 * Finds and returns the first tag ID from a clinic that matches the specified tag name.
 * @param creds - User credentials
 * @param clinicId - The clinic ID to search within
 * @param tagName - The tag name to search for
 * @returns The tag ID if found, null if not found or an error occurs
 */
export async function findTagByName(creds: Credentials, clinicId: string, tagName: string): Promise<string | null> {
  try {
    // Fetch all clinics with their tags
    const clinicsWithTags: ClinicPatientTag[] | null = await fetchClinicsWithTags(creds);

    if (!clinicsWithTags || clinicsWithTags.length === 0) {
      console.error("No clinics or tags found for the current user.");
      return null;
    }

    // Find the specific clinic
    const targetClinic = clinicsWithTags.find((clinicWithTags) => clinicWithTags.clinic.id === clinicId);

    if (!targetClinic) {
      console.error(`Clinic with ID ${clinicId} not found.`);
      return null;
    }

    // Check if the clinic has patient tags
    if (!targetClinic.clinic.patientTags || targetClinic.clinic.patientTags.length === 0) {
      console.error(`Clinic ${clinicId} has no tags.`);
      return null;
    }

    // Find the tag with the matching name
    const matchingTag = targetClinic.clinic.patientTags.find((tag) => tag.name === tagName);

    if (!matchingTag) {
      console.error(`Tag with name "${tagName}" not found in clinic ${clinicId}.`);
      return null;
    }

    return matchingTag.id;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in findTagByName:", error.message);
    } else {
      console.error("Unknown error in findTagByName:", error);
    }
    return null;
  }
}

/**
 * Finds and returns the first tag ID from any clinic that matches the specified tag name.
 * @param creds - User credentials
 * @param tagName - The tag name to search for
 * @returns Object containing the tag ID and clinic ID if found, null if not found or an error occurs
 */
export async function findTagByNameAcrossAllClinics(
  creds: Credentials,
  tagName: string
): Promise<{ tagId: string; clinicId: string } | null> {
  try {
    // Fetch all clinics with their tags
    const clinicsWithTags: ClinicPatientTag[] | null = await fetchClinicsWithTags(creds);

    if (!clinicsWithTags || clinicsWithTags.length === 0) {
      console.error("No clinics or tags found for the current user.");
      return null;
    }

    // Search through all clinics for the matching tag
    for (const clinicWithTags of clinicsWithTags) {
      if (clinicWithTags.clinic.patientTags && clinicWithTags.clinic.patientTags.length > 0) {
        const matchingTag = clinicWithTags.clinic.patientTags.find((tag) => tag.name === tagName);

        if (matchingTag) {
          return {
            tagId: matchingTag.id,
            clinicId: clinicWithTags.clinic.id,
          };
        }
      }
    }

    console.error(`Tag with name "${tagName}" not found in any clinic.`);
    return null;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in findTagByNameAcrossAllClinics:", error.message);
    } else {
      console.error("Unknown error in findTagByNameAcrossAllClinics:", error);
    }
    return null;
  }
}
