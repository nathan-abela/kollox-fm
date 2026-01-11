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
 * ReceptionDemographicsChart Component
 *
 * Displays demographic breakdown of radio reception platforms by age and gender.
 * Presents two grouped bar charts showing listener distribution across different
 * reception methods (Radio, Streaming, DAB+, TV) segmented by demographics.
 *
 * @param {Object} props - Component props.
 * @param {Survey} props.survey - The survey data containing reception type demographics.
 */
export function ReceptionDemographicsChart({ survey }: { survey: Survey }) {
	const receptionTypes = useMemo(
		() => survey?.receptionTypes ?? [],
		[survey?.receptionTypes]
	);

	// Transform age demographics data
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
				receptionTypes.map((rt) => [
					rt.shortLabel,
					rt.ageDemographics?.[key].count || 0,
				])
			),
		}));
	}, [receptionTypes]);

	// Transform gender demographics data
	const genderData = useMemo(() => {
		const genders = [
			{ label: "Male", key: "male" as const },
			{ label: "Female", key: "female" as const },
		];

		return genders.map(({ label, key }) => ({
			gender: label,
			...Object.fromEntries(
				receptionTypes.map((rt) => [
					rt.shortLabel,
					rt.genderDemographics?.[key].count || 0,
				])
			),
		}));
	}, [receptionTypes]);

	// Chart configuration
	const chartConfig: ChartConfig = useMemo(() => {
		const config: ChartConfig = {};
		receptionTypes.forEach((rt, index) => {
			config[rt.shortLabel] = {
				label: rt.label,
				color: `var(--chart-${(index % 4) + 1})`,
			};
		});
		return config;
	}, [receptionTypes]);

	return (
		<div className="grid grid-cols-1 gap-6">
			{/* Age Demographics */}
			<Card className="rounded-2xl shadow-md">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg font-semibold">
						<Users className="text-muted-foreground h-5 w-5" />
						Breakdown by Age Group
					</CardTitle>
					<CardDescription>
						Age distribution across reception methods
					</CardDescription>
				</CardHeader>

				<CardContent>
					<ChartContainer
						config={chartConfig}
						className="h-[400px] w-full"
					>
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={ageData}>
								<defs>
									<pattern
										id="age-dotted-bg"
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
									fill="url(#age-dotted-bg)"
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
								{receptionTypes.map((rt, index) => (
									<Bar
										key={rt.id}
										dataKey={rt.shortLabel}
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
						Breakdown by Gender
					</CardTitle>
					<CardDescription>
						Gender distribution across reception methods
					</CardDescription>
				</CardHeader>

				<CardContent>
					<ChartContainer
						config={chartConfig}
						className="h-[400px] w-full"
					>
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={genderData}>
								<defs>
									<pattern
										id="gender-dotted-bg"
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
									fill="url(#gender-dotted-bg)"
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
								{receptionTypes.map((rt, index) => (
									<Bar
										key={rt.id}
										dataKey={rt.shortLabel}
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
