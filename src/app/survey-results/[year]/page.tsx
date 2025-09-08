import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getAllSurveys, getSurveyById } from "@/lib/data/surveys";
import { Button } from "@/components/ui/button";
import SurveyResults from "@/components/survey-results/survey-results";

export async function generateStaticParams() {
	return getAllSurveys()
		.filter((s) => getSurveyById(s.meta.id))
		.map((s) => ({ year: s.meta.id }));
}

export default async function SurveyPage({
	params,
}: {
	params: Promise<{ year: string }>;
}) {
	const { year } = await params;
	const survey = getSurveyById(year);

	if (!survey) {
		return (
			<div className="container mx-auto p-6">
				<h1 className="text-xl font-bold">Survey not found</h1>
			</div>
		);
	}

	const surveys = getAllSurveys();
	const index = surveys.findIndex((s) => s.meta.id === year);
	const prev = index < surveys.length - 1 ? surveys[index + 1] : null;
	const next = index > 0 ? surveys[index - 1] : null;

	return (
		<div>
			<SurveyResults survey={survey} />

			{surveys.length > 1 && (
				<div className="container mx-auto flex justify-between border-t px-4 py-8">
					{prev ? (
						<Button asChild variant="outline" className="text-sm">
							<Link href={`/survey-results/${prev.meta.id}`}>
								<ChevronLeft className="mr-2 h-4 w-4" />
								{prev.meta.id} Survey
							</Link>
						</Button>
					) : (
						<span />
					)}

					{next ? (
						<Button
							asChild
							variant="outline"
							className="ml-auto text-sm"
						>
							<Link href={`/survey-results/${next.meta.id}`}>
								{next.meta.id} Survey
								<ChevronRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					) : (
						<span />
					)}
				</div>
			)}
		</div>
	);
}
