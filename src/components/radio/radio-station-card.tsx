"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
	ExternalLink,
	Heart,
	Loader2,
	PauseCircle,
	Pin,
	PlayCircle,
	Radio,
	RadioTower,
} from "lucide-react";

import { useAudioPlayer } from "@/lib/hooks/audio-player";
import { RadioStation } from "@/lib/types/radio";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface RadioStationCardProps {
	station: RadioStation;
	isFavourite: boolean;
	onToggleFavourite: () => void;
}

// TODO: Consider adding station social links (Facebook, Instagram) if available

export function RadioStationCard({
	station,
	isFavourite,
	onToggleFavourite,
}: RadioStationCardProps) {
	const {
		currentStation,
		isPlaying,
		isLoading,
		setStation,
		togglePlayPause,
	} = useAudioPlayer();
	const isCurrentStation = currentStation?.id === station.id;
	const handlePlayClick = () => {
		if (isCurrentStation) {
			togglePlayPause();
		} else {
			setStation(station);
		}
	};

	// State to handle image loading failure
	const [imageError, setImageError] = useState(false);

	return (
		<Card className="group overflow-hidden pt-0 pb-4 transition-all duration-300 hover:shadow-md">
			<div
				className="bg-muted relative aspect-[4/3] cursor-pointer overflow-hidden"
				onClick={handlePlayClick}
			>
				{imageError ? (
					<div className="text-muted-foreground flex h-full w-full flex-col items-center justify-center gap-1">
						<RadioTower className="h-5 w-5" />
						<span className="w-full truncate text-center text-lg font-semibold">
							{station.name}
						</span>
					</div>
				) : (
					<Image
						src={station.image}
						alt={station.name}
						fill
						priority
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						className="object-cover transition-transform duration-500 group-hover:scale-105"
						onError={() => setImageError(true)}
					/>
				)}

				<div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-2">
					{station.isFeatured && (
						<Badge
							variant="secondary"
							className="flex animate-pulse items-center gap-1 bg-yellow-500 font-semibold text-black shadow-lg dark:bg-yellow-400"
						>
							<Pin className="rotate-45 fill-current" />
							Featured
						</Badge>
					)}

					{station.fmFrequency && (
						<Badge
							variant="secondary"
							className="font-semibold shadow-md backdrop-blur-sm dark:bg-black/70"
						>
							{station.fmFrequency} FM
						</Badge>
					)}
				</div>

				<div
					className={cn(
						"absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300",
						isCurrentStation && isLoading
							? "opacity-100" // always show loader while loading
							: "opacity-0 group-hover:opacity-100" // show loader on hover otherwise
					)}
					aria-label={
						isCurrentStation
							? isLoading
								? "Loading station"
								: isPlaying
									? "Pause station"
									: "Play station"
							: "Play station"
					}
				>
					{isCurrentStation && isLoading ? (
						<Loader2 className="h-12 w-12 animate-spin text-white" />
					) : isCurrentStation && isPlaying ? (
						<PauseCircle className="h-16 w-16 text-white" />
					) : (
						<PlayCircle className="h-16 w-16 text-white" />
					)}
				</div>

				{isCurrentStation && (
					<div className="absolute top-2 left-2 z-10">
						<Badge
							variant="secondary"
							className={cn(
								"font-semibold text-white shadow-md backdrop-blur-sm",
								isLoading
									? "bg-yellow-500/80"
									: isPlaying
										? "bg-green-500/80"
										: "bg-blue-500/80"
							)}
						>
							{isLoading
								? "Loading..."
								: isPlaying
									? "Playing"
									: "Idle"}
						</Badge>
					</div>
				)}
			</div>

			<CardContent className="p-4">
				<div className="flex items-start justify-between gap-2">
					<div className="min-w-0 flex-1">
						<div className="flex min-w-0 items-center gap-2">
							<Radio className="text-primary h-4 w-4" />
							<h3 className="min-w-0 truncate text-lg font-semibold">
								<Link
									href={`/station/${station.id}`}
									className="hover:text-primary transition-colors"
									onClick={(e) => e.stopPropagation()}
								>
									{station.name}
								</Link>
							</h3>
							{/* Metadata indicator */}
							{station?.metadata?.isEnabled && (
								<Tooltip>
									<TooltipTrigger asChild>
										<div
											className="h-2 w-2 animate-pulse cursor-help rounded-full bg-purple-500"
											aria-label="Live Metadata"
										/>
									</TooltipTrigger>
									<TooltipContent side="top">
										Live song information available
									</TooltipContent>
								</Tooltip>
							)}
						</div>
						<p className="text-muted-foreground truncate text-sm">
							{station.location}
						</p>
					</div>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								aria-label={
									isFavourite
										? "Remove from favourites"
										: "Add to favourites"
								}
								onClick={onToggleFavourite}
								className={cn(
									"shrink-0 cursor-pointer transition-colors duration-200",
									isFavourite
										? "text-red-500"
										: "text-gray-400 hover:text-red-500"
								)}
							>
								<Heart
									className="h-5 w-5"
									fill={isFavourite ? "currentColor" : "none"}
								/>
							</Button>
						</TooltipTrigger>
						<TooltipContent side="top">
							{isFavourite
								? "Remove from favourites"
								: "Add to favourites"}
						</TooltipContent>
					</Tooltip>
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

				<Tooltip>
					<TooltipTrigger asChild>
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
					</TooltipTrigger>
					<TooltipContent side="top">
						Visit {station.name}
					</TooltipContent>
				</Tooltip>
			</CardFooter>
		</Card>
	);
}
