import { Info } from "lucide-react";

import { Survey } from "@/lib/types/survey";
import { formatPeriodWeek } from "@/lib/utils";

export function SurveyInfo({ survey }: { survey: Survey }) {
	const population = survey.metrics?.populationListening ?? null;
	const peak = survey.highlights?.peakTimeband ?? null;
	const mostFollowed = survey.highlights?.mostFollowedStation ?? null;

	return (
		<div className="bg-muted/50 mt-6 flex items-start gap-2 rounded-lg border p-4">
			<Info className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
			<div className="text-muted-foreground text-sm">
				<p className="mb-2 font-medium">Data Source & Methodology</p>
				<p className="mb-2">
					Official audience assessments available at{" "}
					<a
						href="https://ba.org.mt/audience-assessments"
						target="_blank"
						rel="noopener noreferrer"
						className="text-primary underline"
					>
						Broadcasting Authority of Malta
					</a>
					.
				</p>
				<ul className="list-inside list-disc space-y-1">
					{/* prettier-ignore */}
					<li>
						<strong>Week of Assessment: </strong>
						{formatPeriodWeek(survey.meta.periodStart, survey.meta.periodEnd)}
					</li>
					{/* prettier-ignore */}
					<li>
						<strong>Sample Size: </strong>
						{survey.meta.sampleSize.toLocaleString()} participants
						({survey.meta.sampleRadioListeners.toLocaleString()} radio listeners)
					</li>
					<li>
						<strong>Key Findings: </strong>
						{mostFollowed
							? `${mostFollowed.id} most followed (${mostFollowed.mostFollowedPct ?? "-"}%)`
							: "-"}
					</li>
					<li>
						<strong>Peak Listening Time: </strong>
						{peak?.timeband ?? "-"}
						{peak?.listeners
							? ` (≈${peak.listeners.toLocaleString()} listeners)`
							: ""}
					</li>
					{/* prettier-ignore */}
					<li>
						Results represent Malta population aged 12+, amounting to
						<strong> {population?.toLocaleString() ?? "-"} </strong>radio listeners
					</li>
				</ul>
			</div>
		</div>
	);
}
