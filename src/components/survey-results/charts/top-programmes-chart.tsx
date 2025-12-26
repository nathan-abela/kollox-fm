"use client";

import { useMemo } from "react";
import { Mic2 } from "lucide-react";
import {
	Bar,
	BarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import { Survey } from "@/lib/types/survey";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProgrammeTooltipProps {
	active?: boolean;
	payload?: {
		value: number;
		payload: {
			programme: string;
			station: string;
			percentage: number;
			totalRespondents: number;
		};
	}[];
}

const ProgrammeTooltip = ({ active, payload }: ProgrammeTooltipProps) => {
	if (!active || !payload?.length) return null;

	const data = payload[0].payload;

	return (
		<div className="bg-popover z-50 rounded-md border px-3 py-2 shadow-md">
			<p className="text-foreground text-xs font-medium">
				{data.programme}
			</p>
			<p className="text-muted-foreground text-xs">
				{data.station || "N/A"}
			</p>
			<p className="text-muted-foreground text-xs">
				{data.percentage.toFixed(1)}% preference
			</p>
			<p className="text-muted-foreground text-xs">
				{data.totalRespondents} respondents
			</p>
		</div>
	);
};

export function TopProgrammesChart({ survey }: { survey: Survey }) {
	const topProgrammesData = useMemo(() => {
		if (!survey?.programmes) return [];

		// Filter out "No preferred programme" and get top 15
		const programmes = survey.programmes.filter(
			(p) => p.id !== "no-preferred-programme"
		);

		const sortedProgrammes = programmes
			.sort((a, b) => b.percentage - a.percentage)
			.slice(0, 15);

		return sortedProgrammes.map((p) => ({
			programme: p.name,
			station: p.station,
			percentage: p.percentage,
			totalRespondents: p.totalRespondents,
		}));
	}, [survey]);

	return (
		<Card className="rounded-2xl shadow-md">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg font-semibold">
					<Mic2 className="text-muted-foreground h-5 w-5" />
					Top 15 Radio Programmes
				</CardTitle>
				<p className="text-muted-foreground text-sm">
					Most preferred programmes by listener preference
				</p>
			</CardHeader>

			<CardContent className="pt-2">
				<div className="h-[620px] w-full">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={topProgrammesData}
							layout="vertical"
							margin={{
								top: 20,
								right: 30,
								left: 10,
								bottom: 20,
							}}
							barCategoryGap="12%"
						>
							{/* Light dotted background */}
							<defs>
								<pattern
									id="programmes-dotted-bg"
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
								fill="url(#programmes-dotted-bg)"
							/>

							<XAxis
								type="number"
								allowDecimals={true}
								tick={{
									fill: "var(--muted-foreground)",
									fontSize: 12,
								}}
								tickFormatter={(v) => `${v}%`}
								domain={[0, "dataMax"]}
								label={{
									value: "Preference %",
									position: "insideBottom",
									offset: -5,
								}}
							/>
							<YAxis
								type="category"
								dataKey="programme"
								tickLine={false}
								axisLine={false}
								width={250}
								tick={{
									fill: "var(--muted-foreground)",
									fontSize: 12,
								}}
							/>
							<Tooltip
								cursor={{ fill: "transparent" }}
								content={<ProgrammeTooltip />}
							/>
							<Bar
								dataKey="percentage"
								radius={[0, 6, 6, 0]}
								activeBar={{ fill: "var(--chart-2)" }}
								fill="var(--chart-1)"
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
				<p className="text-muted-foreground text-xs italic">
					Based on {survey.meta.sampleRadioListeners.toLocaleString()}{" "}
					respondents who are radio listeners.
				</p>
			</CardContent>
		</Card>
	);
}
