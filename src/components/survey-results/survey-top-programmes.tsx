import { TrendingUp, Users } from "lucide-react";

import { ProgrammeSummary } from "@/lib/types/survey";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NO_PREFERENCE_ID = "no-preferred-programme";

export function SurveyTopProgrammes({
	programmes,
}: {
	programmes: ProgrammeSummary[];
}) {
	const noPreferredProgramme = programmes.find(
		(p) => p.id === NO_PREFERENCE_ID
	);

	const topThreeProgrammes = programmes
		.filter((p) => p.id !== NO_PREFERENCE_ID)
		.sort((a, b) => b.percentage - a.percentage)
		.slice(0, 3);

	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
			<Card className="rounded-2xl shadow-md md:col-span-3">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg font-semibold">
						<TrendingUp className="text-muted-foreground h-5 w-5" />
						Top Radio Programmes
					</CardTitle>
				</CardHeader>

				<CardContent className="space-y-4">
					{topThreeProgrammes.map((programme, index) => (
						<div
							key={programme.id}
							className="bg-muted/30 hover:bg-muted/50 flex items-center gap-4 rounded-lg border p-4 transition-colors"
						>
							<div
								className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
									index === 0
										? "bg-yellow-500/20 text-yellow-600 dark:bg-yellow-500/30 dark:text-yellow-400"
										: index === 1
											? "bg-slate-400/20 text-slate-600 dark:bg-slate-400/30 dark:text-slate-400"
											: "bg-amber-600/20 text-amber-700 dark:bg-amber-600/30 dark:text-amber-500"
								}`}
							>
								{index + 1}
							</div>
							<div className="min-w-0 flex-1">
								<p className="truncate font-semibold">
									{programme.name || "N/A"}
								</p>
								<p className="text-muted-foreground text-sm">
									{programme.station || "N/A"}
								</p>
							</div>
							<div className="text-right">
								<p className="text-lg font-bold">
									{programme.percentage?.toFixed(1) ?? 0}%
								</p>
								{/* prettier-ignore */}
								<p className="text-muted-foreground text-sm">
									{programme.totalRespondents?.toLocaleString() ?? 0} votes
								</p>
							</div>
						</div>
					))}
				</CardContent>
			</Card>

			{noPreferredProgramme && (
				<Card className="flex items-center justify-center rounded-2xl shadow-md">
					<CardContent className="flex flex-col items-center justify-center p-8 text-center">
						<div className="bg-muted/40 mb-4 flex h-16 w-16 items-center justify-center rounded-full shadow-sm">
							<Users className="text-muted-foreground h-8 w-8" />
						</div>
						<Badge variant="secondary" className="mb-3">
							No Preference
						</Badge>
						<p className="mb-2 text-4xl font-bold">
							{noPreferredProgramme.percentage?.toFixed(1) ?? 0}%
						</p>
						{/* prettier-ignore */}
						<p className="text-muted-foreground text-sm">
							{noPreferredProgramme.totalRespondents?.toLocaleString() ?? 0} respondents
						</p>

						<div className="bg-muted my-4 h-px w-16" />

						{noPreferredProgramme.genderDemographics && (
							<div className="flex gap-6">
								<div className="text-center">
									<p className="text-muted-foreground text-xs">
										Male
									</p>
									{/* prettier-ignore */}
									<p className="text-lg font-semibold">
									{noPreferredProgramme.genderDemographics.male?.percentage?.toFixed(1) ?? 0}%
								</p>
								</div>
								<div className="text-center">
									<p className="text-muted-foreground text-xs">
										Female
									</p>
									{/* prettier-ignore */}
									<p className="text-lg font-semibold">
										{noPreferredProgramme.genderDemographics.female?.percentage?.toFixed(1) ?? 0}%
									</p>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
