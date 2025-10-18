import { RadioStation } from "@/lib/types/radio";

const isProd = process.env.NODE_ENV === "production";
const useGitHubPages = false;
const repoName = "kollox-fm";

export const basePath = isProd && useGitHubPages ? `/${repoName}` : "";

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
			isEnabled: false,
			currentSongUrl: "https://stream.v3.network/proxy/897bay/currentsong", // prettier-ignore
			currentSongMethod: "shoutcast",
		},
	},
	{
		id: "2",
		name: "Bay Easy",
		fmFrequency: "100.2",
		streamUrl: "https://stream.v3.network/proxy/easy/stream.mp3",
		image: `${basePath}/images/bay_easy.png`,
		website: "https://bayeasy.mt",
		location: "St. Julian's",
		genres: ["Chill", "Relax", "00s", "10s"],
		popularity: 4,
		metadata: {
			isEnabled: false,
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
		popularity: 8,
		metadata: {
			isEnabled: false,
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
		genres: ["Pop", "Dance", "Throwbacks", "Pride", "LGBTQ+"],
		popularity: 6,
		metadata: {
			isEnabled: false,
			currentSongUrl: "https://stream.v3.network/proxy/baypride/currentsong", // prettier-ignore
			currentSongMethod: "shoutcast",
		},
	},
	{
		id: "5",
		name: "Vibe FM",
		fmFrequency: "88.7",
		streamUrl: "https://vibefm.radioca.st/vibe_live",
		image: `${basePath}/images/vibe.png`,
		website: "https://vibe.mt",
		location: "Santa Venera",
		genres: ["Hits", "Pop", "Top 40", "EDM"],
		popularity: 2,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://vibefm.radioca.st/status-json.xsl",
			currentSongMethod: "icecast",
		},
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
			isEnabled: true,
			currentSongUrl: "https://s46.myradiostream.com:6076/currentsong",
			currentSongMethod: "shoutcast",
		},
	},
	{
		id: "7",
		name: "Pure Radio",
		streamUrl: "https://sp1.19cloudsnetwork.gr/8010/stream",
		image: `${basePath}/images/pure_radio.png`,
		website: "https://pureradio.mt",
		location: "Balzan",
		genres: ["EDM", "House", "Techno"],
		popularity: 9,
	},
	{
		id: "8",
		name: "Smash FM",
		fmFrequency: "104.6",
		streamUrl: "https://radio.smashmalta.com/stream",
		image: `${basePath}/images/smash_radio.png`,
		website: "https://smashmalta.com",
		location: "Paola",
		genres: ["Classic Hits", "House", "Rock"],
		popularity: 5,
		metadata: {
			isEnabled: false, // No song metadata provided by station.
			currentSongUrl: "https://radio.smashmalta.com/status-json.xsl",
			currentSongMethod: "icecast",
		},
	},
	{
		id: "9",
		name: "Calypso Radio",
		fmFrequency: "101.8",
		streamUrl: "https://s4.radio.co/sf3aa4c25a/listen",
		image: `${basePath}/images/calypso.png`,
		website: "https://calypsomalta.com",
		location: "Luqa",
		genres: ["Classic Hits", "Oldies", "Throwbacks"],
		popularity: 12,
		metadata: {
			isEnabled: false, // No song metadata provided by station.
			currentSongUrl: "https://public.radio.co/api/v2/sf3aa4c25a/track/current", // prettier-ignore
			currentSongMethod: "radioco",
		},
	},
	{
		id: "10",
		name: "RTK 103",
		fmFrequency: "103",
		streamUrl: "https://s2.radio.co/s955b1ced9/listen",
		image: `${basePath}/images/rtk_radio.png`,
		website: "https://103.mt",
		location: "Hamrun",
		genres: ["Religion", "Spiritual", "Talk", "Cultural", "News"],
		popularity: 13,
		metadata: {
			isEnabled: false, // No song metadata provided by station.
			currentSongUrl: "https://public.radio.co/api/v2/s955b1ced9/track/current", // prettier-ignore
			currentSongMethod: "radioco",
		},
	},
	{
		id: "11",
		name: "ONE Radio",
		fmFrequency: "92.7",
		streamUrl: "https://s10.voscast.com:8203/stream",
		image: `${basePath}/images/one_radio.png`,
		website: "https://one.com.mt",
		location: "Marsa",
		genres: ["Politics", "Talk", "Classic Hits", "Pop", "Rock", "House"],
		popularity: 11,
		metadata: {
			isEnabled: false, // No song metadata provided by station.
			currentSongUrl: "https://s10.voscast.com:8203/status-json.xsl",
			currentSongMethod: "voscast",
		},
	},
	{
		id: "12",
		name: "NET FM",
		fmFrequency: "101.0",
		streamUrl: "https://s2.voscast.com:11393/default",
		image: `${basePath}/images/net.png`,
		website: "https://netfm.com.mt",
		location: "Pieta",
		genres: ["Politics", "Talk", "Religion", "Classic Hits", "Marching Band"], // prettier-ignore
		popularity: 14,
		metadata: {
			isEnabled: false, // No song metadata provided by station.
			currentSongUrl: "https://s2.voscast.com:11393/status-json.xsl",
			currentSongMethod: "voscast",
		},
	},
	{
		id: "13",
		name: "Campus FM",
		fmFrequency: "103.7",
		streamUrl: "https://campusfm.radioca.st/campusfm_live",
		image: `${basePath}/images/campus.png`,
		website: "https://campus1037.um.edu.mt",
		location: "Msida",
		genres: ["Classical", "Jazz", "Talk", "Cultural", "News"],
		popularity: 15,
		metadata: {
			isEnabled: false, // No song metadata provided by station.
			currentSongUrl: "https://campusfm.radioca.st/status-json.xsl",
			currentSongMethod: "icecast",
		},
	},
	{
		id: "14",
		name: "Smooth Radio",
		streamUrl: "https://s3.voscast.com:9259/default",
		image: `${basePath}/images/smooth_radio.png`,
		website: "https://smooth.com.mt",
		location: "Mosta",
		genres: ["Hits", "Chill", "Relax"],
		popularity: 7,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://s3.voscast.com:9259/status-json.xsl",
			currentSongMethod: "voscast",
		},
	},
	{
		id: "15",
		name: "Smooth Breeze",
		streamUrl: "https://s1.voscast.com:11085/default",
		image: `${basePath}/images/smooth_breeze.png`,
		website: "https://smooth.com.mt/breeze",
		location: "Mosta",
		genres: ["Hits", "Pop", "Chill"],
		popularity: 10,
		metadata: {
			isEnabled: false, // No song metadata provided by station.
			currentSongUrl: "https://s1.voscast.com:11085/status-json.xsl",
			currentSongMethod: "voscast",
		},
	},
];
