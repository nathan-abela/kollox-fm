import { RadioStation } from "@/lib/types/radio";

export const stations: RadioStation[] = [
	{
		id: "1",
		name: "Bay FM | 89.7",
		streamUrl: "https://stream.v3.network/proxy/897bay/stream.mp3",
		image: "/images/bay.png",
		website: "https://bay.com.mt",
		location: "Saint Julian's",
		genres: ["Hits", "Pop", "Top 40"],
	},
	{
		id: "2",
		name: "Bay Easy FM | 100.2",
		streamUrl: "https://stream.v3.network/proxy/easy/stream.mp3",
		image: "/images/bay_easy.png",
		website: "https://bayeasy.mt",
		location: "Saint Julian's",
		genres: ["Chill", "Relax", "00s"],
	},
	{
		id: "3",
		name: "Bay Retro FM",
		streamUrl: "https://stream.v3.network/proxy/retro/stream.mp3",
		image: "/images/bay_retro.png",
		website: "https://bay.com.mt",
		location: "Saint Julian's",
		genres: ["Classic Hits", "Oldies", "80s", "90s"],
	},
	{
		id: "4",
		name: "Bay Pride FM",
		streamUrl: "https://stream.v3.network/proxy/baypride/stream.mp3",
		image: "/images/bay_pride.png",
		website: "https://bay.com.mt",
		location: "Saint Julian's",
		genres: ["Pop", "Dance", "LGBTQ+", "Pride"],
	},
];
