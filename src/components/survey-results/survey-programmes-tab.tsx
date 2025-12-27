"use client";

import { Survey } from "@/lib/types/survey";
import { StationDemographicsHeatmapChart } from "@/components/survey-results/charts/station-demographics-heatmap-chart";
import { TopProgrammesChart } from "@/components/survey-results/charts/top-programmes-chart";
import { SurveyTopProgrammes } from "@/components/survey-results/survey-top-programmes";

export function SurveyProgrammesTab({ survey }: { survey: Survey }) {
	const programmesData = survey.programmes || [];

	if (!programmesData.length) {
		return (
			<div className="text-muted-foreground py-8 text-center">
				Programmes data coming soon...
			</div>
		);
	}

	return (
		<>
			{/* Top 3 Programmes */}
			<SurveyTopProgrammes programmes={programmesData} />

			{/* Top 15 Chart */}
			<TopProgrammesChart survey={survey} />

			{/* Station Demographics Heatmap */}
			<StationDemographicsHeatmapChart survey={survey} />
		</>
	);
}
