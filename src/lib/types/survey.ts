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
	rawSourcePath: string;
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
 * @property avgHours - Average daily hours spent listening to this station per listener.
 * @property dailyListeners - Mapping of ISO date strings to daily listener counts.
 * @property ageDemographics - Breakdown of station reach by age bracket.
 * @property genderDemographics - Breakdown of station reach by gender.
 * @property districtDemographics - Breakdown of station reach by Malta district.
 */
export interface StationSummary {
	id: StationId;
	label: string;
	fmFrequency?: string | null;
	location?: string;
	mostFollowedPct?: Percent | null;
	weeklySharePct?: Percent | null;
	stationListeners?: ListenerCount | null;
	avgHours?: number | null;
	dailyListeners?: Record<ISODateString, ListenerCount>;
	ageDemographics?: AgeDemographics | null;
	genderDemographics?: GenderDemographics | null;
	districtDemographics?: DistrictDemographics | null;
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
 * @property shortLabel - Shortened label for concise display (ex. tooltips).
 * @property respondents - Number of survey respondents using this type.
 * @property percentage - Percentage of total respondents using this type.
 * @property ageDemographics - Breakdown by age brackets.
 * @property genderDemographics - Breakdown by gender.
 */
export interface ReceptionType {
	id: string;
	label: string;
	shortLabel: string;
	respondents: number;
	percentage: number;
	ageDemographics?: AgeDemographics;
	genderDemographics?: GenderDemographics;
}

/**
 * Demographic breakdown by age bracket.
 *
 * @property age12to20 - Age 12-20 count and percentage
 * @property age21to30 - Age 21-30 count and percentage
 * @property age31to40 - Age 31-40 count and percentage
 * @property age41to50 - Age 41-50 count and percentage
 * @property age51to60 - Age 51-60 count and percentage
 * @property age61to70 - Age 61-70 count and percentage
 * @property age71plus - Age 71+   count and percentage
 */
export interface AgeDemographics {
	age12to20: { count: number; percentage: Percent | null };
	age21to30: { count: number; percentage: Percent | null };
	age31to40: { count: number; percentage: Percent | null };
	age41to50: { count: number; percentage: Percent | null };
	age51to60: { count: number; percentage: Percent | null };
	age61to70: { count: number; percentage: Percent | null };
	age71plus: { count: number; percentage: Percent | null };
}

/**
 * Demographic breakdown by gender.
 *
 * @property male - Male count and percentage
 * @property female - Female count and percentage
 */
export interface GenderDemographics {
	male: { count: number; percentage: Percent | null };
	female: { count: number; percentage: Percent | null };
}

/**
 * Programme-level data including demographic breakdown.
 *
 * @property id - Unique programme identifier (slug).
 * @property name - Programme name.
 * @property station - Station name or identifier.
 * @property totalRespondents - Total number of respondents who prefer this programme.
 * @property percentage - Overall preference percentage.
 * @property ageDemographics - Breakdown by age brackets.
 * @property genderDemographics - Breakdown by gender.
 */
export interface ProgrammeSummary {
	id: string;
	name: string;
	station: string | null;
	totalRespondents: number;
	percentage: Percent;
	ageDemographics?: AgeDemographics;
	genderDemographics?: GenderDemographics;
}

/**
 * Demographic breakdown by Malta district.
 * Available in earlier surveys (ex. 2016) where district reach was reported per station.
 *
 * @property southHarbour  - South Harbour district
 * @property northHarbour  - North Harbour district
 * @property southEastern  - South Eastern district
 * @property western       - Western district
 * @property northern      - Northern district
 * @property gozoAndComino - Gozo & Comino
 */
export interface DistrictDemographics {
	southHarbour: { count: number; percentage: Percent | null };
	northHarbour: { count: number; percentage: Percent | null };
	southEastern: { count: number; percentage: Percent | null };
	western: { count: number; percentage: Percent | null };
	northern: { count: number; percentage: Percent | null };
	gozoAndComino: { count: number; percentage: Percent | null };
}

/**
 * DAB+ usage pattern among DAB+ owners.
 *
 * @property id - Canonical id/slug, ex. "dab-local".
 * @property label - Human-friendly display name.
 * @property shortLabel - Shortened label for concise display.
 * @property respondents - Estimated population using this pattern.
 * @property percentage - Percentage of DAB+ owners using this pattern.
 * @property ageDemographics - Breakdown by age brackets.
 * @property genderDemographics - Breakdown by gender.
 */
export interface DabUsageType {
	id: string;
	label: string;
	shortLabel: string;
	respondents: number;
	percentage: Percent;
	ageDemographics?: AgeDemographics;
	genderDemographics?: GenderDemographics;
}

/**
 * DAB+ radio ownership and usage data from older surveys (2017-2019).
 *
 * @property ownershipPct - Percentage of respondents who own a DAB+ radio.
 * @property totalOwners - Estimated population of DAB+ owners.
 * @property usage - Breakdown of how DAB+ owners use their radios (local/foreign/both).
 */
export interface DabOwnership {
	ownershipPct: Percent;
	totalOwners: number;
	usage: DabUsageType[];
}

/**
 * Root object for a survey edition.
 *
 * @property meta - Basic metadata and routing info.
 * @property metrics - High-level KPIs.
 * @property highlights - Quick highlights to surface in the UI.
 * @property stations - Top-level station summaries.
 * @property timebands - Overall timeband summaries.
 * @property programmes - Programme-level summaries.
 * @property receptionTypes - How respondents access radio content (newer surveys).
 * @property dabOwnership - DAB+ ownership and usage patterns (older surveys 2017-2019).
 */
export interface Survey {
	meta: SurveyMeta;
	metrics?: SurveyMetrics;
	highlights?: SurveyHighlights;
	stations?: StationSummary[];
	timebands?: TimebandSummary[];
	programmes?: ProgrammeSummary[] | null;
	receptionTypes?: ReceptionType[] | null;
	dabOwnership?: DabOwnership | null;
}
