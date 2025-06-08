"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
	ExternalLink,
	Pause,
	Play,
	SkipBack,
	SkipForward,
	Volume1,
	Volume2,
	VolumeX,
} from "lucide-react";

import { stations } from "@/lib/data/stations";
import { useAudioPlayer } from "@/lib/hooks/audio-player";
import { RadioStation } from "@/lib/types/radio";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";

// TODO: Add tooltip for volume control
// TODO: Consider removing progress bar & progress component

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
 * - Volume control slider and mute button (UI only, not yet implemented).
 *
 * @param stationsOrder - Optional. An array of radio stations in the order currently shown in the UI (e.g., popularity/ name). If not provided, falls back to the default stations order (ID).
 */
export function PlayerBar({
	stationsOrder = stations,
}: {
	stationsOrder?: RadioStation[];
}) {
	const {
		currentStation,
		isPlaying,
		volume,
		isMuted,
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
							<Button
								variant="ghost"
								size="icon"
								onClick={handlePrevStation}
								aria-label="Previous station"
								className="cursor-pointer"
							>
								<SkipBack className="h-5 w-5" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={togglePlayPause}
								className="h-11 w-11 cursor-pointer rounded-full"
								aria-label={isPlaying ? "Pause" : "Play"}
							>
								{isPlaying ? (
									<Pause className="h-5 w-5" />
								) : (
									<Play className="h-5 w-5" />
								)}
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={handleNextStation}
								aria-label="Next station"
								className="cursor-pointer"
							>
								<SkipForward className="h-5 w-5" />
							</Button>
						</div>

						{/* Progress bar hidden on mobile */}
						<Progress
							value={progress}
							className="mt-3 hidden h-1 w-full md:block"
						/>
					</div>

					{/* Volume & Actions */}
					<div className="flex min-w-0 items-center justify-end gap-4">
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

						<div className="flex min-w-[100px] items-center gap-2 max-[600px]:hidden md:min-w-[140px]">
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
