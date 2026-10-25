import { survey2015 } from "@/lib/data/surveys/2015";
import { survey2016 } from "@/lib/data/surveys/2016";
import { survey2017 } from "@/lib/data/surveys/2017";
import { survey2018 } from "@/lib/data/surveys/2018";
import { survey2019 } from "@/lib/data/surveys/2019";
import { survey2020 } from "@/lib/data/surveys/2020";
import { survey2021 } from "@/lib/data/surveys/2021";
import { survey2022 } from "@/lib/data/surveys/2022";
import { survey2023 } from "@/lib/data/surveys/2023";
import { survey2024 } from "@/lib/data/surveys/2024";
import { survey2025 } from "@/lib/data/surveys/2025";
import {
	StationId,
	StationSummary,
	StationSurveyHistoryEntry,
	Survey,
} from "@/lib/types/survey";

const SURVEYS: Record<string, Survey> = {
	[survey2015.meta.id]: survey2015 as Survey,
	[survey2016.meta.id]: survey2016 as Survey,
	[survey2017.meta.id]: survey2017 as Survey,
	[survey2018.meta.id]: survey2018 as Survey,
	[survey2019.meta.id]: survey2019 as Survey,
	[survey2020.meta.id]: survey2020 as Survey,
	[survey2021.meta.id]: survey2021 as Survey,
	[survey2022.meta.id]: survey2022 as Survey,
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

/**
 * Station rows in ranking order, as the survey results table shows them:
 * the "No radio" respondent row is dropped and rank is the row's position.
 * @param {Survey} survey - The survey edition.
 * @returns {StationSummary[]} Ranked station rows, best first.
 */
export function getRankedStations(survey: Survey): StationSummary[] {
	return (
		survey.stations?.filter((station) => station.id !== "no-radio") ?? []
	);
}

/**
 * Finds a station's 1-based rank in a survey edition.
 * @param {Survey} survey - The survey edition.
 * @param {string} stationId - The station's id (ex. "bay-fm").
 * @returns {number | null} The rank, or null when the station was not ranked.
 */
export function getStationSurveyRank(
	survey: Survey,
	stationId: string
): number | null {
	const index = getRankedStations(survey).findIndex(
		(station) => station.id === stationId
	);
	return index === -1 ? null : index + 1;
}

/**
 * A station's most-followed share and rank in each survey edition since it was
 * first ranked, oldest first. Later editions where it was not ranked carry nulls
 * so charts keep a gap.
 * @param {string} stationId - The station's id (ex. "bay-fm").
 * @returns {StationSurveyHistoryEntry[]} One entry per edition, empty if never ranked.
 */
export function getStationSurveyHistory(
	stationId: string
): StationSurveyHistoryEntry[] {
	const history = getAllSurveys()
		.map((survey) => {
			const row = survey.stations?.find(
				(station) => station.id === stationId
			);
			return {
				year: survey.meta.id,
				mostFollowedPct: row?.mostFollowedPct ?? null,
				rank: getStationSurveyRank(survey, stationId),
			};
		})
		.reverse();
	const firstRanked = history.findIndex((entry) => entry.rank != null);
	return firstRanked === -1 ? [] : history.slice(firstRanked);
}

/**
 * A station's display label in one survey edition, as its station table prints it.
 * @param {Survey} survey - The survey edition.
 * @param {StationId | null} stationId - The station's id, ex. a programme's `stationId`.
 * @returns {string | null} The label, or null when the id is null or not in the edition.
 */
export function getSurveyStationLabel(
	survey: Survey,
	stationId: StationId | null
): string | null {
	if (stationId == null) return null;
	return (
		survey.stations?.find((station) => station.id === stationId)?.label ??
		null
	);
}
