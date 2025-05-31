export interface RadioStation {
	id: string;
	name: string;
	streamUrl: string;
	image: string;
	website: string;
	location: string;
	genres?: string[];
	popularity: number;
}
