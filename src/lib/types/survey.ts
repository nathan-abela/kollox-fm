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
 * @property pctPopulationListening - % of the 12+ population listening to radio.
 * @property avgDailyListeners - Daily average listeners.
 * @property totalRadioListeners - Total radio listeners.
 */
export interface SurveyMetrics {
	populationListening: number;
	pctPopulationListening?: Percent;
	avgDailyListeners?: ListenerCount | null;
	totalRadioListeners?: ListenerCount | null;
}

/**
 * Per-station summary row used in tables and cards.
 *
 * @property id - Canonical id/slug, ex. "one-radio".
 * @property label - Display label, ex. "ONE Radio".
 * @property fmFrequency - FM frequency.
 * @property mostFollowedPct - % of respondents who marked station as "most followed".
 * @property weeklySharePct - Weekly average audience share across timeband.
 * @property extrapolatedListeners - Extrapolated listener count.
 */
export interface StationSummary {
	id: StationId;
	label: string;
	fmFrequency?: string | null;
	mostFollowedPct?: Percent | null;
	weeklySharePct?: Percent | null;
	extrapolatedListeners?: ListenerCount | null;
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
		/** Station id or label; prefer slug if available. */
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
 * Root object for a survey edition.
 *
 * @property meta - Basic metadata and routing info.
 * @property metrics - High-level KPIs.
 * @property highlights - Quick highlights to surface in the UI.
 * @property stations - Top-level station summaries.
 * @property timebands - Overall timeband summaries.
 * @property programs - Optional program-level summaries.
 */
export interface Survey {
	meta: SurveyMeta;
	metrics?: SurveyMetrics;
	highlights?: SurveyHighlights;
	stations?: StationSummary[];
	timebands?: TimebandSummary[];
	programs?: ProgramSummary[] | null;
}
