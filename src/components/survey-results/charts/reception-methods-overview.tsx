"use client";

import { useMemo } from "react";
import { ChartPie, Radio } from "lucide-react";
import { Cell, LabelList, Pie, PieChart, ResponsiveContainer } from "recharts";

import { Survey } from "@/lib/types/survey";
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

/**
 * ReceptionMethodsOverview Component
 *
 * Displays an overview of radio reception methods in a two-column layout:
 * - Left: Pie chart showing the distribution of reception types (Radio, Streaming, DAB+, TV)
 * - Right: Detailed list showing each reception method with listener counts and percentages
 *
 * The component filters out reception types with zero respondents and sorts by popularity.
 *
 * @param {Object} props - Component props.
 * @param {Survey} props.survey - The survey data containing reception types and their metrics.
 */
export function ReceptionMethodsOverview({ survey }: { survey: Survey }) {
	const receptionTypes = useMemo(
		() => survey?.receptionTypes ?? [],
		[survey?.receptionTypes]
	);

	// Transform data for pie chart
	const receptionTypeData = useMemo(() => {
		if (!receptionTypes.length) return [];

		return receptionTypes
			.filter((rt) => rt.respondents > 0)
			.sort((a, b) => b.respondents - a.respondents)
			.map((rt, index) => ({
				...rt,
				fill: `var(--chart-${(index % 4) + 1})`,
			}));
	}, [receptionTypes]);

	// Chart configuration
	const chartConfig: ChartConfig = useMemo(() => {
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
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
			{/* Pie Chart */}
			<Card className="rounded-2xl shadow-md">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg font-semibold">
						<ChartPie className="text-muted-foreground h-5 w-5" />
						Types of Radio Reception Services
					</CardTitle>
					<CardDescription>
						How listeners access radio content across all platforms
					</CardDescription>
				</CardHeader>

				<CardContent className="flex-1">
					<ChartContainer config={chartConfig} className="mx-auto">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
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
											className="text-muted dark:text-muted/40"
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
											hideLabel
											formatter={(_value, _, item) => (
												<div className="flex items-center gap-2">
													<span className="font-medium">
														{item.payload.shortLabel}
													</span>
													<span className="text-muted-foreground">
														{item.payload.respondents.toLocaleString()} listeners
													</span>
												</div>
											)}
										/>
									}
								/>
								<Pie
									data={receptionTypeData}
									dataKey="respondents"
									nameKey="label"
									innerRadius={50}
									paddingAngle={2}
									cornerRadius={8}
									minAngle={10}
								>
									<LabelList
										dataKey="percentage"
										position="inside"
										stroke="none"
										fontSize={12}
										fontWeight={700}
										fill="white"
										formatter={(value: number) => `${value.toFixed(1)}%`} // prettier-ignore
									/>
									{receptionTypeData.map((entry) => (
										<Cell
											key={entry.id}
											fill={entry.fill}
											stroke="var(--background)"
											strokeWidth={2}
										/>
									))}
								</Pie>
							</PieChart>
						</ResponsiveContainer>
					</ChartContainer>
				</CardContent>
			</Card>

			{/* Reception Method Details List */}
			<Card className="rounded-2xl shadow-md">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg font-semibold">
						<Radio className="text-muted-foreground h-5 w-5" />
						Reception Method Details
					</CardTitle>
					<CardDescription>
						Breakdown by platform and listener count
					</CardDescription>
				</CardHeader>

				<CardContent className="pt-6">
					<div className="space-y-4">
						{receptionTypeData.map((method, index) => (
							<div
								key={method.id}
								className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
							>
								<div className="flex items-center gap-4">
									<div
										className="h-4 w-4 rounded-full"
										style={{backgroundColor: `var(--chart-${(index % 4) + 1})` }} // prettier-ignore
									/>
									<div>
										<p className="font-medium">
											{method.label}
										</p>
										{/* prettier-ignore */}
										<p className="text-muted-foreground text-sm">
											{method.respondents.toLocaleString()} listeners
										</p>
									</div>
								</div>
								<div className="text-right">
									<p className="text-lg font-bold">
										{method.percentage.toFixed(1)}%
									</p>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
