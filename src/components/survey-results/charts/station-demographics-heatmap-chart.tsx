"use client";

import { useMemo, useState } from "react";
import { Radio } from "lucide-react";

import type { AgeDemographics, Survey } from "@/lib/types/survey";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

type AgeBracketKey = keyof AgeDemographics;

/**
 * Age brackets configuration in display order (left to right in heatmap columns).
 * Combines type-safe keys with human-readable labels.
 */
const AGE_BRACKETS = [
	{ key: "age12to20", label: "12-20" },
	{ key: "age21to30", label: "21-30" },
	{ key: "age31to40", label: "31-40" },
	{ key: "age41to50", label: "41-50" },
	{ key: "age51to60", label: "51-60" },
	{ key: "age61to70", label: "61-70" },
	{ key: "age71plus", label: "71+" },
] as const;

/**
 * Returns the appropriate heatmap color CSS variable based on normalized intensity.
 *
 * @param intensity - Normalized value between 0 and 1
 */
const getHeatmapColor = (intensity: number): string => {
	if (intensity < 0.2) return "var(--heatmap-1)";
	if (intensity < 0.4) return "var(--heatmap-2)";
	if (intensity < 0.6) return "var(--heatmap-3)";
	if (intensity < 0.8) return "var(--heatmap-4)";
	return "var(--heatmap-5)";
};

/**
 * Visualizes aggregated age demographics across radio station programmes.
 *
 * Displays a heatmap where:
 * - Rows = radio stations (filtered to stations with 2+ programmes, sorted by total audience share descending)
 * - Columns = age brackets (12-20, 21-30, ..., 71+)
 * - Cell color intensity = total percentage of listeners in that age bracket across all station programmes
 * - Cell value = summed percentage across all programmes
 *
 * @example
 * If "Bay FM" has 3 programmes with age 21-30 percentages of [15%, 10%, 8%],
 * the cell for "Bay FM / 21-30" shows 33% (15+10+8).
 *
 * Stations are ordered by their total demographic reach (sum of all age brackets) from highest to lowest.
 * For example, if "ONE Radio" has the highest combined percentage across all age groups,
 * it appears first in the list.
 *
 * @param survey - Survey data containing programme demographic information
 */
export function StationDemographicsHeatmapChart({
	survey,
}: {
	survey: Survey;
}) {
	const [activeStation, setActiveStation] = useState<string | null>(null);
	const [activeAge, setActiveAge] = useState<string | null>(null);

	const { heatmapData, maxValue } = useMemo(() => {
		if (!survey?.programmes) return { heatmapData: [], maxValue: 0 };

		const programmes = survey.programmes.filter(
			(p) => p.id !== "no-preferred-programme" && p.station
		);

		// Group programmes by station and aggregate demographics
		const stationMap = new Map<
			string,
			{ count: number; demographics: Record<AgeBracketKey, number> }
		>();

		programmes.forEach((p) => {
			const station = p.station!;
			if (!stationMap.has(station)) {
				stationMap.set(station, {
					count: 0,
					demographics: {
						age12to20: 0,
						age21to30: 0,
						age31to40: 0,
						age41to50: 0,
						age51to60: 0,
						age61to70: 0,
						age71plus: 0,
					},
				});
			}

			const stationData = stationMap.get(station)!;
			stationData.count++;

			// Sum age demographics across all station programmes
			AGE_BRACKETS.forEach(({ key }) => {
				const pct = p.ageDemographics?.[key]?.percentage || 0;
				stationData.demographics[key] += pct;
			});
		});

		// All stations with programme data, sorted by total percentage
		const stations = Array.from(stationMap.entries())
			.map(([station, data]) => {
				const total = AGE_BRACKETS.reduce(
					(sum, { key }) => sum + data.demographics[key],
					0
				);
				return { station, data, total };
			})
			.sort((a, b) => b.total - a.total);

		// Find maximum value across all cells for color intensity scaling
		let maxValue = 0;
		stations.forEach(({ data }) => {
			AGE_BRACKETS.forEach(({ key }) => {
				maxValue = Math.max(maxValue, data.demographics[key]);
			});
		});

		// Transform into heatmap row format
		const heatmapData = stations.map(({ station, data }) => ({
			station,
			programmeCount: data.count,
			demographics: AGE_BRACKETS.map(({ key, label }) => ({
				age: label,
				value: data.demographics[key],
			})),
		}));

		return { heatmapData, maxValue };
	}, [survey]);

	return (
		<Card className="rounded-2xl shadow-md">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg font-semibold">
					<Radio className="text-muted-foreground h-5 w-5" />
					Station Demographics Heatmap
				</CardTitle>
				<p className="text-muted-foreground text-sm">
					Combined age demographics across all station programmes,
					ordered by total audience share (highest to lowest).
				</p>
			</CardHeader>
			<CardContent className="pt-2">
				<div className="overflow-x-auto">
					<div className="min-w-full">
						{/* Header row with age brackets */}
						<div className="mb-2 grid grid-cols-[160px_repeat(7,1fr)] gap-2">
							<div className="text-muted-foreground text-xs font-medium">
								Station
							</div>
							{AGE_BRACKETS.map(({ key, label }) => (
								<div
									key={key}
									className={`text-center text-xs font-medium transition-colors ${
										activeAge === label
											? "text-foreground"
											: "text-muted-foreground"
									}`}
								>
									{label}
								</div>
							))}
						</div>

						{/* Station rows */}
						<div className="space-y-2">
							{heatmapData.map((stationData) => (
								<div
									key={stationData.station}
									className="grid grid-cols-[160px_repeat(7,1fr)] gap-2"
								>
									{/* Station name and programme count */}
									<div
										className={`flex flex-col justify-center rounded-lg border px-3 py-2 transition-colors ${
											activeStation ===
											stationData.station
												? "bg-muted/60 border-foreground/20"
												: "bg-muted/30"
										}`}
									>
										<p className="text-sm font-medium">
											{stationData.station}
										</p>
										{/* prettier-ignore */}
										<p className="text-muted-foreground text-xs">
											{stationData.programmeCount} programmes
										</p>
									</div>

									{/* Heatmap cells */}
									{stationData.demographics.map((demo) => {
										const intensity =
											maxValue > 0
												? demo.value / maxValue
												: 0;
										const isHovered = activeStation === stationData.station && activeAge === demo.age; // prettier-ignore
										const isActive = activeStation === null || isHovered; // prettier-ignore

										return (
											// prettier-ignore
											<div
												key={demo.age}
												className="cursor-pointer rounded-lg border transition-all duration-200"
												style={{
													backgroundColor: getHeatmapColor(intensity),
													filter: isHovered ? "saturate(1.3) " : "none", // Increase saturation on hover
													opacity: isActive ? 1 : 0.6, // Dim non-active cells
													transform: isActive
														? "scale(1)"
														: "scale(0.95)", // Shrink non-active cells
												}}
												onMouseEnter={() => {
													setActiveStation(stationData.station);
													setActiveAge(demo.age);
												}}
												onMouseLeave={() => {
													setActiveStation(null);
													setActiveAge(null);
												}}
											>
													<div className="flex min-h-[60px] items-center justify-center">
													<span className="text-foreground text-sm font-semibold">
														{demo.value.toFixed(1)}%
													</span>
												</div>
											</div>
										);
									})}
								</div>
							))}
						</div>
					</div>
				</div>
			</CardContent>

			<CardFooter className="text-muted-foreground flex-col items-start gap-3 text-xs italic">
				{/* Color Legend */}
				<div className="flex items-center gap-3">
					<span className="font-medium">Low audience</span>
					{/* prettier-ignore */}
					<div className="flex h-6 w-48 overflow-hidden rounded-md border">
						<div className="flex-1" style={{ backgroundColor: "var(--heatmap-1)" }} />
						<div className="flex-1" style={{ backgroundColor: "var(--heatmap-2)" }} />
						<div className="flex-1" style={{ backgroundColor: "var(--heatmap-3)" }} />
						<div className="flex-1" style={{ backgroundColor: "var(--heatmap-4)" }} />
						<div className="flex-1" style={{ backgroundColor: "var(--heatmap-5)" }} />
					</div>
					<span className="font-medium">High audience</span>
				</div>
				<p>
					Each cell shows the total percentage of listeners in that
					age bracket across all programmes from the radio station.
				</p>
			</CardFooter>
		</Card>
	);
}
