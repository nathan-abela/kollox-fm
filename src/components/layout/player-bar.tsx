"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
	ExternalLink,
	Loader2,
	Pause,
	Play,
	SkipBack,
	SkipForward,
	Volume1,
	Volume2,
	VolumeX,
} from "lucide-react";

import { useAudioPlayer } from "@/lib/hooks/audio-player";
import { RadioStation } from "@/lib/types/radio";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

// TODO: Consider removing progress bar & progress component
// TODO: Handle loading state for audio better - check Vibe due to high loading time

/**
 * Renders a fixed player bar at the bottom of the screen, displaying the current radio station information,
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

	const [progress, setProgress] = useState(0);

	const handleNextStation = () => {
		if (!currentStation) return;
		// prettier-ignore
		const nextIdx = getRelativeStationIndex(currentStation.id, stationsOrder, 1);
		if (nextIdx === null) return;
		setStation(stationsOrder[nextIdx]);
	};

	const handlePrevStation = () => {
		if (!currentStation) return;
		// prettier-ignore
		const prevIdx = getRelativeStationIndex(currentStation.id, stationsOrder, -1);
		if (prevIdx === null) return;
		setStation(stationsOrder[prevIdx]);
	};

	useEffect(() => {
		if (!isPlaying || !currentStation) return;

		const interval = setInterval(() => {
			setProgress((prev) => (prev >= 100 ? 0 : prev + 0.1));
		}, 100);
		return () => clearInterval(interval);
	}, [isPlaying, currentStation]);

	if (!currentStation) {
		return null;
	}

	return (
		<div className="bg-card fixed right-0 bottom-0 left-0 z-40 border-t px-6 py-4">
			<div className="container mx-auto">
				<div className="grid grid-cols-3 items-center gap-4">
					{/* Station Info */}
					<div className="flex min-w-0 items-center gap-4">
						<div className="bg-muted relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md">
							<Image
								src={currentStation.image}
								alt={currentStation.name}
								fill
								className="object-cover"
							/>
						</div>
						<div className="min-w-0 max-[425px]:hidden">
							<h4 className="truncate font-medium">
								{currentStation.name}
							</h4>
							<p className="text-muted-foreground truncate text-sm">
								{currentStation.location}
							</p>
						</div>
					</div>

					{/* Playback Controls */}
					<div className="flex flex-col items-center justify-center">
						<div className="flex items-center gap-4">
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										onClick={handlePrevStation}
										aria-label="Previous station"
										className="cursor-pointer"
										disabled={isLoading}
									>
										<SkipBack className="h-5 w-5" />
									</Button>
								</TooltipTrigger>
								<TooltipContent side="top">
									Previous station
								</TooltipContent>
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
										aria-label="Next station"
										className="cursor-pointer"
										disabled={isLoading}
									>
										<SkipForward className="h-5 w-5" />
									</Button>
								</TooltipTrigger>
								<TooltipContent side="top">
									Next station
								</TooltipContent>
							</Tooltip>
						</div>

						{/* Progress bar hidden on mobile */}
						<Progress
							value={progress}
							className="mt-3 hidden h-1 w-full md:block"
						/>
					</div>

					{/* Volume & Actions */}
					<div className="flex min-w-0 items-center justify-end gap-4">
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

						<div className="flex min-w-[100px] items-center gap-2 max-[600px]:hidden md:min-w-[140px]">
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
								className="w-16 cursor-pointer md:w-24"
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
