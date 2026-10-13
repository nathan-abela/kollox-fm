"use client";

import { useId } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { StationSurveyHistoryEntry } from "@/lib/types/survey";
import { cn } from "@/lib/utils";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

interface MostFollowedTrendChartProps {
	stationName: string;
	/** One entry per survey edition, oldest first */
	history: StationSurveyHistoryEntry[];
	/** Optional sentence after the description, ex. how often the station led */
	note?: string;
	className?: string;
}

const chartConfig = {
	mostFollowedPct: { label: "Most followed", color: "var(--primary)" },
} satisfies ChartConfig;

/**
 * Line chart of a station's "most followed" share across survey editions.
 * Editions where the station was not ranked leave a gap in the line.
 * The caller decides how many editions justify a trend; this only needs one.
 */
export function MostFollowedTrendChart({
	stationName,
	history,
	note,
	className,
}: MostFollowedTrendChartProps) {
	// SVG defs are document-wide, so each chart instance gets its own ids
	const id = useId();
	const dotsId = `dots-${id}`;
	const glowId = `glow-${id}`;

	const ranked = history.filter((entry) => entry.mostFollowedPct != null);
	const first = ranked[0];
	const last = ranked[ranked.length - 1];
	if (!first || !last) return null;

	const summary = `Line chart of the share of radio listeners who follow ${stationName} most, from ${first.mostFollowedPct}% in ${first.year} to ${last.mostFollowedPct}% in ${last.year}`;

	return (
		// min-w-0 lets the card shrink inside a grid; otherwise the measured SVG width pins it open
		<Card className={cn("min-w-0 gap-4", className)}>
			<CardHeader>
				<CardTitle className="text-base">
					Most followed, {first.year} to {last.year}
				</CardTitle>
				<CardDescription>
					Share of radio listeners who follow {stationName} most.
					{note && ` ${note}`}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={chartConfig}
					className="h-56 w-full"
					role="img"
					aria-label={summary}
				>
					<LineChart
						accessibilityLayer
						data={history}
						margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
					>
						<defs>
							{/* Light dotted background */}
							<pattern
								id={dotsId}
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
							{/* Glow effect to line strokes */}
							<filter
								id={glowId}
								x="-20%"
								y="-20%"
								width="140%"
								height="140%"
							>
								<feGaussianBlur
									stdDeviation="10"
									result="blur"
								/>
								<feComposite
									in="SourceGraphic"
									in2="blur"
									operator="over"
								/>
							</filter>
						</defs>
						<rect
							x="0"
							y="0"
							width="100%"
							height="100%"
							fill={`url(#${dotsId})`}
						/>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="year"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={16}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickMargin={4}
							width={40}
							domain={[0, "auto"]}
							tickFormatter={(value) => `${value}%`}
						/>
						<ChartTooltip
							content={
								<ChartTooltipContent
									formatter={(value, _name, item) => (
										<div className="flex flex-1 items-center justify-between gap-3">
											<span className="text-muted-foreground">
												Most followed
											</span>
											<span className="text-foreground font-mono font-medium tabular-nums">
												{Number(value).toFixed(1)}% · #
												{item.payload.rank}
											</span>
										</div>
									)}
								/>
							}
						/>
						<Line
							dataKey="mostFollowedPct"
							name={stationName}
							type="monotone"
							stroke="var(--color-mostFollowedPct)"
							strokeWidth={2}
							dot={{
								r: 4,
								strokeWidth: 0,
								fill: "var(--color-mostFollowedPct)",
							}}
							activeDot={{ r: 6, strokeWidth: 0 }}
							connectNulls={false}
							filter={`url(#${glowId})`}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
