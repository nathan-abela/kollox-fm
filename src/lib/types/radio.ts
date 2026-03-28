/**
 * Represents a radio station with its relevant details.
 *
 * @property id - Unique identifier for the radio station.
 * @property name - The display name of the radio station.
 * @property isEnabled - (Optional) Whether the station is enabled.
 * @property isFeatured - (Optional) Whether the station is featured/ special.
 * @property fmFrequency - (Optional) The FM frequency of the station.
 * @property streamUrl - The URL to the station stream.
 * @property image - URL to an image representing the radio station.
 * @property website - The official website of the radio station.
 * @property location - The location of the radio station.
 * @property genres - (Optional) List of genres associated with the station.
 * @property popularity - (Optional) A numeric value representing the station popularity (mainstream ranking).
 * @property surveyRank - (Optional) Ranking based on Broadcasting Authority survey data.
 * @property lufs - Measured loudness in LUFS (Loudness Units relative to Full Scale).
 *   				Used to calculate volume adjustment at runtime. Target is -16 LUFS.
 * @property metadata - (Optional) Metadata about the radio station.
 * @property socials - (Optional) Social media links for the station.
 */
export interface RadioStation {
	id: string;
	name: string;
	isEnabled?: boolean;
	isFeatured?: boolean;
	fmFrequency?: string;
	streamUrl: string;
	image: string;
	website: string;
	location: string;
	genres?: string[];
	popularity?: number;
	surveyRank?: number;
	lufs: number;
	metadata?: RadioStationMetadata;
	socials?: RadioStationSocials;
}

/**
 * Metadata information for a radio station.
 *
 * - isEnabled: A boolean indicating if metadata fetching is enabled.
 * - currentSongUrl: The URL to fetch the current song metadata.
 * - currentSongMethod: The method to use for fetching the current song.
 *   - "shoutcast": Fetches metadata using the Shoutcast protocol.
 *   - "icecast": Fetches metadata using the Icecast protocol.
 *   - "voscast": Fetches metadata using the Voscast protocol.
 *   - "radioco": Fetches metadata using the Radioco protocol.
 */
export interface RadioStationMetadata {
	isEnabled: boolean;
	currentSongUrl?: string;
	currentSongMethod?: "shoutcast" | "icecast" | "voscast" | "radioco";
}

/**
 * Social media links for a radio station.
 * - facebook: URL to the station's Facebook page.
 * - instagram: URL to the station's Instagram profile.
 * - tiktok: URL to the station's TikTok profile.
 * - youtube: URL to the station's YouTube channel.
 */
export interface RadioStationSocials {
	facebook?: string;
	instagram?: string;
	tiktok?: string;
	youtube?: string;
}
