import { basePath } from "@/lib/config";
import { RadioStation } from "@/lib/types/radio";

/**
 * Frequency to print beside the station name, ex. "92.7 FM". Null for online-only
 * stations and for names that already carry the frequency, ex. "89.7 Bay".
 */
export function displayFrequency(station: RadioStation): string | null {
	if (!station.fmFrequency || station.name.includes(station.fmFrequency)) {
		return null;
	}
	return `${station.fmFrequency} FM`;
}

export const stations: RadioStation[] = [
	{
		id: "bay-fm",
		name: "89.7 Bay",
		fmFrequency: "89.7",
		streamUrl: "https://stream.v3.network/proxy/897bay/stream.mp3",
		image: `${basePath}/images/stations/bay.jpg`,
		website: "https://bay.com.mt",
		location: "St. Julian's",
		genres: ["Hits", "Pop", "Top 40"],
		popularity: 1,
		surveyRank: 4,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://stream.v3.network/proxy/897bay/stats?sid=1&json=1", // prettier-ignore
			currentSongMethod: "shoutcast-jsonp",
		},
		socials: {
			facebook: "https://facebook.com/89.7Bay",
			instagram: "https://instagram.com/897bayofficial",
			tiktok: "https://tiktok.com/@897bay",
			youtube: "https://youtube.com/TheBayRadioNetwork",
		},
		lufs: -13.5,
	},
	{
		id: "bay-easy",
		name: "Bay Easy",
		fmFrequency: "100.2",
		streamUrl: "https://stream.v3.network/proxy/easy/stream.mp3",
		image: `${basePath}/images/stations/bay_easy.jpg`,
		website: "https://bayeasy.mt",
		location: "St. Julian's",
		genres: ["Classic Hits", "80s", "90s", "00s"],
		popularity: 4,
		surveyRank: 8,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://stream.v3.network/proxy/easy/stats?sid=1&json=1", // prettier-ignore
			currentSongMethod: "shoutcast-jsonp",
		},
		socials: {
			facebook: "https://facebook.com/BayEasy1002",
			instagram: "https://instagram.com/bayeasymalta",
			tiktok: "https://tiktok.com/@bayeasymalta",
		},
		lufs: -11.0,
	},
	{
		id: "bay-retro",
		name: "Bay Retro",
		streamUrl: "https://stream.v3.network/proxy/retro/stream.mp3",
		image: `${basePath}/images/stations/bay_retro.jpg`,
		website: "https://bay.com.mt",
		location: "St. Julian's",
		genres: ["Classic Hits", "Oldies", "80s", "90s"],
		popularity: 8,
		metadata: {
			isEnabled: false, // No song metadata provided by station.
			currentSongUrl: "https://stream.v3.network/proxy/retro/stats?sid=1&json=1", // prettier-ignore
			currentSongMethod: "shoutcast-jsonp",
		},
		socials: {
			facebook: "https://facebook.com/bayretro",
			instagram: "https://instagram.com/bayretromalta",
		},
		lufs: -29.5,
		boost: true,
	},
	{
		id: "bay-pride",
		name: "Bay Pride",
		isEnabled: false,
		streamUrl: "https://stream.v3.network/proxy/baypride/stream.mp3",
		image: `${basePath}/images/stations/bay_pride.jpg`,
		website: "https://bay.com.mt",
		location: "St. Julian's",
		genres: ["Pop", "Dance", "Throwbacks", "Pride", "LGBTQ+"],
		popularity: 6,
		metadata: {
			isEnabled: false,
			currentSongUrl: "https://stream.v3.network/proxy/baypride/stats?sid=1&json=1", // prettier-ignore
			currentSongMethod: "shoutcast-jsonp",
		},
		lufs: -16.0,
	},
	{
		id: "vibe-fm",
		name: "Vibe FM",
		fmFrequency: "88.7",
		streamUrl: "https://vibefm.radioca.st/vibe_live",
		image: `${basePath}/images/stations/vibe.jpg`,
		website: "https://vibe.mt",
		location: "Santa Venera",
		genres: ["Hits", "Pop", "Top 40", "EDM"],
		popularity: 2,
		surveyRank: 6,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://vibefm.radioca.st/status-json.xsl",
			currentSongMethod: "icecast",
		},
		socials: {
			facebook: "https://facebook.com/vibe887",
			instagram: "https://instagram.com/vibe887",
			tiktok: "https://tiktok.com/@vibefm887",
			youtube: "https://youtube.com/@vibemt887",
		},
		lufs: -9.0,
	},
	{
		id: "magic-malta",
		name: "Magic Malta",
		fmFrequency: "91.7",
		streamUrl: "https://s46.myradiostream.com:6076/listen.mp3",
		image: `${basePath}/images/stations/magic_malta.jpg`,
		website: "https://magic.mt",
		location: "Pieta",
		genres: ["Hits", "Top 40", "Throwbacks"],
		popularity: 3,
		surveyRank: 5,
		metadata: {
			isEnabled: true,
			currentSongUrl:
				"https://s46.myradiostream.com:6076/stats?sid=1&json=1",
			currentSongMethod: "shoutcast-jsonp",
		},
		socials: {
			facebook: "https://facebook.com/MagicMalta917",
			instagram: "https://instagram.com/magicmt917",
			tiktok: "https://tiktok.com/@magicmt917",
		},
		lufs: -9.0,
	},
	{
		id: "pure-radio",
		name: "Pure Radio",
		streamUrl: "https://sp1.19cloudsnetwork.gr/8010/stream",
		image: `${basePath}/images/stations/pure_radio.jpg`,
		website: "https://pureradio.mt",
		location: "Balzan",
		genres: ["EDM", "House", "Techno"],
		popularity: 9,
		socials: {
			facebook: "https://facebook.com/pureradiomalta",
			instagram: "https://instagram.com/pureradiomalta",
		},
		lufs: -10.5,
	},
	{
		id: "smash-radio",
		name: "Smash Radio",
		fmFrequency: "104.6",
		streamUrl: "https://headend.smashmalta.com/smashradio1046fm",
		image: `${basePath}/images/stations/smash_radio.jpg`,
		website: "https://smashmalta.com",
		location: "Paola",
		genres: ["Classic Hits", "House", "Rock"],
		popularity: 5,
		surveyRank: 10,
		metadata: {
			isEnabled: false, // No song metadata provided by station.
			currentSongUrl: "https://radio.smashmalta.com/status-json.xsl",
			currentSongMethod: "icecast",
		},
		socials: {
			facebook: "https://facebook.com/smashcommunications",
			youtube: "https://youtube.com/smashmalta",
		},
		lufs: -11.0,
	},
	{
		id: "calypso-radio",
		name: "Calypso Radio",
		fmFrequency: "101.8",
		streamUrl: "https://s4.radio.co/sf3aa4c25a/listen",
		image: `${basePath}/images/stations/calypso.jpg`,
		website: "https://calypsomalta.com",
		location: "Luqa",
		genres: ["Classic Hits", "Oldies", "Throwbacks"],
		popularity: 12,
		surveyRank: 2,
		metadata: {
			isEnabled: false, // No song metadata provided by station.
			currentSongUrl: "https://public.radio.co/api/v2/sf3aa4c25a/track/current", // prettier-ignore
			currentSongMethod: "radioco",
		},
		socials: {
			facebook: "https://facebook.com/CalypsoRadio101.8",
			instagram: "https://instagram.com/calypsoradio101.8",
			tiktok: "https://tiktok.com/@calypsoradio101.8",
			youtube: "https://youtube.com/@calypsoradio101.8",
		},
		lufs: -16.0,
	},
	{
		id: "rtk-103",
		name: "RTK 103",
		fmFrequency: "103",
		streamUrl: "https://s2.radio.co/s955b1ced9/listen",
		image: `${basePath}/images/stations/rtk_radio.jpg`,
		website: "https://103.mt",
		location: "Hamrun",
		genres: ["Religion", "Spiritual", "Talk", "Cultural", "News"],
		popularity: 13,
		surveyRank: 7,
		metadata: {
			isEnabled: false, // No song metadata provided by station.
			currentSongUrl: "https://public.radio.co/api/v2/s955b1ced9/track/current", // prettier-ignore
			currentSongMethod: "radioco",
		},
		socials: {
			facebook: "https://facebook.com/RTK103",
			instagram: "https://instagram.com/rtk.103",
		},
		lufs: -23.0,
	},
	{
		id: "one-radio",
		name: "ONE Radio",
		fmFrequency: "92.7",
		streamUrl: "https://s10.voscast.com:8203/stream",
		image: `${basePath}/images/stations/one_radio.jpg`,
		website: "https://one.com.mt",
		location: "Marsa",
		genres: ["Politics", "Talk", "Classic Hits", "Pop", "Rock", "House"],
		popularity: 11,
		surveyRank: 1,
		metadata: {
			isEnabled: false, // No song metadata provided by station.
			currentSongUrl: "https://s10.voscast.com:8203/status-json.xsl",
			currentSongMethod: "voscast",
		},
		socials: {
			facebook: "https://facebook.com/ONE.com.mt",
			instagram: "https://instagram.com/one.com.mt_",
			youtube: "https://youtube.com/@ONEMalta",
		},
		lufs: -20.0,
	},
	{
		id: "net-fm",
		name: "NET FM",
		fmFrequency: "101.0",
		streamUrl: "https://s2.voscast.com:11393/default",
		image: `${basePath}/images/stations/net.jpg`,
		website: "https://netfm.com.mt",
		location: "Pieta",
		genres: ["Politics", "Talk", "Religion", "Classic Hits", "Marching Band"], // prettier-ignore
		popularity: 14,
		surveyRank: 3,
		metadata: {
			isEnabled: false, // No song metadata provided by station.
			currentSongUrl: "https://s2.voscast.com:11393/status-json.xsl",
			currentSongMethod: "voscast",
		},
		socials: {
			facebook: "https://facebook.com/netmedia.com.mt",
			instagram: "https://instagram.com/netfmmalta",
			youtube: "https://youtube.com/@NETTelevision",
		},
		lufs: -11.5,
	},
	{
		id: "campus-fm",
		name: "Campus 103.7",
		fmFrequency: "103.7",
		streamUrl: "https://campusfm.radioca.st/campusfm_live",
		image: `${basePath}/images/stations/campus.jpg`,
		website: "https://campus1037.um.edu.mt",
		location: "Msida",
		genres: ["Classical", "Jazz", "Talk", "Cultural", "News"],
		popularity: 15,
		surveyRank: 9,
		metadata: {
			isEnabled: false, // No song metadata provided by station.
			currentSongUrl: "https://campusfm.radioca.st/status-json.xsl",
			currentSongMethod: "icecast",
		},
		socials: {
			facebook: "https://facebook.com/Campus1037",
			instagram: "https://instagram.com/campus1037",
			youtube: "https://youtube.com/@campusfm1178",
		},
		lufs: -15.5,
	},
	{
		id: "smooth-radio",
		name: "Smooth Radio",
		streamUrl: "https://s3.voscast.com:9259/default",
		image: `${basePath}/images/stations/smooth_radio.jpg`,
		website: "https://smooth.com.mt",
		location: "Mosta",
		genres: ["Hits", "Chill", "Relax"],
		popularity: 7,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://s3.voscast.com:9259/status-json.xsl",
			currentSongMethod: "voscast",
		},
		socials: {
			facebook: "https://facebook.com/LiteRadioMalta",
			instagram: "https://instagram.com/smoothradiomalta",
		},
		lufs: -8.0,
	},
	{
		id: "smooth-breeze",
		name: "Smooth Breeze",
		streamUrl: "https://s1.voscast.com:11085/default",
		image: `${basePath}/images/stations/smooth_breeze.jpg`,
		website: "https://smooth.com.mt/breeze",
		location: "Mosta",
		genres: ["Hits", "Pop", "Chill"],
		popularity: 10,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://s1.voscast.com:11085/status-json.xsl",
			currentSongMethod: "voscast",
		},
		socials: {
			facebook: "https://facebook.com/LiteRadioMalta",
			instagram: "https://instagram.com/smoothradiomalta",
		},
		lufs: -8.0,
	},
	{
		id: "maltin-biss",
		name: "Maltin Biss",
		streamUrl: "https://s4.voscast.com:8837/default",
		image: `${basePath}/images/stations/maltin_biss.jpg`,
		website: "https://maltinbiss.mt",
		location: "Mosta",
		genres: ["Maltese", "Local", "Folk"],
		popularity: 16,
		surveyRank: 11,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://s4.voscast.com:8837/status-json.xsl",
			currentSongMethod: "voscast",
		},
		socials: {
			facebook: "https://facebook.com/maltinbiss.mt",
		},
		lufs: -6.5,
	},
	{
		id: "bkr-radio",
		name: "BKR Radio",
		streamUrl: "https://s3.voscast.com:10893/stream",
		fmFrequency: "94.5",
		image: `${basePath}/images/stations/bkr_radio.jpg`,
		website: "https://bkr.mt",
		location: "Birkirkara",
		genres: ["Oldies", "Religion", "Cultural", "Pop"],
		popularity: 17,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://s3.voscast.com:10893/status-json.xsl",
			currentSongMethod: "voscast",
		},
		socials: {
			facebook: "https://facebook.com/bkr945",
		},
		lufs: -20.0,
	},
	{
		id: "radju-luminaria",
		name: "Radju Luminaria",
		fmFrequency: "106.9",
		streamUrl: "https://az.wannastream.com/radio/8000/radjuluminaria",
		image: `${basePath}/images/stations/radju_luminaria.jpg`,
		website: "https://www.nadurparish.com/media",
		location: "Nadur",
		genres: ["Classic Hits", "Religion", "Cultural"],
		popularity: 18,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://az.wannastream.com/radio/8000/status-json.xsl", // prettier-ignore
			currentSongMethod: "icecast",
		},
		lufs: -10.5,
	},
	{
		id: "mics-radio",
		name: "MICS Radio",
		isEnabled: false, // CORS
		streamUrl: "http://micsradio.ddns.net:90/;",
		image: `${basePath}/images/stations/mics_radio.jpg`,
		website: "http://micsradiomalta.com",
		location: "Rabat",
		genres: ["Classic Hits", "Hits", "Pop", "Chill"],
		popularity: 19,
		metadata: {
			isEnabled: false, // No song metadata provided by station.
			currentSongUrl: "http://micsradio.ddns.net:90/7.html",
			currentSongMethod: "shoutcast",
		},
		socials: {
			facebook: "https://www.facebook.com/micsradiomalta",
		},
		lufs: -16.0,
	},
	{
		id: "malta-sunshine-radio",
		name: "Malta Sunshine Radio",
		streamUrl: "https://stream.zeno.fm/14gzk46p7yzuv",
		image: `${basePath}/images/stations/malta_sunshine_radio.jpg`,
		website: "https://maltasunshineradio.wixsite.com/valletta",
		location: "Valletta",
		genres: ["Classic Hits", "Religion", "Maltese", "Italian"],
		popularity: 20,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://api.zeno.fm/mounts/metadata/subscribe/14gzk46p7yzuv", // prettier-ignore
			currentSongMethod: "zeno",
		},
		socials: {
			facebook: "https://facebook.com/people/Malta-Sunshine-Radio/100028486521113", // prettier-ignore
			instagram: "https://instagram.com/malta_sunshine_radio",
		},
		lufs: -11.5,
	},
	{
		id: "all-rock",
		name: "All Rock",
		streamUrl: "https://s6.voscast.com:11793/default",
		image: `${basePath}/images/stations/all_rock.jpg`,
		website: "https://allrock.mt",
		location: "Mosta",
		genres: ["Rock", "Classic Rock", "Metal", "Alternative"],
		popularity: 21,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://s6.voscast.com:11793/status-json.xsl",
			currentSongMethod: "voscast",
		},
		socials: {
			facebook: "https://facebook.com/allrockdab",
		},
		lufs: -5.5,
	},
	{
		id: "radio-groove-malta",
		name: "Radio Groove Malta",
		fmFrequency: "89.2",
		streamUrl: "https://listen.radioking.com/radio/792831/stream/861116",
		image: `${basePath}/images/stations/radio_groove_malta.jpg`,
		website: "https://www.facebook.com/p/Radio-GrooveMalta-61584764137642",
		location: "Luqa",
		genres: ["Pop", "Dance", "Oldies"],
		popularity: 22,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://api.radioking.io/widget/radio/radio-groovemalta/track/current", // prettier-ignore
			currentSongMethod: "radioking",
		},
		socials: {
			facebook: "https://www.facebook.com/p/Radio-GrooveMalta-61584764137642", // prettier-ignore
		},
		lufs: -9.5,
	},
	{
		id: "buzz-fm",
		name: "Buzz FM",
		streamUrl: "https://stream.zeno.fm/xwki3b2h2obvv",
		image: `${basePath}/images/stations/buzz_fm.jpg`,
		website: "https://buzz-fm-radio.yourwebsitespace.com",
		location: "Sliema",
		genres: ["Dance", "Trance", "Rock"],
		popularity: 23,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://api.zeno.fm/mounts/metadata/subscribe/xwki3b2h2obvv", // prettier-ignore
			currentSongMethod: "zeno",
		},
		socials: {
			facebook: "https://www.facebook.com/BUZZFMRADIO1",
			tiktok: "https://www.tiktok.com/@buzzwatches4you",
			youtube: "https://www.youtube.com/@BuzzBeatz69",
		},
		lufs: -9.0,
	},
	{
		id: "buzz-fm-trance",
		name: "Buzz FM Trance",
		streamUrl: "https://stream.zeno.fm/cw0dbcx67tbtv",
		image: `${basePath}/images/stations/buzz_fm_trance.jpg`,
		website: "https://buzz-fm-radio.yourwebsitespace.com",
		location: "Sliema",
		genres: ["Trance", "Electronic", "EDM"],
		popularity: 24,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://api.zeno.fm/mounts/metadata/subscribe/cw0dbcx67tbtv", // prettier-ignore
			currentSongMethod: "zeno",
		},
		socials: {
			facebook: "https://www.facebook.com/BUZZFMRADIO1",
			tiktok: "https://www.tiktok.com/@buzzwatches4you",
			youtube: "https://www.youtube.com/@BuzzBeatz69",
		},
		lufs: -11.0,
	},
	{
		id: "buzz-fm-rock",
		name: "Buzz FM Rock",
		streamUrl: "https://stream.zeno.fm/phcdaasfpaovv",
		image: `${basePath}/images/stations/buzz_fm_rock.jpg`,
		website: "https://buzz-fm-radio.yourwebsitespace.com",
		location: "Sliema",
		genres: ["Rock", "Classic Rock", "Alternative Rock"],
		popularity: 25,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://api.zeno.fm/mounts/metadata/subscribe/phcdaasfpaovv", // prettier-ignore
			currentSongMethod: "zeno",
		},
		socials: {
			facebook: "https://www.facebook.com/BUZZFMRADIO1",
			tiktok: "https://www.tiktok.com/@buzzwatches4you",
			youtube: "https://www.youtube.com/@BuzzBeatz69",
		},
		lufs: -15.0,
	},
	{
		id: "buzz-fm-divas",
		name: "Buzz FM Divas",
		streamUrl: "https://stream.zeno.fm/soo2ygvbeouvv",
		image: `${basePath}/images/stations/buzz_fm_divas.jpg`,
		website: "https://buzz-fm-radio.yourwebsitespace.com",
		location: "Sliema",
		genres: ["Pop", "Dance", "R&B"],
		popularity: 26,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://api.zeno.fm/mounts/metadata/subscribe/soo2ygvbeouvv", // prettier-ignore
			currentSongMethod: "zeno",
		},
		socials: {
			facebook: "https://www.facebook.com/BUZZFMRADIO1",
			tiktok: "https://www.tiktok.com/@buzzwatches4you",
			youtube: "https://www.youtube.com/@BuzzBeatz69",
		},
		lufs: -11.0,
	},
	{
		id: "buzz-fm-nonstop-80s",
		name: "Buzz FM Nonstop 80s",
		streamUrl: "https://stream.zeno.fm/elgpl9iqbhqtv",
		image: `${basePath}/images/stations/buzz_fm_nonstop_80s.jpg`,
		website: "https://buzz-fm-radio.yourwebsitespace.com",
		location: "Sliema",
		genres: ["Classic Hits", "Oldies", "80s"],
		popularity: 27,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://api.zeno.fm/mounts/metadata/subscribe/elgpl9iqbhqtv", // prettier-ignore
			currentSongMethod: "zeno",
		},
		socials: {
			facebook: "https://www.facebook.com/BUZZFMRADIO1",
			tiktok: "https://www.tiktok.com/@buzzwatches4you",
			youtube: "https://www.youtube.com/@BuzzBeatz69",
		},
		lufs: -11.0,
	},
	{
		id: "buzz-fm-country",
		name: "Buzz FM Country",
		streamUrl: "https://stream.zeno.fm/pwunai6sotrvv",
		image: `${basePath}/images/stations/buzz_fm_country.jpg`,
		website: "https://buzz-fm-radio.yourwebsitespace.com",
		location: "Sliema",
		genres: ["Country"],
		popularity: 28,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://api.zeno.fm/mounts/metadata/subscribe/pwunai6sotrvv", // prettier-ignore
			currentSongMethod: "zeno",
		},
		socials: {
			facebook: "https://www.facebook.com/BUZZFMRADIO1",
			tiktok: "https://www.tiktok.com/@buzzwatches4you",
			youtube: "https://www.youtube.com/@BuzzBeatz69",
		},
		lufs: -11.0,
	},
	{
		id: "radio-105",
		name: "Radio 105",
		fmFrequency: "105.0",
		streamUrl: "https://radio105-radio105network.radioca.st/stream",
		image: `${basePath}/images/stations/radio_105.jpg`,
		website: "https://radio105.mt",
		location: "Hamrun",
		genres: ["Hits", "Pop", "Top 40"],
		popularity: 29,
		metadata: {
			isEnabled: false, // No song metadata provided by station.
			currentSongUrl: "https://radio105-radio105network.radioca.st/currentsong", // prettier-ignore
			currentSongMethod: "shoutcast",
		},
		socials: {
			facebook: "https://facebook.com/radio105malta",
			instagram: "https://instagram.com/radiogalaxy105",
			youtube: "https://youtube.com/@radio105malta",
		},
		lufs: -8.0,
	},
	{
		id: "radio-105-retro",
		name: "Radio 105 Retro",
		streamUrl: "https://retro-radio105network.radioca.st/stream",
		image: `${basePath}/images/stations/radio_105_retro.jpg`,
		website: "https://radio105.mt",
		location: "Hamrun",
		genres: ["Classic Hits", "Oldies", "Throwbacks", "70s", "80s"],
		popularity: 30,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://retro-radio105network.radioca.st/currentsong", // prettier-ignore
			currentSongMethod: "shoutcast",
		},
		socials: {
			facebook: "https://facebook.com/radio105malta",
			instagram: "https://instagram.com/radiogalaxy105",
			youtube: "https://youtube.com/@radio105malta",
		},
		lufs: -12.0,
	},
	{
		id: "radio-105-sixties",
		name: "Radio 105 Sixties",
		streamUrl: "https://sixties-radio105network.radioca.st/stream",
		image: `${basePath}/images/stations/radio_105_sixties.jpg`,
		website: "https://radio105.mt",
		location: "Hamrun",
		genres: ["60s", "Oldies", "Classic Hits"],
		popularity: 31,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://sixties-radio105network.radioca.st/currentsong", // prettier-ignore
			currentSongMethod: "shoutcast",
		},
		socials: {
			facebook: "https://facebook.com/radio105malta",
			instagram: "https://instagram.com/radiogalaxy105",
			youtube: "https://youtube.com/@radio105malta",
		},
		lufs: -10.0,
	},
	{
		id: "radio-105-nineties",
		name: "Radio 105 Nineties",
		streamUrl: "https://nineties-radio105network.radioca.st/stream",
		image: `${basePath}/images/stations/radio_105_nineties.jpg`,
		website: "https://radio105.mt",
		location: "Hamrun",
		genres: ["90s", "Classic Hits", "Pop"],
		popularity: 32,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://nineties-radio105network.radioca.st/currentsong", // prettier-ignore
			currentSongMethod: "shoutcast",
		},
		socials: {
			facebook: "https://facebook.com/radio105malta",
			instagram: "https://instagram.com/radiogalaxy105",
			youtube: "https://youtube.com/@radio105malta",
		},
		lufs: -9.0,
	},
	{
		id: "radio-105-rock",
		name: "Radio 105 Rock",
		streamUrl: "https://rock-radio105network.radioca.st/stream",
		image: `${basePath}/images/stations/radio_105_rock.jpg`,
		website: "https://radio105.mt",
		location: "Hamrun",
		genres: ["Rock", "70s", "80s"],
		popularity: 33,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://rock-radio105network.radioca.st/currentsong", // prettier-ignore
			currentSongMethod: "shoutcast",
		},
		socials: {
			facebook: "https://facebook.com/radio105malta",
			instagram: "https://instagram.com/radiogalaxy105",
			youtube: "https://youtube.com/@radio105malta",
		},
		lufs: -10.5,
	},
	{
		id: "radio-105-urban",
		name: "Radio 105 Urban",
		streamUrl: "https://urban-radio105network.radioca.st/stream",
		image: `${basePath}/images/stations/radio_105_urban.jpg`,
		website: "https://radio105.mt",
		location: "Hamrun",
		genres: ["Urban", "Hip Hop", "R&B"],
		popularity: 34,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://urban-radio105network.radioca.st/currentsong", // prettier-ignore
			currentSongMethod: "shoutcast",
		},
		socials: {
			facebook: "https://facebook.com/radio105malta",
			instagram: "https://instagram.com/radiogalaxy105",
			youtube: "https://youtube.com/@radio105malta",
		},
		lufs: -8.5,
	},
	{
		id: "radio-105-cuore",
		name: "Radio 105 Cuore",
		streamUrl: "https://cuore-radio105network.radioca.st/stream",
		image: `${basePath}/images/stations/radio_105_cuore.jpg`,
		website: "https://radio105.mt",
		location: "Hamrun",
		genres: ["Italian", "Pop", "Romance"],
		popularity: 35,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://cuore-radio105network.radioca.st/currentsong", // prettier-ignore
			currentSongMethod: "shoutcast",
		},
		socials: {
			facebook: "https://facebook.com/radio105malta",
			instagram: "https://instagram.com/radiogalaxy105",
			youtube: "https://youtube.com/@radio105malta",
		},
		lufs: -10.5,
	},
	{
		id: "radio-105-mellow",
		name: "Radio 105 Mellow",
		streamUrl: "https://mellow-radio105network.radioca.st/stream",
		image: `${basePath}/images/stations/radio_105_mellow.jpg`,
		website: "https://radio105.mt",
		location: "Hamrun",
		genres: ["Chill", "Relax"],
		popularity: 36,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://mellow-radio105network.radioca.st/currentsong", // prettier-ignore
			currentSongMethod: "shoutcast",
		},
		socials: {
			facebook: "https://facebook.com/radio105malta",
			instagram: "https://instagram.com/radiogalaxy105",
			youtube: "https://youtube.com/@radio105malta",
		},
		lufs: -10.5,
	},
	{
		id: "radio-105-maltin",
		name: "Radio 105 Maltin",
		streamUrl: "https://maltin-radio105network.radioca.st/stream",
		image: `${basePath}/images/stations/radio_105_maltin.jpg`,
		website: "https://radio105.mt",
		location: "Hamrun",
		genres: ["Maltese", "Local", "Folk"],
		popularity: 37,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://maltin-radio105network.radioca.st/currentsong", // prettier-ignore
			currentSongMethod: "shoutcast",
		},
		socials: {
			facebook: "https://facebook.com/radio105malta",
			instagram: "https://instagram.com/radiogalaxy105",
			youtube: "https://youtube.com/@radio105malta",
		},
		lufs: -8.5,
	},
	{
		id: "radio-105-reggae",
		name: "Radio 105 Reggae",
		streamUrl: "https://reggae-radio105network.radioca.st/stream",
		image: `${basePath}/images/stations/radio_105_reggae.jpg`,
		website: "https://radio105.mt",
		location: "Hamrun",
		genres: ["Reggae", "Dancehall"],
		popularity: 38,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://reggae-radio105network.radioca.st/currentsong", // prettier-ignore
			currentSongMethod: "shoutcast",
		},
		socials: {
			facebook: "https://facebook.com/radio105malta",
			instagram: "https://instagram.com/radiogalaxy105",
			youtube: "https://youtube.com/@radio105malta",
		},
		lufs: -10.5,
	},
	{
		id: "radio-105-country",
		name: "Radio 105 Country",
		streamUrl: "https://country-radio105network.radioca.st/stream",
		image: `${basePath}/images/stations/radio_105_country.jpg`,
		website: "https://radio105.mt",
		location: "Hamrun",
		genres: ["Country", "Folk"],
		popularity: 39,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://country-radio105network.radioca.st/currentsong", // prettier-ignore
			currentSongMethod: "shoutcast",
		},
		socials: {
			facebook: "https://facebook.com/radio105malta",
			instagram: "https://instagram.com/radiogalaxy105",
			youtube: "https://youtube.com/@radio105malta",
		},
		lufs: -8.5,
	},
	{
		id: "radio-105-eurovision",
		name: "Radio 105 Eurovision",
		streamUrl: "https://eurovision-radio105network.radioca.st/stream",
		image: `${basePath}/images/stations/radio_105_eurovision.jpg`,
		website: "https://radio105.mt",
		location: "Hamrun",
		genres: ["Eurovision", "Pop"],
		popularity: 40,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://eurovision-radio105network.radioca.st/currentsong", // prettier-ignore
			currentSongMethod: "shoutcast",
		},
		socials: {
			facebook: "https://facebook.com/radio105malta",
			instagram: "https://instagram.com/radiogalaxy105",
			youtube: "https://youtube.com/@radio105malta",
		},
		lufs: -8.5,
	},
	{
		id: "radio-105-christmas",
		name: "Radio 105 Christmas",
		streamUrl: "https://xmas-radio105network.radioca.st/stream",
		image: `${basePath}/images/stations/radio_105_christmas.jpg`,
		website: "https://radio105.mt",
		location: "Hamrun",
		genres: ["Christmas", "Holiday", "Seasonal"],
		popularity: 41,
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://xmas-radio105network.radioca.st/currentsong", // prettier-ignore
			currentSongMethod: "shoutcast",
		},
		socials: {
			facebook: "https://facebook.com/radio105malta",
			instagram: "https://instagram.com/radiogalaxy105",
			youtube: "https://youtube.com/@radio105malta",
		},
		lufs: -10.0,
	},
	{
		id: "christmas-radio-malta",
		name: "Christmas Radio Malta",
		streamUrl: "http://philae.shoutca.st:8402/stream",
		image: `${basePath}/images/stations/christmas_radio_malta.jpg`,
		website: "https://www.christmasradiomalta.com",
		location: "Valletta",
		genres: ["Christmas", "Holiday", "Seasonal"],
		popularity: 42,
		metadata: {
			isEnabled: true,
			currentSongUrl: "http://philae.shoutca.st:8402/currentsong", // prettier-ignore
			currentSongMethod: "shoutcast",
		},
		socials: {
			facebook: "https://www.facebook.com/christmasradiomalta",
		},
		lufs: -10.5,
	},
	// Seasonal/ Special Stations
	{
		id: "bay-xmas",
		name: "Bay Xmas",
		isEnabled: false,
		isFeatured: true,
		streamUrl: "https://stream.v3.network/proxy/baypride/stream.mp3",
		image: `${basePath}/images/stations/bay_xmas.jpg`,
		website: "https://bay.com.mt/xmas",
		location: "St. Julian's",
		genres: ["Christmas", "Holiday", "Seasonal"],
		metadata: {
			isEnabled: false,
			currentSongUrl: "https://stream.v3.network/proxy/baypride/stats?sid=1&json=1", // prettier-ignore
			currentSongMethod: "shoutcast-jsonp",
		},
		lufs: -16.0,
	},
	{
		id: "magic-christmas",
		name: "Magic Christmas",
		isEnabled: false,
		isFeatured: true,
		streamUrl: "https://s40.myradiostream.com:24046/stream",
		image: `${basePath}/images/stations/magic_christmas.jpg`,
		website: "https://magic.mt/magic-christmas",
		location: "Pieta",
		genres: ["Christmas", "Holiday", "Seasonal"],
		metadata: {
			isEnabled: true,
			currentSongUrl: "https://s40.myradiostream.com:24046/stats?sid=1&json=1", // prettier-ignore
			currentSongMethod: "shoutcast-jsonp",
		},
		lufs: -16.0,
	},
];
