export interface RadioStation {
	id: string;
	name: string;
	fmFrequency?: string;
	streamUrl: string;
	image: string;
	website: string;
	location: string;
	genres?: string[];
	popularity: number;
	metadata?: RadioStationMetadata;
}

export interface RadioStationMetadata {
	currentSongUrl?: string;
	currentSongMethod?: "shoutcast";
}
