import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
	Activity,
	ArrowRight,
	Calendar,
	RadioIcon,
	RadioTower,
	TrendingUp,
	Users,
} from "lucide-react";

import { stations } from "@/lib/data/stations";
import { Survey } from "@/lib/types/survey";
import { formatDate, formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface SurveyCardProps {
	survey: Survey;
	isLatest: boolean;
}

export function SurveyCard({ survey, isLatest }: SurveyCardProps) {
	const [imageErrorId, setImageErrorId] = useState<string | null>(null);
	const mostFollowed = survey.highlights?.mostFollowedStation;
	const station = stations.find(
		(s) => s.name.toLowerCase() === mostFollowed?.id.toLowerCase()
	);
	const stationLogo =
		imageErrorId === mostFollowed?.id || !station?.image ? (
			<div className="bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-md">
				<RadioTower className="h-5 w-5" />
			</div>
		) : (
			<Image
				src={station.image}
				alt={mostFollowed?.id ?? "Station Logo"}
				width={32}
				height={32}
				className="h-8 w-8 rounded-md object-cover"
				onError={() => setImageErrorId(mostFollowed?.id ?? null)}
			/>
		);

	return (
		<Link
			key={survey.meta.id}
			href={`/survey-results/${survey.meta.id}`}
			className="group block transition-all duration-200 hover:scale-[1.01]"
		>
			<Card
				className={`relative h-full overflow-hidden transition-all duration-200 hover:shadow-lg ${
					isLatest
						? "border-primary/30 ring-primary/20 ring-1"
						: "border-border hover:border-primary/30 shadow-sm"
				} `}
			>
				<div
					className={`absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100 ${isLatest ? "from-primary/8" : "from-primary/4"} `}
				/>
				<CardHeader className="relative pb-4">
					<div className="relative mb-4 flex items-center justify-between">
						<div
							className={`rounded-lg p-2 ${
								isLatest
									? "bg-primary/15 text-primary"
									: "bg-muted text-muted-foreground"
							} `}
						>
							<RadioIcon className="h-4 w-4" />
						</div>
						{isLatest && (
							<Badge className="bg-primary text-primary-foreground text-xs">
								Latest
							</Badge>
						)}
					</div>
					<CardTitle className="group-hover:text-primary mb-2 text-lg transition-colors">
						{survey.meta.title ||
							`Audience Survey ${survey.meta.id}`}
					</CardTitle>
					{survey.meta.weekOfAssessment && (
						<CardDescription>
							{survey.meta.weekOfAssessment}
						</CardDescription>
					)}
				</CardHeader>
				<CardContent className="relative space-y-4">
					{/* Key Metrics */}
					<div className="grid grid-cols-2 gap-4">
						{survey.meta.sampleSize && (
							<div className="flex items-center gap-2 text-sm">
								<Users className="text-muted-foreground h-4 w-4" />
								<div>
									<div className="text-foreground font-medium">
										{formatNumber(survey.meta.sampleSize)}
									</div>
									<div className="text-muted-foreground text-xs">
										Respondents
									</div>
								</div>
							</div>
						)}
						{survey.metrics?.populationListening && (
							<div className="flex items-center gap-2 text-sm">
								<TrendingUp className="text-muted-foreground h-4 w-4" />
								<div>
									<div className="text-foreground font-medium">
										{formatNumber(
											survey.metrics?.populationListening
										)}
									</div>
									<div className="text-muted-foreground text-xs">
										Radio Listeners
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Most Followed Station */}
					{mostFollowed && (
						<div
							className={`rounded-lg border p-3 ${isLatest ? "bg-primary/5" : "bg-muted/20"}`}
						>
							<div className="mb-2 flex items-center justify-between">
								<div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
									<Activity className="h-3 w-3" />
									Most Followed
								</div>
								{mostFollowed.mostFollowedPct && (
									<span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
										{mostFollowed.mostFollowedPct}%
									</span>
								)}
							</div>
							<div className="flex items-center gap-2">
								{stationLogo}
								<div>
									<div className="text-foreground text-sm font-semibold">
										{mostFollowed.id}
									</div>
									{mostFollowed.mostFollowedPct && (
										<div className="text-muted-foreground text-xs">
											Audience share
										</div>
									)}
								</div>
							</div>
						</div>
					)}

					{/* Survey Published Date */}
					<div className="flex items-center justify-between border-t pt-4">
						<div className="text-muted-foreground flex items-center gap-1.5 text-xs">
							<Calendar className="h-3 w-3" />
							{formatDate(survey.meta.publishedAt) ||
								survey.meta.id}
						</div>
						<ArrowRight className="text-muted-foreground group-hover:text-primary h-3.5 w-3.5 transition-all group-hover:translate-x-0.5" />
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
