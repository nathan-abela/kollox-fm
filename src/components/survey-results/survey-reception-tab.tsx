import { Survey } from "@/lib/types/survey";
import { ReceptionMethodsOverview } from "@/components/survey-results/charts/reception-methods-overview";

export function SurveyReceptionTab({ survey }: { survey: Survey }) {
	if (!survey.receptionTypes || survey.receptionTypes.length === 0) {
		return (
			<div className="text-muted-foreground py-8 text-center">
				No reception data available.
			</div>
		);
	}

	return (
		<>
			{/* Reception Methods Overview: Pie Chart + Details List */}
			<ReceptionMethodsOverview survey={survey} />
		</>
	);
}
