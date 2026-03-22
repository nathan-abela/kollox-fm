"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
	ArrowLeft,
	ExternalLink,
	Loader2,
	MapPin,
	Mic,
	Pause,
	Play,
	RadioTower,
	Trophy,
} from "lucide-react";

import { stations } from "@/lib/data/stations";
import { getLatestSurvey } from "@/lib/data/surveys";
import { useAudioPlayer } from "@/lib/hooks/audio-player";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
	const [similarImageErrors, setSimilarImageErrors] = useState<Set<string>>(new Set()); // prettier-ignore

	if (!station) {
		notFound();
	}

	const isCurrentStation = currentStation?.id === station.id;
	const handlePlayClick = () => {
		if (isCurrentStation) {
			togglePlayPause();
		} else {
			setStation(station);
		}
	};

	const latestSurvey = getLatestSurvey();
	const latestSurveyYear = latestSurvey?.meta.id;

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
		.slice(0, 6);

	const handleSimilarImageError = (id: string) => {
		setSimilarImageErrors((prev) => new Set(prev).add(id));
	};

	return (
		<div>
			{/* Hero with blurred background */}
			<div className="relative overflow-hidden">
				{/* Blurred background image */}
				{!imageError && (
					<div className="absolute inset-0">
						<Image
							src={station.image}
							alt=""
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
						{station.surveyRank && latestSurveyYear && (
							<Button variant="outline" size="sm" asChild>
								{/* prettier-ignore */}
								<Link href={`/survey-results/${latestSurveyYear}`}>
									<Trophy className="h-4 w-4 text-yellow-500" />
									<span className="hidden sm:inline">
										#{station.surveyRank} in {latestSurveyYear} Audience Survey
									</span>
									<span className="sm:hidden">
										#{station.surveyRank} in {latestSurveyYear}
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
									alt={station.name}
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
									<span className="text-primary text-lg font-semibold">
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
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Popular Shows */}
			{popularShows.length > 0 && (
				<div className="container mx-auto px-4 py-8">
					<h2 className="mb-4 text-lg font-semibold">
						Popular Shows
					</h2>
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{popularShows.map((show) => (
							<Card key={show.id} className="py-4">
								<CardContent className="flex items-center gap-3">
									<div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
										<Mic className="text-primary h-5 w-5" />
									</div>
									<div className="min-w-0 flex-1">
										<p className="truncate font-medium">
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
					<h2 className="mb-4 text-lg font-semibold">
						Similar Stations
					</h2>
					<div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
						{similarStations.map((similar) => (
							<Link
								key={similar.id}
								href={`/station/${similar.id}`}
								className="group block"
							>
								<div className="relative aspect-square overflow-hidden rounded-lg shadow-md transition-shadow group-hover:shadow-lg">
									{similarImageErrors.has(similar.id) ? (
										<div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center">
											<RadioTower className="h-6 w-6" />
										</div>
									) : (
										<Image
											src={similar.image}
											alt={similar.name}
											fill
											className="object-cover transition-opacity group-hover:opacity-90"
											onError={() => handleSimilarImageError(similar.id)} // prettier-ignore
										/>
									)}
								</div>
								<p className="group-hover:text-primary mt-2 truncate text-center text-sm font-medium transition-colors">
									{similar.name}
								</p>
								{similar.fmFrequency && (
									<p className="text-muted-foreground text-center text-xs">
										{similar.fmFrequency} FM
									</p>
								)}
							</Link>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
