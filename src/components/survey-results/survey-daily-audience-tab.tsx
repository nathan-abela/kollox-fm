import React from "react";

import { Survey } from "@/lib/types/survey";
import { DailyAudienceChart } from "@/components/survey-results/charts/daily-audience-chart";

export function SurveyDailyAudienceTab({ survey }: { survey: Survey }) {
	const stations = survey.stations || [];
	const firstWithData = stations.find(
		(s) => s.dailyListeners && Object.keys(s.dailyListeners).length > 0
	);
	const days = firstWithData
		? Object.keys(firstWithData.dailyListeners!)
		: [];

	if (!days.length) {
		return (
			<div className="text-muted-foreground py-8 text-center">
				No daily audience data available.
			</div>
		);
	}

	return (
		<>
			<DailyAudienceChart stations={stations} days={days} />
		</>
	);
}
