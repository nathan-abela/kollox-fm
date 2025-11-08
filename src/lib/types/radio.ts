/**
 * Represents a radio station with its relevant details.
 *
 * @property id - Unique identifier for the radio station.
 * @property name - The display name of the radio station.
 * @property isEnabled - (Optional) Whether the station is enabled.
 * @property fmFrequency - (Optional) The FM frequency of the station.
 * @property streamUrl - The URL to the station stream.
 * @property image - URL to an image representing the radio station.
 * @property website - The official website of the radio station.
 * @property location - The location of the radio station.
 * @property genres - (Optional) List of genres associated with the station.
 * @property popularity - A numeric value representing the station popularity.
 * @property metadata - (Optional) Metadata about the radio station.
 */
export interface RadioStation {
	id: string;
	name: string;
	isEnabled?: boolean;
	fmFrequency?: string;
	streamUrl: string;
	image: string;
	website: string;
	location: string;
	genres?: string[];
	popularity: number;
	metadata?: RadioStationMetadata;
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
