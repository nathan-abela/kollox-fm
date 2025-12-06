"use client";

import { useMemo, useState } from "react";
import { ChartSpline, RotateCcw, TrendingUp, X as XIcon } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { StationSummary } from "@/lib/types/survey";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";

const DEFAULT_TOP_COUNT = 7;

export interface DailyAudienceChartProps {
	stations: StationSummary[];
	days: string[];
}

/**
 * Calculates and returns the top stations by weekly average listeners.
 */
function getTopStations(
	stations: StationSummary[],
	days: string[],
	count: number = DEFAULT_TOP_COUNT
): StationSummary[] {
	return stations
		.map((station) => {
			const sum = days.reduce(
				(acc: number, day: string) =>
					acc + (station.dailyListeners?.[day] ?? 0),
				0
			);
			const avg = days.length > 0 ? sum / days.length : 0;
			return { station, avg };
		})
		.sort((a, b) => b.avg - a.avg)
		.slice(0, count)
		.map((item) => item.station);
}

/**
 * Interactive daily audience chart with station selection.
 *
 * Displays daily listener counts for selected stations with a glowing line effect.
 * Shows top 7 stations by default with ability to add/remove stations via dropdown.
 * On mobile devices (< md breakpoint), shows only the chart without controls.
 *
 * @param props - Component props
 * @param props.stations - Array of station data including daily listener counts
 * @param props.days - Array of ISO date strings representing the survey week
 *
 * @remarks
 * - Chart colors cycle through 7 CSS variables (--chart-1 to --chart-7)
 * - Reset button is disabled when selection matches default top 7
 * - Tooltip entries are sorted by value in descending order
 * - Chart height: 300px on mobile, 600px on desktop
 */
export function DailyAudienceChart({
	stations,
	days,
}: DailyAudienceChartProps) {
	const availableStations = useMemo(
		() => stations.filter((s) => s.dailyListeners),
		[stations]
	);

	const daysOfWeek = useMemo(
		() =>
			days.map((day) => {
				const date = new Date(day);
				return date.toLocaleDateString("en-GB", { weekday: "short" });
			}),
		[days]
	);

	const defaultStations = useMemo(
		() =>
			getTopStations(availableStations, days, DEFAULT_TOP_COUNT).map(
				(station) => station.label
			),
		[availableStations, days]
	);

	const [selectedLabels, setSelectedLabels] = useState<string[]>(
		() => defaultStations
	);

	const unselectedStations = useMemo(
		() =>
			availableStations
				.filter((station) => !selectedLabels.includes(station.label))
				.sort((a, b) => a.label.localeCompare(b.label)),
		[availableStations, selectedLabels]
	);

	const chartData = useMemo(
		() =>
			days.map((day) => {
				const row: Record<string, number | string> = { day };
				availableStations.forEach((station) => {
					row[station.label] = station.dailyListeners?.[day] ?? 0;
				});
				return row;
			}),
		[availableStations, days]
	);

	const chartConfig = useMemo(
		() =>
			selectedLabels.reduce(
				(config: ChartConfig, label: string, index: number) => {
					const colorIndex = (index % 7) + 1;
					config[label] = {
						label,
						color: `var(--chart-${colorIndex})`,
					};
					return config;
				},
				{} as ChartConfig
			),
		[selectedLabels]
	);

	const isModified = useMemo(() => {
		if (selectedLabels.length !== defaultStations.length) return true;
		return !selectedLabels.every((label) =>
			defaultStations.includes(label)
		);
	}, [selectedLabels, defaultStations]);

	/**
	 * Removes a station from the selected stations list.
	 */
	const handleRemoveStation = (label: string) => {
		setSelectedLabels((prev) => prev.filter((l) => l !== label));
	};

	/**
	 * Adds a station to the selected stations list.
	 */
	const handleAddStation = (label: string) => {
		if (label && !selectedLabels.includes(label)) {
			setSelectedLabels((prev) => [...prev, label]);
		}
	};

	/**
	 * Resets the selected stations to the default top stations.
	 */
	const handleReset = () => {
		setSelectedLabels(defaultStations);
	};

	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg font-semibold">
					<ChartSpline className="text-muted-foreground h-5 w-5" />
					Daily Audience by Station
					<Badge
						variant="outline"
						className="ml-2 border-none bg-green-500/10 text-green-500"
					>
						<TrendingUp className="h-4 w-4" />
						<span>Top {selectedLabels.length} shown</span>
					</Badge>
				</CardTitle>
				<CardDescription>Week of {formatDate(days[0])}</CardDescription>
			</CardHeader>

			<CardContent>
				<div className="mb-4 hidden flex-wrap items-center gap-2 md:flex">
					<div className="flex flex-1 flex-wrap items-center gap-2">
						{selectedLabels.map((label) => (
							<span
								key={label}
								className="bg-muted flex h-8 items-center gap-2 rounded-md px-3 py-2 text-xs font-medium"
							>
								{label}
								<button
									aria-label={`Remove ${label}`}
									className="text-muted-foreground hover:text-destructive cursor-pointer"
									onClick={() => handleRemoveStation(label)}
									type="button"
								>
									<XIcon className="h-3 w-3" />
								</button>
							</span>
						))}
					</div>

					<div className="flex items-center gap-2">
						<Select value="" onValueChange={handleAddStation}>
							<SelectTrigger
								className="!h-8 min-w-[140px] cursor-pointer rounded-md px-3 py-2 text-xs"
								aria-label="Add station"
							>
								Add station...
							</SelectTrigger>
							<SelectContent className="max-h-48 overflow-auto">
								{unselectedStations.length > 0 ? (
									unselectedStations.map((station) => (
										<SelectItem
											key={station.label}
											value={station.label}
											className="text-xs"
										>
											{station.label}
										</SelectItem>
									))
								) : (
									<div className="text-muted-foreground px-3 py-2 text-xs">
										All stations selected
									</div>
								)}
							</SelectContent>
						</Select>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="flex h-8 cursor-pointer items-center gap-2 px-3 py-2 text-xs"
							onClick={handleReset}
							disabled={!isModified}
							title="Reset to default stations"
						>
							<RotateCcw className="h-3 w-3" /> Reset
						</Button>
					</div>
				</div>

				<ChartContainer
					config={chartConfig}
					className="h-[300px] w-full md:h-[600px]"
				>
					<LineChart
						accessibilityLayer
						data={chartData}
						margin={{
							left: 12,
							right: 12,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="day"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							ticks={days}
							tickFormatter={(_value, index) => daysOfWeek[index]}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) =>
								new Intl.NumberFormat("en-US", {
									notation: "compact",
									compactDisplay: "short",
								}).format(value)
							}
							label={{
								value: "Daily Listeners",
								angle: -90,
								position: "insideLeft",
								style: { textAnchor: "middle" },
							}}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						{availableStations.map((station) =>
							selectedLabels.includes(station.label) ? (
								<Line
									key={station.label}
									dataKey={station.label}
									type="bump"
									stroke={`var(--chart-${(selectedLabels.indexOf(station.label) % 7) + 1})`}
									dot={false}
									strokeWidth={2}
									filter="url(#rainbow-line-glow)"
								/>
							) : null
						)}
						<defs>
							<filter
								id="rainbow-line-glow"
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
					</LineChart>
				</ChartContainer>
			</CardContent>

			<CardFooter>
				<p className="text-muted-foreground text-xs italic">
					Daily listener counts from Broadcasting Authority survey
					(21-27 July 2024). Top {DEFAULT_TOP_COUNT} stations shown by
					default.
				</p>
			</CardFooter>
		</Card>
	);
}
