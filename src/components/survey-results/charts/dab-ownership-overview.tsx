"use client";

import { useMemo } from "react";
import { ChartPie, Radio } from "lucide-react";
import { Cell, LabelList, Pie, PieChart, ResponsiveContainer } from "recharts";

import type { DabOwnership } from "@/lib/types/survey";
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

interface DabOwnershipOverviewProps {
	dabOwnership: DabOwnership;
}

/**
 * DabOwnershipOverview Component
 *
 * Displays an overview of DAB+ radio ownership and usage patterns among survey respondents.
 * Includes a summary card showing overall ownership percentage and total owners
 * - Left: Pie chart showing the distribution of usage patterns among DAB+ owners.
 * - Right: Detailed list of usage patterns among DAB+ owners.
 *
 * @param {Object} props - Component props.
 * @param {DabOwnership} props.dabOwnership - The DAB ownership data from the survey, including ownership percentage, total owners, and usage breakdown.
 */
export function DabOwnershipOverview({
	dabOwnership,
}: DabOwnershipOverviewProps) {
	const usageData = useMemo(() => {
		if (!dabOwnership.usage.length) return [];

		return dabOwnership.usage
			.filter((u) => u.respondents > 0)
			.sort((a, b) => b.respondents - a.respondents)
			.map((u, index) => ({
				...u,
				fill: `var(--chart-${(index % 4) + 1})`,
			}));
	}, [dabOwnership.usage]);

	const chartConfig: ChartConfig = useMemo(() => {
		return usageData.reduce(
			(config, dataPoint) => ({
				...config,
				[dataPoint.id]: {
					label: dataPoint.label,
					color: dataPoint.fill,
				},
			}),
			{ respondents: { label: "Listeners" } } as ChartConfig
		);
	}, [usageData]);

	return (
		<>
			{/* Ownership Summary */}
			<Card className="rounded-2xl shadow-md">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg font-semibold">
						<Radio className="text-muted-foreground h-5 w-5" />
						DAB+ Radio Ownership
					</CardTitle>
					<CardDescription>
						Percentage of respondents who own a DAB+ radio. This
						survey focused on DAB+ ownership rather than reception
						methods which is available in newer surveys.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-baseline gap-2">
						<span className="text-4xl font-bold">
							{dabOwnership.ownershipPct}%
						</span>
						<span className="text-muted-foreground">
							({dabOwnership.totalOwners.toLocaleString()} owners)
						</span>
					</div>
				</CardContent>
			</Card>

			{/* Usage Breakdown */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Pie Chart */}
				<Card className="rounded-2xl shadow-md">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg font-semibold">
							<ChartPie className="text-muted-foreground h-5 w-5" />
							DAB+ Usage Patterns
						</CardTitle>
						<CardDescription>
							How DAB+ owners use their radios
						</CardDescription>
					</CardHeader>

					<CardContent className="flex-1">
						<ChartContainer
							config={chartConfig}
							className="mx-auto"
						>
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<defs>
										<pattern
											id="dab-dotted-bg"
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
										fill="url(#dab-dotted-bg)"
									/>
									<ChartTooltip
										content={
											<ChartTooltipContent
												hideLabel
												formatter={(
													_value,
													_,
													item
												) => (
													<div className="flex items-center gap-2">
														<span className="font-medium">
															{
																item.payload
																	.shortLabel
															}
														</span>
														<span className="text-muted-foreground">
															{item.payload.respondents.toLocaleString()}{" "}
															listeners
														</span>
													</div>
												)}
											/>
										}
									/>
									<Pie
										data={usageData}
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
											formatter={(value: number) =>
												`${value.toFixed(1)}%`
											}
										/>
										{usageData.map((entry) => (
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

				{/* Usage Details List */}
				<Card className="rounded-2xl shadow-md">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg font-semibold">
							<Radio className="text-muted-foreground h-5 w-5" />
							Usage Breakdown
						</CardTitle>
						<CardDescription>
							Content preferences among DAB+ owners
						</CardDescription>
					</CardHeader>

					<CardContent className="pt-6">
						<div className="space-y-4">
							{usageData.map((usage, index) => (
								<div
									key={usage.id}
									className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
								>
									<div className="flex items-center gap-4">
										<div
											className="h-4 w-4 rounded-full"
											style={{
												backgroundColor: `var(--chart-${(index % 4) + 1})`,
											}}
										/>
										<div>
											<p className="font-medium">
												{usage.label}
											</p>
											<p className="text-muted-foreground text-sm">
												{usage.respondents.toLocaleString()}{" "}
												listeners
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="text-lg font-bold">
											{usage.percentage.toFixed(1)}%
										</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
