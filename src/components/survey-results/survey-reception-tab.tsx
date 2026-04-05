import { Survey } from "@/lib/types/survey";
import { DabDemographicsChart } from "@/components/survey-results/charts/dab-demographics-chart";
import { DabOwnershipOverview } from "@/components/survey-results/charts/dab-ownership-overview";
import { ReceptionDemographicsChart } from "@/components/survey-results/charts/reception-demographics-chart";
import { ReceptionMethodsOverview } from "@/components/survey-results/charts/reception-methods-overview";

export function SurveyReceptionTab({ survey }: { survey: Survey }) {
	const hasReceptionTypes = survey.receptionTypes && survey.receptionTypes.length > 0; // prettier-ignore
	const hasDabOwnership = survey.dabOwnership && survey.dabOwnership.usage.length > 0; // prettier-ignore

	if (!hasReceptionTypes && !hasDabOwnership) {
		return (
			<div className="text-muted-foreground py-8 text-center">
				Reception data is not available for this survey year.
			</div>
		);
	}

	return (
		<>
			{/* Reception Methods (2019 onwards) */}
			{hasReceptionTypes && (
				<>
					{/* Reception Methods Overview */}
					<ReceptionMethodsOverview survey={survey} />

					{/* Reception Demographics by Platform */}
					<ReceptionDemographicsChart survey={survey} />
				</>
			)}

			{/* DAB+ Ownership (older surveys 2017-2019) */}
			{hasDabOwnership && (
				<>
					<DabOwnershipOverview dabOwnership={survey.dabOwnership!} />
					<DabDemographicsChart dabOwnership={survey.dabOwnership!} />
				</>
			)}
		</>
	);
}
