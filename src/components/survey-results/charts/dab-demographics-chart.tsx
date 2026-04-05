"use client";

import { useMemo } from "react";
import { Users } from "lucide-react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";

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

interface DabDemographicsChartProps {
	dabOwnership: DabOwnership;
}

export function DabDemographicsChart({
	dabOwnership,
}: DabDemographicsChartProps) {
	const usage = dabOwnership.usage;

	const ageData = useMemo(() => {
		const ageGroups = [
			{ label: "12-20", key: "age12to20" as const },
			{ label: "21-30", key: "age21to30" as const },
			{ label: "31-40", key: "age31to40" as const },
			{ label: "41-50", key: "age41to50" as const },
			{ label: "51-60", key: "age51to60" as const },
			{ label: "61-70", key: "age61to70" as const },
			{ label: "71+", key: "age71plus" as const },
		];

		return ageGroups.map(({ label, key }) => ({
			ageGroup: label,
			...Object.fromEntries(
				usage.map((u) => [
					u.shortLabel,
					u.ageDemographics?.[key].count || 0,
				])
			),
		}));
	}, [usage]);

	const genderData = useMemo(() => {
		const genders = [
			{ label: "Male", key: "male" as const },
			{ label: "Female", key: "female" as const },
		];

		return genders.map(({ label, key }) => ({
			gender: label,
			...Object.fromEntries(
				usage.map((u) => [
					u.shortLabel,
					u.genderDemographics?.[key].count || 0,
				])
			),
		}));
	}, [usage]);

	const chartConfig: ChartConfig = useMemo(() => {
		const config: ChartConfig = {};
		usage.forEach((u, index) => {
			config[u.shortLabel] = {
				label: u.label,
				color: `var(--chart-${(index % 4) + 1})`,
			};
		});
		return config;
	}, [usage]);

	return (
		<div className="grid grid-cols-1 gap-6">
			{/* Age Demographics */}
			<Card className="rounded-2xl shadow-md">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg font-semibold">
						<Users className="text-muted-foreground h-5 w-5" />
						DAB+ Usage by Age Group
					</CardTitle>
					<CardDescription>
						Age distribution of DAB+ content preferences
					</CardDescription>
				</CardHeader>

				<CardContent>
					<ChartContainer
						config={chartConfig}
						className="h-[280px] w-full sm:h-[340px] md:h-[400px]"
					>
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={ageData}>
								<defs>
									<pattern
										id="dab-age-dotted-bg"
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
									fill="url(#dab-age-dotted-bg)"
								/>
								<CartesianGrid
									strokeDasharray="3 3"
									className="stroke-muted"
								/>
								<XAxis
									dataKey="ageGroup"
									className="text-muted-foreground text-xs"
								/>
								<YAxis className="text-muted-foreground text-xs" />
								<ChartTooltip
									content={<ChartTooltipContent />}
								/>
								<Legend
									wrapperStyle={{ paddingTop: "20px" }}
									iconType="circle"
								/>
								{usage.map((u, index) => (
									<Bar
										key={u.id}
										dataKey={u.shortLabel}
										fill={`var(--chart-${(index % 4) + 1})`}
										radius={[4, 4, 0, 0]}
									/>
								))}
							</BarChart>
						</ResponsiveContainer>
					</ChartContainer>
				</CardContent>
			</Card>

			{/* Gender Demographics */}
			<Card className="rounded-2xl shadow-md">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg font-semibold">
						<Users className="text-muted-foreground h-5 w-5" />
						DAB+ Usage by Gender
					</CardTitle>
					<CardDescription>
						Gender distribution of DAB+ content preferences
					</CardDescription>
				</CardHeader>

				<CardContent>
					<ChartContainer
						config={chartConfig}
						className="h-[280px] w-full sm:h-[340px] md:h-[400px]"
					>
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={genderData}>
								<defs>
									<pattern
										id="dab-gender-dotted-bg"
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
									fill="url(#dab-gender-dotted-bg)"
								/>
								<CartesianGrid
									strokeDasharray="3 3"
									className="stroke-muted"
								/>
								<XAxis
									dataKey="gender"
									className="text-muted-foreground text-xs"
								/>
								<YAxis className="text-muted-foreground text-xs" />
								<ChartTooltip
									content={<ChartTooltipContent />}
								/>
								<Legend
									wrapperStyle={{ paddingTop: "20px" }}
									iconType="circle"
								/>
								{usage.map((u, index) => (
									<Bar
										key={u.id}
										dataKey={u.shortLabel}
										fill={`var(--chart-${(index % 4) + 1})`}
										radius={[4, 4, 0, 0]}
									/>
								))}
							</BarChart>
						</ResponsiveContainer>
					</ChartContainer>
				</CardContent>
			</Card>
		</div>
	);
}
