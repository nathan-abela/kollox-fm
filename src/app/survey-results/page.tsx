"use client";

import { FileText } from "lucide-react";

import { getAllSurveys, getLatestSurvey } from "@/lib/data/surveys";
import { SurveyCard } from "@/components/survey-results/survey-card";
import { SurveyHero } from "@/components/survey-results/survey-hero";

export default function SurveyResults() {
	const surveys = getAllSurveys();
	const latestSurvey = getLatestSurvey();

	return (
		<section>
			<SurveyHero latestSurveyId={latestSurvey?.meta.id} />

			<div className="container mx-auto px-4 pb-12">
				<div className="mb-10">
					<h2 className="mb-3 text-2xl font-bold">
						Available Surveys
					</h2>
					<p className="text-muted-foreground">
						Browse through audience surveys results, each providing
						valuable insights into Malta&apos;s radio broadcasting
						landscape.
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{surveys.map((survey, index) => (
						<SurveyCard
							key={survey.meta.id}
							survey={survey}
							isLatest={index === 0}
						/>
					))}
				</div>

				{surveys.length === 0 && (
					<div className="py-8 text-center">
						<div className="bg-muted mx-auto mb-4 w-fit rounded-full p-4">
							<FileText className="text-muted-foreground h-6 w-6" />
						</div>
						<h3 className="mb-2 text-xl font-semibold">
							No Surveys Available
						</h3>
						<p className="text-muted-foreground">
							Survey reports will appear here once they become
							available.
						</p>
					</div>
				)}
			</div>
		</section>
	);
}
