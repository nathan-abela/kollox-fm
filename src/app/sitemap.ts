import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/config";
import { stations } from "@/lib/data/stations";
import { getAllSurveys } from "@/lib/data/surveys";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
	const stationPages = stations
		.filter((station) => station.isEnabled !== false)
		.map((station) => ({
			url: `${siteUrl}/station/${station.id}`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.8,
		}));

	const surveyPages = getAllSurveys().map((survey) => ({
		url: `${siteUrl}/survey-results/${survey.meta.id}`,
		lastModified: new Date(),
		changeFrequency: "yearly" as const,
		priority: 0.7,
	}));

	return [
		{
			url: siteUrl,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${siteUrl}/about`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${siteUrl}/terms`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.3,
		},
		{
			url: `${siteUrl}/privacy`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.3,
		},
		{
			url: `${siteUrl}/survey-results`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.8,
		},
		...stationPages,
		...surveyPages,
	];
}
