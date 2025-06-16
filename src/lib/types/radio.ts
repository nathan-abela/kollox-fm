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
}
