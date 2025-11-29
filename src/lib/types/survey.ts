/**
 * Types for Broadcasting Authority audience survey data used by /survey-results.
 */
/** ISO-8601 date string (ex. "2024-07-21") */
export type ISODateString = string;
/** Percentage in the range 0-100 (ex. 66.5 for 66.5%) */
export type Percent = number;
/** Station identifier (prefer slug form like "bay-fm") */
export type StationId = string;
/** Labeled 30-min timeband range (ex. "07:00-07:30") */
export type TimebandLabel = string;
/** Count of listeners, non-negative integer */
export type ListenerCount = number;
// Placeholder for future program-level summaries.
export type ProgramSummary = unknown;

/**
 * Basic survey metadata shown in headers and used for routing.
 *
 * @property id - Canonical id used in routes - the year, ex. "2024".
 * @property title - Human-readable title, ex. "Audience Survey - July 2024".
 * @property periodStart - Start of the assessment period (ISO).
 * @property periodEnd - End of the assessment period (ISO).
 * @property weekOfAssessment - Date range of survey taken, ex. "21-27 July 2024".
 * @property publishedAt - Publication date.
 * @property sampleSize - Total respondents (N).
 * @property sampleRadioListeners - Respondents who are radio listeners (n).
 * @property notes - Free-text notes about the survey edition.
 * @property rawSourcePath - Survey URL to source PDF.
 */
export interface SurveyMeta {
	id: string;
	title: string;
	periodStart?: ISODateString;
	periodEnd?: ISODateString;
	weekOfAssessment?: string;
	publishedAt: ISODateString;
	sampleSize: number;
	sampleRadioListeners: number;
	notes?: string[];
	rawSourcePath: string | null;
}

/**
 * Overall, high-level KPIs for the edition.
 *
 * @property populationListening - Radio-listening population 12+.
 * @property totalRadioListeners - Total radio listeners.
 */
export interface SurveyMetrics {
	populationListening: number | null;
	totalRadioListeners?: ListenerCount | null;
}

/**
 * Per-station summary row used in tables and cards.
 *
 * @property id - Canonical id/slug, ex. "one-radio".
 * @property label - Display label, ex. "ONE Radio".
 * @property fmFrequency - FM frequency.
 * @property location - Station location, ex. "Rabat".
 * @property mostFollowedPct - % of respondents who marked station as "most followed".
 * @property weeklySharePct - Weekly average audience share across timeband.
 * @property stationListeners - Listeners count - 3 stations listened to previous day.
 * @property dailyListeners - Mapping of ISO date strings to daily listener counts.
 */
export interface StationSummary {
	id: StationId;
	label: string;
	fmFrequency?: string | null;
	location?: string;
	mostFollowedPct?: Percent | null;
	weeklySharePct?: Percent | null;
	stationListeners?: ListenerCount | null;
	dailyListeners?: Record<ISODateString, ListenerCount>;
}

/**
 * Aggregate across stations for a given timeband.
 *
 * @property timeband - Time window label, ex. "07:00-07:30".
 * @property listeners - Combined listeners estimate for that slot.
 * @property topStationId - Top station in that slot.
 */
export interface TimebandSummary {
	timeband: TimebandLabel;
	listeners?: ListenerCount | null;
	topStationId?: StationId | null;
}

/**
 * Highlighted takeaways for quick display cards.
 */
export interface SurveyHighlights {
	/** Most followed station in this survey. */
	mostFollowedStation?: {
		/** Station id. Align with the `name` property of `RadioStation`. */
		id: string;
		/** % marked as most followed. */
		mostFollowedPct?: Percent | null;
		/** Weekly audience share %. */
		weeklySharePct?: Percent | null;
	} | null;

	/** Peak combined audience timeband. */
	peakTimeband?: {
		/** Timeband label. */
		timeband: TimebandLabel;
		/** Combined listeners in peak band. */
		listeners?: ListenerCount | null;
	} | null;
}

/**
 * Represents how respondents access radio content.
 *
 * @property id - Canonical id/slug, ex. "radio-set".
 * @property label - Human-friendly display name.
 * @property shortLabel - Shortened label for concise display (e.g., tooltips).
 * @property respondents - Number of survey respondents using this type.
 * @property percentage - Percentage of total respondents using this type.
 */
export interface ReceptionType {
	id: string;
	label: string;
	shortLabel: string;
	respondents: number;
	percentage: number;
}

/**
 * Root object for a survey edition.
 *
 * @property meta - Basic metadata and routing info.
 * @property metrics - High-level KPIs.
 * @property highlights - Quick highlights to surface in the UI.
 * @property stations - Top-level station summaries.
 * @property timebands - Overall timeband summaries.
 * @property programs - Program-level summaries.
 * @property receptionTypes - How respondents access radio content.
 */
export interface Survey {
	meta: SurveyMeta;
	metrics?: SurveyMetrics;
	highlights?: SurveyHighlights;
	stations?: StationSummary[];
	timebands?: TimebandSummary[];
	programs?: ProgramSummary[] | null;
	receptionTypes?: ReceptionType[];
}
