"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
	ArrowLeft,
	ExternalLink,
	Heart,
	Loader2,
	MapPin,
	Mic,
	Pause,
	Play,
	RadioTower,
	Trophy,
	Users,
} from "lucide-react";

import { stations } from "@/lib/data/stations";
import {
	getAllSurveys,
	getLatestSurvey,
	getRankedStations,
	getStationSurveyHistory,
	getStationSurveyRank,
} from "@/lib/data/surveys";
import { useAudioPlayer } from "@/lib/hooks/audio-player";
import { useFavourites } from "@/lib/hooks/use-favourites";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	FacebookIcon,
	InstagramIcon,
	TikTokIcon,
	YouTubeIcon,
} from "@/components/icons/social";
import { RadioStationList } from "@/components/radio/radio-station-list";
import { MostFollowedTrendChart } from "@/components/survey-results/charts/most-followed-trend-chart";
import { SurveyMetricCard } from "@/components/survey-results/survey-metric-card";

/** Survey estimates come from ~1,500 respondents, so show them to the nearest thousand */
const roundToThousands = (count: number) =>
	(Math.round(count / 1000) * 1000).toLocaleString("en-GB");
/** Listener estimate for display, counts that would round to zero read "Under 1,000" instead */
const formatListeners = (count: number) =>
	count < 500 ? "Under 1,000" : `≈${roundToThousands(count)}`;

/** Sub-line for the rank tile: how the station moved since the previous survey */
// TODO: "Up/Down from #N in YYYY" is a placeholder, replace the plain string with a better visual/wording for rank movement
function describeRankChange(
	rank: number,
	previousRank: number | null,
	previousYear: string
) {
	if (previousRank == null) return `Not ranked in ${previousYear}`;
	if (rank < previousRank)
		return `Up from #${previousRank} in ${previousYear}`;
	if (rank > previousRank)
		return `Down from #${previousRank} in ${previousYear}`;
	return `Unchanged from ${previousYear}`;
}

export default function StationPage() {
	const params = useParams();
	const stationId = params.id as string;
	const station = stations.find((s) => s.id === stationId);

	const {
		currentStation,
		isPlaying,
		isLoading,
		setStation,
		togglePlayPause,
	} = useAudioPlayer();

	const [imageError, setImageError] = useState(false);
	const { isFavourite, toggleFavourite } = useFavourites();

	if (!station) {
		notFound();
	}

	const isCurrentStation = currentStation?.id === station.id;
	const favourited = isFavourite(station.id);
	const handlePlayClick = () => {
		if (isCurrentStation) {
			togglePlayPause();
		} else {
			setStation(station);
		}
	};

	const latestSurvey = getLatestSurvey();
	const latestSurveyYear = latestSurvey?.meta.id;

	const surveys = getAllSurveys();
	const previousSurvey = surveys[1];
	const surveyHistory = getStationSurveyHistory(station.id);
	// Two editions make a before/after, not a trend, and the rank tile already shows that movement
	const showTrend = surveyHistory.filter((entry) => entry.rank != null).length >= 3; // prettier-ignore
	const surveysLed = surveys.filter(
		(s) => s.highlights?.mostFollowedStation?.id === station.id
	).length;
	const latestSurveyRow = latestSurvey?.stations?.find(
		(s) => s.id === station.id
	);
	const rankedStationCount = latestSurvey
		? getRankedStations(latestSurvey).length
		: 0;
	const latestSurveyRank = latestSurvey
		? getStationSurveyRank(latestSurvey, station.id)
		: null;
	const previousSurveyRank = previousSurvey
		? getStationSurveyRank(previousSurvey, station.id)
		: null;
	const totalRadioListeners = latestSurvey?.metrics?.totalRadioListeners;

	// Get top 3 popular shows for this station from the latest survey
	// prettier-ignore
	const popularShows = latestSurvey?.programmes
		?.filter((p) => p.station === station.name)
		.slice(0, 3) || [];

	// prettier-ignore
	const similarStations = stations
		.filter((s) => {
			if (s.id === station.id) return false;
			if (s.isEnabled === false) return false;
			const sharedGenres = s.genres?.filter((g) => station.genres?.includes(g)) || [];
			return sharedGenres.length > 0;
		})
		.sort((a, b) => {
			const aShared = a.genres?.filter((g) => station.genres?.includes(g)).length || 0;
			const bShared = b.genres?.filter((g) => station.genres?.includes(g)).length || 0;
			return bShared - aShared;
		})
		.slice(0, 5);

	const sharedGenres = station.genres?.length
		? new Intl.ListFormat("en-GB", { type: "disjunction" }).format(
				station.genres
			)
		: null;

	return (
		<div>
			{/* Hero with blurred background */}
			<div className="relative overflow-hidden">
				{/* Blurred background image */}
				{!imageError && (
					<div className="absolute inset-0">
						<Image
							src={station.image}
							alt={station.name + " logo"}
							fill
							className="scale-110 object-cover blur-3xl"
							aria-hidden="true"
						/>
						<div className="from-background/90 via-background/60 to-background absolute inset-0 bg-gradient-to-b" />
					</div>
				)}

				<div className="relative container mx-auto px-4 py-6 md:py-10">
					<div className="mb-6 flex items-center justify-between gap-4">
						<Link
							href="/"
							className="text-muted-foreground hover:text-foreground inline-flex shrink-0 items-center gap-2 text-sm transition-colors"
						>
							<ArrowLeft className="h-4 w-4" />
							<span className="hidden sm:inline">
								Back to all stations
							</span>
							<span className="sm:hidden">Back</span>
						</Link>
						{latestSurveyRank && latestSurveyYear && (
							<Button variant="outline" size="sm" asChild>
								{/* prettier-ignore */}
								<Link href={`/survey-results/${latestSurveyYear}`}>
									<Trophy className="h-4 w-4 text-yellow-500" />
									<span className="hidden sm:inline">
										#{latestSurveyRank} in {latestSurveyYear} Audience Survey
									</span>
									<span className="sm:hidden">
										#{latestSurveyRank} in {latestSurveyYear}
									</span>
								</Link>
							</Button>
						)}
					</div>

					{/* Station Info Row */}
					<div className="flex flex-col gap-6 sm:flex-row sm:items-center">
						{/* Station Image */}
						<div className="relative mx-auto h-40 w-40 shrink-0 overflow-hidden rounded-xl shadow-2xl sm:mx-0 sm:h-48 sm:w-48">
							{imageError ? (
								<div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center">
									<RadioTower className="h-16 w-16" />
								</div>
							) : (
								<Image
									src={station.image}
									alt={station.name + " logo"}
									fill
									priority
									className="object-cover"
									onError={() => setImageError(true)}
								/>
							)}
						</div>

						{/* Station Details */}
						<div className="flex-1 text-center sm:text-left">
							<h1 className="mb-1 text-3xl font-bold md:text-4xl lg:text-5xl">
								{station.name}
							</h1>

							<div className="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:justify-start">
								{station.fmFrequency && (
									<span className="font-mono text-lg font-medium">
										{station.fmFrequency} FM
									</span>
								)}
								<span className="text-muted-foreground flex items-center gap-1 text-sm">
									<MapPin className="h-4 w-4" />
									{station.location}
								</span>
							</div>

							<div className="mb-4 flex flex-wrap justify-center gap-2 sm:justify-start">
								{station.genres?.map((genre) => (
									<Badge
										key={genre}
										variant="secondary"
										className="text-xs"
									>
										{genre}
									</Badge>
								))}
							</div>

							{/* Actions */}
							<div className="flex flex-wrap justify-center gap-3 sm:justify-start">
								<Button
									size="lg"
									onClick={handlePlayClick}
									className="cursor-pointer gap-2"
								>
									{isCurrentStation && isLoading ? (
										<>
											<Loader2 className="h-5 w-5 animate-spin" />
											Loading...
										</>
									) : isCurrentStation && isPlaying ? (
										<>
											<Pause className="h-5 w-5" />
											Pause
										</>
									) : (
										<>
											<Play className="h-5 w-5" />
											Listen Live
										</>
									)}
								</Button>

								<Button
									variant="outline"
									size="lg"
									asChild
									className="gap-2"
								>
									<a
										href={station.website}
										target="_blank"
										rel="noopener noreferrer"
									>
										<ExternalLink className="h-4 w-4" />
										Official Website
									</a>
								</Button>

								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="outline"
											size="icon"
											onClick={() =>
												toggleFavourite(station.id)
											}
											aria-pressed={favourited}
											aria-label={
												favourited
													? "Remove from favourites"
													: "Add to favourites"
											}
											className="h-10 w-10 cursor-pointer"
										>
											<Heart
												className={
													favourited
														? "h-5 w-5 fill-current text-red-500"
														: "h-5 w-5"
												}
											/>
										</Button>
									</TooltipTrigger>
									<TooltipContent side="top">
										{favourited
											? "Remove from favourites"
											: "Add to favourites"}
									</TooltipContent>
								</Tooltip>
							</div>

							{station.socials && (
								<div className="mt-4 flex justify-center gap-2 sm:justify-start">
									{station.socials.facebook && (
										<Button
											variant="ghost"
											size="icon"
											asChild
											className="h-9 w-9"
										>
											<a
												href={station.socials.facebook}
												target="_blank"
												rel="noopener noreferrer"
												aria-label="Facebook"
											>
												<FacebookIcon className="h-5 w-5" />
											</a>
										</Button>
									)}
									{station.socials.instagram && (
										<Button
											variant="ghost"
											size="icon"
											asChild
											className="h-9 w-9"
										>
											<a
												href={station.socials.instagram}
												target="_blank"
												rel="noopener noreferrer"
												aria-label="Instagram"
											>
												<InstagramIcon className="h-5 w-5" />
											</a>
										</Button>
									)}
									{station.socials.tiktok && (
										<Button
											variant="ghost"
											size="icon"
											asChild
											className="h-9 w-9"
										>
											<a
												href={station.socials.tiktok}
												target="_blank"
												rel="noopener noreferrer"
												aria-label="TikTok"
											>
												<TikTokIcon className="h-5 w-5" />
											</a>
										</Button>
									)}
									{station.socials.youtube && (
										<Button
											variant="ghost"
											size="icon"
											asChild
											className="h-9 w-9"
										>
											<a
												href={station.socials.youtube}
												target="_blank"
												rel="noopener noreferrer"
												aria-label="YouTube"
											>
												<YouTubeIcon className="h-5 w-5" />
											</a>
										</Button>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Audience */}
			{latestSurvey && latestSurveyRank && latestSurveyRow && (
				<div className="container mx-auto px-4 py-8">
					<div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
						<h2 className="text-lg font-semibold">Audience</h2>
						<a
							href={latestSurvey.meta.rawSourcePath}
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground hover:text-foreground text-sm underline"
						>
							Broadcasting Authority Audience Survey{" "}
							{latestSurveyYear}
						</a>
					</div>
					{/* prettier-ignore */}
					<div className={cn("grid gap-3", showTrend && "lg:grid-cols-3")}> 
						{showTrend && (
							<MostFollowedTrendChart
								stationName={station.name}
								history={surveyHistory}
								note={
									surveysLed > 0
										? `Most followed station in ${surveysLed} of ${surveys.length} surveys.`
										: undefined
								}
								className="lg:col-span-2"
							/>
						)}
						{/* Tiles sit beside the chart on desktop and pair up below it otherwise; without a chart they pair up at every width */}
						<div className={cn("grid gap-3 sm:grid-cols-2", showTrend && "lg:grid-cols-1")}> {/* prettier-ignore */}
							<SurveyMetricCard
								icon={Trophy}
								title={`${latestSurveyYear} survey rank`}
								value={
									<>
										#{latestSurveyRank}{" "}
										<span className="text-muted-foreground text-lg font-semibold">
											of {rankedStationCount}
										</span>
									</>
								}
								subtitle={
									previousSurvey
										? describeRankChange(
												latestSurveyRank,
												previousSurveyRank,
												previousSurvey.meta.id
											)
										: `${latestSurveyYear} survey`
								}
								tooltip={`Position among the ${rankedStationCount} stations ranked in the ${latestSurveyYear} survey by the share of listeners who follow them most`}
							/>
							{latestSurveyRow.mostFollowedPct != null && (
								<SurveyMetricCard
									icon={Users}
									title={`Follow ${station.name} most`}
									value={`${latestSurveyRow.mostFollowedPct.toFixed(1)}%`}
									subtitle={
										latestSurveyRow.stationListeners !=
											null && totalRadioListeners != null
											? `${formatListeners(latestSurveyRow.stationListeners)} of about ${roundToThousands(totalRadioListeners)} radio listeners`
											: `Of radio listeners in the ${latestSurveyYear} survey`
									}
									tooltip={`Share of respondents who named ${station.name} as the station they follow most, scaled to Malta's radio-listening population`}
								/>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Popular Shows */}
			{popularShows.length > 0 && (
				<div className="container mx-auto px-4 py-8">
					<h2 className="mb-4 text-lg font-semibold">
						Popular Shows
					</h2>
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{popularShows.map((show) => (
							<Card key={show.id} className="min-w-0 py-4">
								<CardContent className="flex items-center gap-3">
									<div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
										<Mic className="text-primary h-5 w-5" />
									</div>
									<div className="min-w-0 flex-1">
										<p
											className="truncate font-medium"
											title={show.name}
										>
											{show.name}
										</p>
										{/* prettier-ignore */}
										<p className="text-muted-foreground text-sm">
											Preferred by {show.percentage}% of listeners
										</p>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
					{/* prettier-ignore */}
					<p className="text-muted-foreground mt-3 text-xs">
						Source:{" "}
						<a
							href={latestSurvey?.meta.rawSourcePath}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-foreground underline"
						>
							Broadcasting Authority Audience Survey {latestSurveyYear}
						</a>
					</p>
				</div>
			)}

			{/* Similar Stations */}
			{similarStations.length > 0 && (
				<div className="container mx-auto px-4 py-8">
					<div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
						<h2 className="text-lg font-semibold">
							Similar Stations
						</h2>
						{sharedGenres && (
							<p className="text-muted-foreground text-sm">
								Stations that also play {sharedGenres}
							</p>
						)}
					</div>
					<RadioStationList
						stations={similarStations}
						isFavourite={isFavourite}
						onToggleFavourite={toggleFavourite}
					/>
				</div>
			)}
		</div>
	);
}
