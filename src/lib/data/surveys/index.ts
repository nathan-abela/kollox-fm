import { survey2023 } from "@/lib/data/surveys/2023";
import { survey2024 } from "@/lib/data/surveys/2024";
import { survey2025 } from "@/lib/data/surveys/2025";
import { Survey } from "@/lib/types/survey";

const SURVEYS: Record<string, Survey> = {
	[survey2023.meta.id]: survey2023 as Survey,
	[survey2024.meta.id]: survey2024 as Survey,
	[survey2025.meta.id]: survey2025 as Survey,
};

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
