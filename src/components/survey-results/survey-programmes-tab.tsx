"use client";

import { Survey } from "@/lib/types/survey";
import { SurveyTopProgrammes } from "@/components/survey-results/survey-top-programmes";

export function SurveyProgrammesTab({ survey }: { survey: Survey }) {
	const allProgrammes = survey.programmes || [];

	if (!allProgrammes.length) {
		return (
			<div className="text-muted-foreground py-8 text-center">
				Programmes data coming soon...
			</div>
		);
	}

	return (
		<>
			{/* Top 3 Programmes */}
			<SurveyTopProgrammes programmes={allProgrammes} />
		</>
	);
}
