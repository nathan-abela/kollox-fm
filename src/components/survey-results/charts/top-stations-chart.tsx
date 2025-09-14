"use client";

import { useMemo } from "react";
import { ChartColumn } from "lucide-react";
import {
	Bar,
	BarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import { Survey } from "@/lib/types/survey";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip } from "@/components/survey-results/charts/chart-tooltip";

export function TopStationsChart({ survey }: { survey: Survey }) {
	const topStationsData = useMemo(() => {
		if (!survey?.stations) return [];

		const stations = survey.stations.filter(
			(s) => s.stationListeners && s.id !== "no-radio"
		);
		const noRadio = survey.stations.find((s) => s.id === "no-radio");

		const sortedStations = stations
			.sort(
				(a, b) => (b.stationListeners ?? 0) - (a.stationListeners ?? 0)
			)
			.slice(0, 9);

		if (noRadio) sortedStations.push(noRadio); // Ensures "No Radio" is added last

		return sortedStations.map((s) => ({
			station: s.label,
			mostFollowedPct: s.mostFollowedPct ?? 0,
			stationListeners: s.stationListeners ?? 0,
		}));
	}, [survey]);

	return (
		<Card className="rounded-2xl shadow-md">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg font-semibold">
					<ChartColumn className="text-muted-foreground h-5 w-5" />
					Top 10 Stations by Listeners
				</CardTitle>
				<p className="text-muted-foreground text-sm">
					Leading stations by estimated listeners
				</p>
			</CardHeader>
			<CardContent className="pt-2">
				<div className="h-[420px] w-full">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={topStationsData}
							margin={{
								top: 20,
								right: 30,
								left: 10,
								bottom: 60,
							}}
							barCategoryGap="15%"
						>
							{/* Light dotted background */}
							<defs>
								<pattern
									id="stations-dotted-bg"
									x="0"
									y="0"
									width="10"
									height="10"
									patternUnits="userSpaceOnUse"
								>
									<circle
										className="dark:text-muted/40 text-muted"
										cx="2"
										cy="2"
										r="1"
										fill="currentColor"
									/>
								</pattern>
							</defs>
							<rect
								x="0"
								y="0"
								width="100%"
								height="100%"
								fill="url(#stations-dotted-bg)"
							/>

							<XAxis
								dataKey="station"
								tickLine={false}
								axisLine={false}
								angle={-45}
								textAnchor="end"
								height={70}
								tick={{
									fill: "var(--muted-foreground)",
									fontSize: 12,
								}}
								tickFormatter={(v) =>`${String(v).slice(0, 14)}`} // prettier-ignore
							/>
							<YAxis
								allowDecimals={false}
								tick={{
									fill: "var(--muted-foreground)",
									fontSize: 12,
								}}
								tickFormatter={(v) => v.toLocaleString()}
								domain={[0, 45000]}
								label={{
									value: "Estimated Listeners",
									angle: -90,
									position: "insideBottomLeft",
								}}
							/>

							<Tooltip
								cursor={{ fill: "transparent" }}
								content={<ChartTooltip />}
							/>

							<Bar
								dataKey="stationListeners"
								fill="var(--chart-1)"
								radius={[6, 6, 0, 0]}
								activeBar={{ fill: "var(--chart-2)" }}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
				<p className="text-muted-foreground text-xs italic">
					Note: Respondents could name up to 3 stations.
				</p>
			</CardContent>
		</Card>
	);
}
