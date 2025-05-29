"use client";

import Image from "next/image";
import {
	ExternalLink,
	Heart,
	PauseCircle,
	PlayCircle,
	Radio,
} from "lucide-react";

import { useAudioPlayer } from "@/lib/hooks/audio-player";
import { RadioStation } from "@/lib/types/radio";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface RadioStationCardProps {
	station: RadioStation;
}

// TODO: Handle favourite toggle with actual state (isFavourite, toggle handler)
// TODO: Show filled Heart icon and accessible label when station is already a favourite
// TODO: Add playback controls (play/pause icon overlay) when player state is integrated
// TODO: Fallback for station image if it fails to load

export function RadioStationCard({ station }: RadioStationCardProps) {
	const isFavourite = false; // Temporary placeholder for favourite state

	const { currentStation, isPlaying, setStation, togglePlayPause } =
		useAudioPlayer();
	const isCurrentStation = currentStation?.id === station.id;
	const handlePlayClick = () => {
		if (isCurrentStation) {
			togglePlayPause();
		} else {
			setStation(station);
		}
	};

	return (
		<Card className="group overflow-hidden pt-0 transition-all duration-300 hover:shadow-md">
			<div
				className="bg-muted relative aspect-[4/3] cursor-pointer overflow-hidden"
				onClick={handlePlayClick}
			>
				<Image
					src={station.image}
					alt={station.name}
					fill
					priority
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					className="object-cover transition-transform duration-500 group-hover:scale-105"
				/>

				<div
					className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
					aria-label={
						isPlaying && isCurrentStation
							? "Pause station"
							: "Play station"
					}
				>
					{isPlaying && isCurrentStation ? (
						<PauseCircle className="h-16 w-16 text-white" />
					) : (
						<PlayCircle className="h-16 w-16 text-white" />
					)}
				</div>
			</div>

			<CardContent className="p-4">
				<div className="flex items-start justify-between gap-2">
					<div>
						<div className="flex items-center gap-2">
							<Radio className="text-primary h-4 w-4" />
							<h3 className="truncate text-lg font-semibold">
								{station.name}
							</h3>
						</div>
						<p className="text-muted-foreground truncate text-sm">
							{station.location}
						</p>
					</div>

					<Button
						variant="ghost"
						size="icon"
						aria-label={
							isFavourite
								? "Remove from favourites"
								: "Add to favourites"
						}
						onClick={() => {}} // TODO: Implement toggle handler
						className={cn(
							"cursor-pointer",
							isFavourite && "text-red-500"
						)}
					>
						<Heart
							className="h-5 w-5 transition-transform duration-200"
							fill={isFavourite ? "currentColor" : "none"}
						/>
					</Button>
				</div>
			</CardContent>

			<CardFooter className="flex flex-wrap items-center justify-between gap-2 p-4 pt-0">
				<div className="flex flex-1 flex-wrap gap-2">
					{station.genres?.map((genre) => (
						<Badge
							key={genre}
							variant="outline"
							className="text-xs"
						>
							{genre}
						</Badge>
					))}
				</div>

				<Button
					variant="ghost"
					size="icon"
					asChild
					aria-label={`Open ${station.name} website`}
					className="h-8 w-8 p-0"
				>
					<a
						href={station.website}
						target="_blank"
						rel="noopener noreferrer"
					>
						<ExternalLink className="h-4 w-4" />
					</a>
				</Button>
			</CardFooter>
		</Card>
	);
}
