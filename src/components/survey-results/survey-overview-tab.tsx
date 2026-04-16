"use client";

import { Clock, Radio, Star, Users } from "lucide-react";

import { Survey } from "@/lib/types/survey";
import { ReceptionTypesChart } from "@/components/survey-results/charts/reception-types-chart";
import { TopStationsChart } from "@/components/survey-results/charts/top-stations-chart";
import { SurveyMetricCard } from "@/components/survey-results/survey-metric-card";

export function SurveyOverviewTab({ survey }: { survey: Survey }) {
	const stations = survey.stations || [];
	const totalStations = stations.filter(
		(s) => s.id !== "no-radio" && s.id !== "foreign-station"
	).length;
	const mostFollowed = survey.highlights?.mostFollowedStation;
	const mostFollowedLabel =
		stations.find((s) => s.id === mostFollowed?.id)?.label ?? mostFollowed?.id;
	const population = survey.metrics?.populationListening;
	const peak = survey.highlights?.peakTimeband;

	if (!stations.length) {
		return (
			<div className="text-muted-foreground py-8 text-center">
				No overview data available.
			</div>
		);
	}

	return (
		<div>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				<SurveyMetricCard
					icon={Radio}
					title="Total Stations"
					value={totalStations ?? "N/A"}
					subtitle="Active in survey"
					tooltip="Number of stations active in the current survey"
				/>

				<SurveyMetricCard
					icon={Star}
					title="Most Followed Station"
					value={mostFollowedLabel ?? "N/A"}
					subtitle={
						mostFollowed?.mostFollowedPct != null
							? `${mostFollowed.mostFollowedPct}% of listeners`
							: "N/A"
					}
					tooltip="Station with the highest percentage of listeners who consider it their primary choice."
				/>

				<SurveyMetricCard
					icon={Users}
					title="Total Radio Listeners"
					value={population?.toLocaleString() ?? "N/A"}
					subtitle="Extrapolated 12+ population"
					tooltip="Total estimated radio listeners aged 12+ in Malta."
				/>

				<SurveyMetricCard
					icon={Clock}
					title="Peak Timeband"
					value={peak?.timeband ?? "N/A"}
					subtitle={`≈${peak?.listeners?.toLocaleString()} listeners`}
					tooltip="Time slot with the highest total audience during the survey week"
				/>
			</div>

			<div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
				<TopStationsChart survey={survey} />

				<ReceptionTypesChart survey={survey} />
			</div>
		</div>
	);
}
