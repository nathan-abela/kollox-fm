import { Survey } from "@/lib/types/survey";

// TODO: Add survey results
const SURVEYS: Record<string, Survey> = {};

/**
 * Retrieves a survey by its unique ID.
 * @param {string} id - The survey's unique identifier.
 * @returns {Survey | undefined} The survey if found, otherwise undefined.
 */
export function getSurveyById(id: string): Survey | undefined {
	return SURVEYS[id];
}

/**
 * Returns all available surveys, sorted by id in descending order (latest first).
 * @returns {Survey[]} Array of surveys, latest first.
 */
export function getAllSurveys(): Survey[] {
	return Object.values(SURVEYS).sort(
		(a, b) => Number(b.meta.id) - Number(a.meta.id)
	);
}

/**
 * Retrieves the latest survey from the list of available surveys.
 *
 * @returns {Survey | undefined} The most recent survey object, otherwise undefined.
 */
export function getLatestSurvey(): Survey | undefined {
	return getAllSurveys()[0];
}
