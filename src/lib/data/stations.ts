import { RadioStation } from "@/lib/types/radio";

const basePath = process.env.NODE_ENV === "production" ? "/kollox-fm" : "";

export const stations: RadioStation[] = [
	{
		id: "1",
		name: "Bay FM",
		fmFrequency: "89.7",
		streamUrl: "https://stream.v3.network/proxy/897bay/stream.mp3",
		image: `${basePath}/images/bay.png`,
		website: "https://bay.com.mt",
		location: "St. Julian's",
		genres: ["Hits", "Pop", "Top 40"],
		popularity: 1,
		metadata: {
			// prettier-ignore
			currentSongUrl: "https://stream.v3.network/proxy/897bay/currentsong",
			currentSongMethod: "shoutcast",
		},
	},
	{
		id: "2",
		name: "Bay Easy FM",
		fmFrequency: "100.2",
		streamUrl: "https://stream.v3.network/proxy/easy/stream.mp3",
		image: `${basePath}/images/bay_easy.png`,
		website: "https://bayeasy.mt",
		location: "St. Julian's",
		genres: ["Chill", "Relax", "00s", "10s"],
		popularity: 4,
		metadata: {
			currentSongUrl: "https://stream.v3.network/proxy/easy/currentsong",
			currentSongMethod: "shoutcast",
		},
	},
	{
		id: "3",
		name: "Bay Retro",
		streamUrl: "https://stream.v3.network/proxy/retro/stream.mp3",
		image: `${basePath}/images/bay_retro.png`,
		website: "https://bay.com.mt",
		location: "St. Julian's",
		genres: ["Classic Hits", "Oldies", "80s", "90s"],
		popularity: 5,
		metadata: {
			currentSongUrl: "https://stream.v3.network/proxy/retro/currentsong",
			currentSongMethod: "shoutcast",
		},
	},
	{
		id: "4",
		name: "Bay Pride",
		streamUrl: "https://stream.v3.network/proxy/baypride/stream.mp3",
		image: `${basePath}/images/bay_pride.png`,
		website: "https://bay.com.mt",
		location: "St. Julian's",
		genres: ["Pop", "Dance", "Throwbacks", "LGBTQ+", "Pride"],
		popularity: 6,
		metadata: {
			// prettier-ignore
			currentSongUrl: "https://stream.v3.network/proxy/baypride/currentsong",
			currentSongMethod: "shoutcast",
		},
	},
	{
		id: "5",
		name: "Vibe FM",
		fmFrequency: "88.7",
		streamUrl: "https://s9.voscast.com:7825/1",
		image: `${basePath}/images/vibe.png`,
		website: "https://vibe.mt",
		location: "Santa Venera",
		genres: ["Hits", "Pop", "Top 40", "EDM"],
		popularity: 2,
	},
	{
		id: "6",
		name: "Magic Malta FM",
		fmFrequency: "91.7",
		streamUrl: "https://s46.myradiostream.com:6076/listen.mp3",
		image: `${basePath}/images/magic_malta.png`,
		website: "https://magic.mt",
		location: "Pieta",
		genres: ["Hits", "Top 40", "Throwbacks"],
		popularity: 3,
		metadata: {
			currentSongUrl: "https://s46.myradiostream.com:6076/currentsong",
			currentSongMethod: "shoutcast",
		},
	},
];
