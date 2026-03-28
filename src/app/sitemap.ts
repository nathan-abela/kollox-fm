import type { MetadataRoute } from "next";

import { stations } from "@/lib/data/stations";
import { getAllSurveys } from "@/lib/data/surveys";

export const dynamic = "force-static";

const BASE_URL = "https://kolloxfm.com";

export default function sitemap(): MetadataRoute.Sitemap {
	const stationPages = stations
		.filter((station) => station.isEnabled !== false)
		.map((station) => ({
			url: `${BASE_URL}/station/${station.id}`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.8,
		}));

	const surveyPages = getAllSurveys().map((survey) => ({
		url: `${BASE_URL}/survey-results/${survey.meta.id}`,
		lastModified: new Date(),
		changeFrequency: "yearly" as const,
		priority: 0.7,
	}));

	return [
		{
			url: BASE_URL,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${BASE_URL}/about`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${BASE_URL}/survey-results`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.8,
		},
		...stationPages,
		...surveyPages,
	];
}
