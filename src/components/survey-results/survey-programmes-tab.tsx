"use client";

import { Survey } from "@/lib/types/survey";
import { ProgrammesTable } from "@/components/survey-results/charts/programmes-table";
import { StationDemographicsHeatmapChart } from "@/components/survey-results/charts/station-demographics-heatmap-chart";
import { TopProgrammesByAgeChart } from "@/components/survey-results/charts/top-programmes-by-age-chart";
import { TopProgrammesChart } from "@/components/survey-results/charts/top-programmes-chart";
import { SurveyTopProgrammes } from "@/components/survey-results/survey-top-programmes";

export function SurveyProgrammesTab({ survey }: { survey: Survey }) {
	const programmesData = survey.programmes || [];

	if (!programmesData.length) {
		return (
			<div className="text-muted-foreground py-8 text-center">
				Programme preference data is not available for this survey year.
			</div>
		);
	}

	return (
		<>
			{/* Top 3 Programmes */}
			<SurveyTopProgrammes programmes={programmesData} />

			{/* Top 15 Chart */}
			<TopProgrammesChart survey={survey} />

			{/* Top Programmes by Age - Radial Charts */}
			<TopProgrammesByAgeChart survey={survey} />

			{/* Station Demographics Heatmap */}
			<StationDemographicsHeatmapChart survey={survey} />

			{/* All Programmes Table */}
			<ProgrammesTable programmes={programmesData} />
		</>
	);
}
