"use client";

import { useMemo } from "react";
import { ChartPie } from "lucide-react";
import { Cell, LabelList, Pie, PieChart, ResponsiveContainer } from "recharts";

import { Survey } from "@/lib/types/survey";
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

/**
 * ReceptionTypesChart Component
 *
 * Displays a pie chart showing the distribution of how respondents access radio content.
 *
 * @param {Object} props - Component props.
 * @param {Survey} props.survey - The survey data containing reception types.
 */
export function ReceptionTypesChart({ survey }: { survey: Survey }) {
	const receptionTypes = survey?.receptionTypes ?? [];

	// Transforms reception types data into a format suitable for the pie chart.
	const receptionTypeData = useMemo(() => {
		if (!receptionTypes.length) return [];

		// prettier-ignore
		const totalRespondents = receptionTypes.reduce(
			(sum, receptionType) => sum + (receptionType.respondents || 0), 0);

		return receptionTypes
			.filter((receptionType) => receptionType.respondents > 0)
			.sort((a, b) => b.respondents - a.respondents)
			.map((receptionType, index) => ({
				...receptionType,
				totalRespondents,
				percentageOfResponses: totalRespondents
					? (receptionType.respondents / totalRespondents) * 100
					: 0,
				fill: `var(--chart-${(index % 6) + 1})`,
			}));
	}, [receptionTypes]);

	// prettier-ignore
	const totalResponses = receptionTypeData.reduce(
		(sum, dataPoint) => sum + dataPoint.respondents, 0);

	// Configures the tooltip labels.
	const chartConfig = useMemo(() => {
		return receptionTypeData.reduce(
			(config, dataPoint) => ({
				...config,
				[dataPoint.id]: {
					label: dataPoint.label,
					color: dataPoint.fill,
				},
			}),
			{ respondents: { label: "Respondents" } } as ChartConfig
		);
	}, [receptionTypeData]);

	return (
		<Card className="rounded-2xl shadow-md">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg font-semibold">
					<ChartPie className="text-muted-foreground h-5 w-5" />
					Reception Types Distribution
				</CardTitle>
				<CardDescription>
					How listeners access radio content
				</CardDescription>
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
												| string | number
												| (string | number)[], _: string | number,
											data: any
										) => {
											// prettier-ignore
											const displayValue = Array.isArray(value)
												? value.join(", ")
												: Number(value).toLocaleString();
											return (
												// prettier-ignore
												<div>
													<p className="text-muted-foreground text-xs">
														{displayValue} listen on
														<strong> {data.payload.shortLabel}</strong>
													</p>
													{data.payload.percentageOfResponses !== null && (
														<p className="text-muted-foreground text-xs">
															{data.payload.percentageOfResponses.toFixed(2)}
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
								data={receptionTypeData}
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
									formatter={(value: number) =>
										value.toLocaleString()
									}
								/>
								{receptionTypeData.map((dataPoint) => (
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
					Total respondents:{" "}
					<span className="font-medium">
						{totalResponses.toLocaleString()}
					</span>
				</p>
			</CardFooter>
		</Card>
	);
}
