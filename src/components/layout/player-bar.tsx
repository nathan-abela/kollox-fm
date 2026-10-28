"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
	ExternalLink,
	Loader2,
	Pause,
	Play,
	RadioTower,
	SkipBack,
	SkipForward,
	Volume1,
	Volume2,
	VolumeX,
} from "lucide-react";

import { useAudioPlayer } from "@/lib/hooks/audio-player";
import { RadioStation } from "@/lib/types/radio";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { StationPreview } from "@/components/radio/station-preview";
import { ScrollingText } from "@/components/scrolling-text";

/**
 * Renders a player bar pinned to the bottom of the screen, displaying the current radio station information,
 * playback controls (play/pause, previous, next), and volume controls.
 *
 * The component uses the `useAudioPlayer` hook to access the current station, playback state, and toggle play/pause functionality.
 * It also displays station details, including an image, name, and location.
 *
 * Features:
 * - Station info with image, name, and location.
 * - Playback controls: previous, play/pause, next.
 * - External link to the station's website.
 * - Volume control slider and mute button.
 */
export function PlayerBar() {
	const {
		currentStation,
		currentSong,
		isPlaying,
		isLoading,
		volume,
		isMuted,
		stationsOrder,
		setStation,
		togglePlayPause,
		setVolume,
		toggleMute,
	} = useAudioPlayer();

	// State to handle image loading failure
	const [imageError, setImageError] = useState(false);

	useEffect(() => {
		setImageError(false);
	}, [currentStation?.image]);

	if (!currentStation) {
		return null;
	}

	// prettier-ignore
	const prevIdx = getRelativeStationIndex(currentStation.id, stationsOrder, -1);
	// prettier-ignore
	const nextIdx = getRelativeStationIndex(currentStation.id, stationsOrder, 1);
	const prevStation = prevIdx === null ? null : stationsOrder[prevIdx];
	const nextStation = nextIdx === null ? null : stationsOrder[nextIdx];

	const handlePrevStation = () => {
		if (prevStation) setStation(prevStation);
	};

	const handleNextStation = () => {
		if (nextStation) setStation(nextStation);
	};

	return (
		<div
			data-player-bar
			className="bg-card sticky bottom-0 z-40 flex h-[calc(var(--player-bar-height)+env(safe-area-inset-bottom))] items-center border-t px-4 pb-[env(safe-area-inset-bottom)] sm:px-6"
		>
			<div className="container mx-auto">
				{/* Two columns below md (station text, controls); three from md with a mirrored actions column that centres the controls */}
				<div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
					{/* Station Info */}
					<div className="flex min-w-0 items-center gap-3 sm:gap-4">
						<div className="bg-muted relative h-12 w-12 shrink-0 overflow-hidden rounded-md sm:h-14 sm:w-14">
							{imageError ? (
								<div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center">
									<RadioTower className="h-5 w-5" />
								</div>
							) : (
								<Image
									src={currentStation.image}
									alt={currentStation.name}
									fill
									className="object-cover"
									onError={() => setImageError(true)}
								/>
							)}
						</div>
						<div className="min-w-0">
							<Link
								href={`/station/${currentStation.id}`}
								className="hover:text-primary block truncate font-medium transition-colors"
							>
								{currentStation.name}
							</Link>
							<ScrollingText
								text={
									currentSong?.toLowerCase() ??
									currentStation.location
								}
								className="text-muted-foreground text-sm capitalize"
							/>
						</div>
					</div>

					{/* Playback Controls */}
					<div className="flex flex-col items-center justify-center">
						<div className="flex items-center gap-2 sm:gap-4">
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										onClick={handlePrevStation}
										aria-label={
											prevStation
												? `Previous station: ${prevStation.name}`
												: "Previous station"
										}
										className="size-10 cursor-pointer"
										disabled={isLoading}
									>
										<SkipBack className="h-5 w-5" />
									</Button>
								</TooltipTrigger>
								<SkipPreview
									station={prevStation}
									label="Previous station"
									tilt="left"
								/>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										size="icon"
										onClick={togglePlayPause}
										className="h-11 w-11 cursor-pointer rounded-full"
										aria-label={
											isPlaying ? "Pause" : "Play"
										}
										disabled={isLoading}
									>
										{isLoading ? (
											<Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
										) : isPlaying ? (
											<Pause className="h-5 w-5" />
										) : (
											<Play className="h-5 w-5" />
										)}
									</Button>
								</TooltipTrigger>
								<TooltipContent side="top">
									{isLoading
										? "Loading..."
										: isPlaying
											? "Pause"
											: "Play"}
								</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										onClick={handleNextStation}
										aria-label={
											nextStation
												? `Next station: ${nextStation.name}`
												: "Next station"
										}
										className="size-10 cursor-pointer"
										disabled={isLoading}
									>
										<SkipForward className="h-5 w-5" />
									</Button>
								</TooltipTrigger>
								<SkipPreview
									station={nextStation}
									label="Next station"
									tilt="right"
								/>
							</Tooltip>
						</div>
					</div>

					{/* Website link and volume, md and up only */}
					<div className="hidden min-w-0 items-center justify-end gap-4 md:flex">
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									asChild
									aria-label={`Open ${currentStation.name} website`}
									className="cursor-pointer"
								>
									<a
										href={currentStation.website}
										target="_blank"
										rel="noopener noreferrer"
									>
										<ExternalLink className="h-5 w-5" />
									</a>
								</Button>
							</TooltipTrigger>
							<TooltipContent side="top">
								Visit {currentStation.name}
							</TooltipContent>
						</Tooltip>

						<div className="flex min-w-[140px] items-center gap-2">
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										onClick={toggleMute}
										aria-label={isMuted ? "Unmute" : "Mute"}
										className="cursor-pointer"
									>
										{volume === 0 || isMuted ? (
											<VolumeX className="h-5 w-5" />
										) : volume < 40 ? (
											<Volume1 className="h-5 w-5" />
										) : (
											<Volume2 className="h-5 w-5" />
										)}
									</Button>
								</TooltipTrigger>
								<TooltipContent side="top">
									{isMuted || volume === 0
										? "Unmute"
										: "Mute"}
								</TooltipContent>
							</Tooltip>
							<Slider
								value={[isMuted ? 0 : volume]}
								max={100}
								step={1}
								onValueChange={(value) => setVolume(value[0])}
								className="w-24 cursor-pointer"
								aria-label="Volume control"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * Skip-button tooltip: a preview of the station the skip would land on,
 * falling back to a plain label when there is nothing to skip to.
 */
function SkipPreview({
	station,
	label,
	tilt,
}: {
	station: RadioStation | null;
	label: string;
	tilt: "left" | "right";
}) {
	if (!station) {
		return <TooltipContent side="top">{label}</TooltipContent>;
	}

	return (
		<TooltipContent
			side="top"
			sideOffset={8}
			showArrow={false}
			className="bg-transparent p-0"
		>
			<StationPreview station={station} tilt={tilt} />
		</TooltipContent>
	);
}

/**
 * Returns the index of the next station in the list based on the current station ID and direction.
 * If the current station is not found, returns null.
 *
 * @param currentId - The ID of the current station.
 * @param stations - The list of radio stations.
 * @param direction - 1 for next, -1 for previous.
 * @returns The index of the next station or null if not found.
 */
function getRelativeStationIndex(
	currentId: string,
	stations: RadioStation[],
	direction: 1 | -1
): number | null {
	const idx = stations.findIndex((s) => s.id === currentId);
	if (idx === -1) return null;
	return (idx + direction + stations.length) % stations.length;
}
