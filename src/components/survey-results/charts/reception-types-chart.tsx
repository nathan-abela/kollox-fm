"use client";

import { useMemo } from "react";
import { ChartPie } from "lucide-react";
import { Cell, LabelList, Pie, PieChart, ResponsiveContainer } from "recharts";

import type { Survey } from "@/lib/types/survey";
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

interface ChartDataPoint {
	id: string;
	label: string;
	shortLabel: string;
	respondents: number;
	percentage: number;
	totalRespondents: number;
	percentageOfResponses: number;
	fill: string;
}

/**
 * ReceptionTypesChart Component
 * 
 * Displays a pie chart of reception types distribution based on survey data.
 * If reception types data is unavailable, it falls back to DAB+ ownership usage distribution.
 * If neither is available, it shows a placeholder message.
 * 
 * @param {Object} props - Component props.
 * @param {Survey} props.survey - The survey data containing reception types and DAB+ ownership information.
 */
export function ReceptionTypesChart({ survey }: { survey: Survey }) {
	const hasReceptionTypes = survey.receptionTypes && survey.receptionTypes.length > 0;
	const hasDabOwnership = survey.dabOwnership && survey.dabOwnership.usage.length > 0;

	const { chartData, title, description, footerLabel } = useMemo(() => {
		if (hasReceptionTypes) {
			const receptionTypes = survey.receptionTypes!;

			// prettier-ignore
			const totalRespondents = receptionTypes.reduce(
				(sum, receptionType) => sum + (receptionType.respondents || 0), 0
			);

			const data: ChartDataPoint[] = receptionTypes
				.filter((receptionType) => receptionType.respondents > 0)
				.sort((a, b) => b.respondents - a.respondents)
				.map((receptionType, index) => ({
					...receptionType,
					totalRespondents,
					percentageOfResponses: totalRespondents
						? (receptionType.respondents / totalRespondents) * 100
						: 0,
					fill: `var(--chart-${(index % 4) + 1})`,
				}));

			return {
				chartData: data,
				title: "Reception Types Distribution",
				description: "How listeners access radio content",
				footerLabel: "Total respondents",
			};
		}

		if (hasDabOwnership) {
			const usage = survey.dabOwnership!.usage;
			const totalRespondents = usage.reduce(
				(sum, u) => sum + (u.respondents || 0),
				0
			);

			const data: ChartDataPoint[] = usage
				.filter((u) => u.respondents > 0)
				.sort((a, b) => b.respondents - a.respondents)
				.map((u, index) => ({
					...u,
					totalRespondents,
					percentageOfResponses: totalRespondents
						? (u.respondents / totalRespondents) * 100
						: 0,
					fill: `var(--chart-${(index % 4) + 1})`,
				}));

			return {
				chartData: data,
				title: "DAB+ Usage Distribution",
				description: `Among ${survey.dabOwnership!.ownershipPct}% who own DAB+ radios`,
				footerLabel: "Total DAB+ listeners",
			};
		}

		return {
			chartData: [],
			title: "Listening Methods Distribution",
			description: "No data available",
			footerLabel: "Total",
		};
	}, [survey, hasReceptionTypes, hasDabOwnership]);

	// prettier-ignore
	const totalResponses = chartData.reduce(
		(sum, dataPoint) => sum + dataPoint.respondents, 0
	);

	// Configure tooltip and labels based on chart data
	const chartConfig = useMemo(() => {
		return chartData.reduce(
			(config, dataPoint) => ({
				...config,
				[dataPoint.id]: {
					label: dataPoint.label,
					color: dataPoint.fill,
				},
			}),
			{ respondents: { label: "Respondents" } } as ChartConfig
		);
	}, [chartData]);

	if (!chartData.length) {
		return null;
	}

	return (
		<Card className="rounded-2xl shadow-md">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg font-semibold">
					<ChartPie className="text-muted-foreground h-5 w-5" />
					{title}
				</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent className="flex-1">
				<ChartContainer
					config={chartConfig}
					className="mx-auto [&_.recharts-text]:fill-white"
				>
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
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

							<ChartTooltip
								content={
									// prettier-ignore
									<ChartTooltipContent
										hideLabel={false}
										nameKey="respondents"
										formatter={(
											value:
												| string
												| number
												| (string | number)[],
											_: string | number,
											data: { payload?: ChartDataPoint }
										) => {
											const payload = data.payload;
											if (!payload) return null;
											// prettier-ignore
											const displayValue = Array.isArray(value)
												? value.join(", ")
												: Number(value).toLocaleString();
											return (
												// prettier-ignore
												<div>
													<p className="text-muted-foreground text-xs">
														{displayValue} listen on
														<strong> {payload.shortLabel}</strong>
													</p>
													{payload.percentageOfResponses !== null && (
														<p className="text-muted-foreground text-xs">
															{payload.percentageOfResponses.toFixed(2)}
															% of respondents
														</p>
													)}
												</div>
											);
										}}
									/>
								}
							/>
							<Pie
								data={chartData}
								dataKey="respondents"
								nameKey="label"
								innerRadius={50}
								outerRadius={130}
								minAngle={10} // Ensures visibility for small slices
								paddingAngle={2}
								cornerRadius={8}
							>
								<LabelList
									dataKey="respondents"
									position="inside"
									stroke="none"
									fontSize={12}
									fontWeight={700}
									fill="currentColor"
									formatter={(value: number) => value.toLocaleString()}
								/>
								{chartData.map((dataPoint) => (
									<Cell
										key={dataPoint.id}
										fill={dataPoint.fill}
										stroke="var(--background)"
										strokeWidth={2}
									/>
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
			<CardFooter className="text-muted-foreground text-xs italic">
				<p>
					{footerLabel}:{" "}
					<span className="font-medium">
						{totalResponses.toLocaleString()}
					</span>
				</p>
			</CardFooter>
		</Card>
	);
}
