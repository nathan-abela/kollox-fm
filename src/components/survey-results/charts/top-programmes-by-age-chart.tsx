"use client";

import { useMemo, useState } from "react";
import { Award } from "lucide-react";
import {
	Cell,
	RadialBar,
	RadialBarChart,
	ResponsiveContainer,
	Tooltip,
} from "recharts";

import { Survey } from "@/lib/types/survey";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
 * Renders a grid of 7 radial pie charts, one per age bracket.
 *
 * @remarks
 * - Each chart shows the top 5 programmes for that bracket.
 * - Hovering a segment highlights only the segment's chart (not the whole
 *   grid) and shows a compact tooltip with programme name and percentage.
 * - The component excludes the "no preference" programme used in the data.
 */
export function TopProgrammesByAgeChart({ survey }: { survey: Survey }) {
	const [activeCell, setActiveCell] = useState<{
		bracketKey: (typeof AGE_BRACKETS)[number]["key"];
		programmeName: string;
	} | null>(null);

	// Top 5 programmes per age bracket
	const bracketChampions = useMemo(() => {
		if (!survey?.programmes) return [];

		const programmes = survey.programmes.filter(
			(p) => p.id !== "no-preferred-programme"
		);

		return AGE_BRACKETS.map((bracket) => {
			const programmeScores = programmes
				.map((p) => ({
					name: p.name,
					station: p.station || "Unknown",
					percentage:
						p.ageDemographics?.[bracket.key]?.percentage || 0,
				}))
				.filter((p) => p.percentage > 0)
				.sort((a, b) => b.percentage - a.percentage)
				.slice(0, 5);

			const chartData = programmeScores.map((p, index) => ({
				name: p.name,
				station: p.station,
				percentage: p.percentage,
				fill: `var(--chart-${index + 1})`,
			}));

			return {
				bracket,
				winner: programmeScores[0],
				chartData,
			};
		});
	}, [survey]);

	return (
		<Card className="rounded-2xl shadow-md">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg font-semibold">
					<Award className="text-muted-foreground h-5 w-5" />
					Top Programmes by Age
				</CardTitle>
				<p className="text-muted-foreground text-sm">
					Top 5 most popular programmes in each age bracket
				</p>
			</CardHeader>

			<CardContent className="pt-2">
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
					{bracketChampions.map(({ bracket, winner, chartData }) => (
						<div
							key={bracket.key}
							className="flex flex-col items-center"
							onMouseLeave={() => setActiveCell(null)}
						>
							<h3 className="text-muted-foreground mb-2 text-sm font-medium">
								{bracket.label}
							</h3>
							<div className="aspect-square w-full">
								<ResponsiveContainer width="100%" height="100%">
									<RadialBarChart
										data={chartData}
										innerRadius="30%"
										outerRadius="95%"
										barSize={10}
										startAngle={90}
										endAngle={-270}
										onMouseLeave={() => setActiveCell(null)}
									>
										{/* Light dotted background */}
										<defs>
											<pattern
												id={`dotted-bg-${bracket.key}`}
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
											{chartData.map((_, idx) => (
												<filter
													key={`filter-${idx}`}
													id={`glow-${bracket.key}-${idx}`}
													x="-50%"
													y="-50%"
													width="200%"
													height="200%"
												>
													<feGaussianBlur
														stdDeviation="8"
														result="blur"
													/>
													<feComposite
														in="SourceGraphic"
														in2="blur"
														operator="over"
													/>
												</filter>
											))}
										</defs>
										<rect
											x="0"
											y="0"
											width="100%"
											height="100%"
											fill={`url(#dotted-bg-${bracket.key})`}
										/>
										<RadialBar
											dataKey="percentage"
											cornerRadius={6}
											background={{ fill: "var(--muted)" }} // prettier-ignore
											className="drop-shadow-lg"
										>
											{chartData.map((entry, idx) =>
												(() => {
													const isActiveBracket = activeCell?.bracketKey === bracket.key; // prettier-ignore
													const isHovered =
														isActiveBracket &&
														activeCell?.programmeName ===
															entry.name;

													return (
														<Cell
															key={`cell-${idx}`}
															fill={entry.fill}
															filter={
																isHovered
																	? `url(#glow-${bracket.key}-${idx})`
																	: undefined
															}
															opacity={
																!isActiveBracket
																	? 1
																	: isHovered
																		? 1
																		: 0.3
															}
															onMouseEnter={() =>
																setActiveCell({
																	bracketKey:
																		bracket.key,
																	programmeName:
																		entry.name,
																})
															}
															onMouseLeave={() => setActiveCell(null)} // prettier-ignore
															className="transition-opacity duration-200"
														/>
													);
												})()
											)}
										</RadialBar>
										{/* prettier-ignore */}
										<Tooltip
											content={({ active, payload }) => {
												if (!active || !payload?.length) return null;
												const data = payload[0].payload;

												return (
													<div className="bg-popover hidden rounded-md border px-2 py-1 shadow-md md:block">
														<p className="text-foreground text-xs font-medium">
															{data.name} · <span className="text-muted-foreground font-normal">{data.percentage.toFixed(1)}%</span>
														</p>
													</div>
												);
											}}
											active={ activeCell?.bracketKey === bracket.key }
											cursor={{ fill: "var(--muted)", stroke: "none" }}
										/>
									</RadialBarChart>
								</ResponsiveContainer>
							</div>
							{winner && (
								<div className="mt-2 text-center">
									<p className="text-xs font-medium">
										{winner.name}
									</p>
									<Badge
										variant="secondary"
										className="mt-2 gap-2"
									>
										<Award />
										{winner.percentage.toFixed(1)}%
									</Badge>
								</div>
							)}
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
