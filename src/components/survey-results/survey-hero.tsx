import Link from "next/link";
import { Activity, ArrowRight, BarChart3 } from "lucide-react";

interface SurveyHeroProps {
	latestSurveyId?: string;
}

export function SurveyHero({ latestSurveyId }: SurveyHeroProps) {
	return (
		<div className="bg-background/60 border-muted mb-8 border-b backdrop-blur-sm">
			<div className="container mx-auto px-4 py-8 md:py-12">
				<div className="mx-auto max-w-3xl space-y-8">
					<section className="space-y-4 text-center">
						<div className="flex justify-center">
							<div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
								<BarChart3 className="text-primary-foreground h-6 w-6" />
							</div>
						</div>
						<h1 className="text-3xl font-bold md:text-4xl">
							Radio Survey Results
						</h1>
						<p className="text-muted-foreground text-lg">
							Comprehensive audience survey results from the
							Broadcasting Authority of Malta. Explore detailed
							analytics, listener preferences, and broadcasting
							trends across Malta&apos;s radio landscape.
						</p>
						{latestSurveyId && (
							<div className="mt-6 flex justify-center">
								<Link
									href={`/survey-results/${latestSurveyId}`}
									className="group bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-medium transition-all hover:gap-3"
								>
									<Activity className="h-4 w-4" />
									View Latest Results
									<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</div>
						)}
					</section>
				</div>
			</div>
		</div>
	);
}
