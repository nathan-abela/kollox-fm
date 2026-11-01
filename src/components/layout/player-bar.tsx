"use client";

import { MouseEvent, useRef, useState } from "react";
import Link from "next/link";
import {
	ChevronUp,
	ExternalLink,
	Loader2,
	Maximize2,
	Pause,
	Play,
	SkipBack,
	SkipForward,
} from "lucide-react";

import { useAudioPlayer } from "@/lib/hooks/audio-player";
import { RadioStation } from "@/lib/types/radio";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { NowPlayingDrawer } from "@/components/layout/now-playing-drawer";
import { VolumeControl } from "@/components/layout/volume-control";
import { StationArtwork } from "@/components/radio/station-artwork";
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
 * - Station info with image, name, and location. Below `md` the whole block opens the now-playing drawer.
 * - Playback controls: previous, play/pause, next.
 * - From `md`: expand button for the now-playing drawer, external link to the station's website, volume control.
 */
export function PlayerBar() {
	const {
		currentStation,
		currentSong,
		isPlaying,
		isLoading,
		stationsOrder,
		setStation,
		togglePlayPause,
	} = useAudioPlayer();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const drawerOpenerRef = useRef<HTMLElement | null>(null);

	const openDrawer = (e: MouseEvent<HTMLElement>) => {
		drawerOpenerRef.current = e.currentTarget;
		setDrawerOpen(true);
	};

	if (!currentStation) {
		return null;
	}

	// prettier-ignore
	const prevIdx = getRelativeStationIndex(currentStation.id, stationsOrder, -1);
	// prettier-ignore
	const nextIdx = getRelativeStationIndex(currentStation.id, stationsOrder, 1);
	const prevStation = prevIdx === null ? null : stationsOrder[prevIdx];
	const nextStation = nextIdx === null ? null : stationsOrder[nextIdx];

	const songOrLocation = currentSong?.toLowerCase() ?? currentStation.location; // prettier-ignore

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
			<NowPlayingDrawer
				open={drawerOpen}
				onOpenChange={setDrawerOpen}
				returnFocusRef={drawerOpenerRef}
				prevStation={prevStation}
				nextStation={nextStation}
			/>
			<div className="container mx-auto">
				{/* Two columns below md (station text, controls); three from md with a mirrored actions column that centres the controls */}
				<div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
					{/* Station Info: opens the drawer below md, links to the station page from md */}
					<button
						type="button"
						onClick={openDrawer}
						aria-haspopup="dialog"
						aria-expanded={drawerOpen}
						className="focus-visible:ring-ring/50 flex min-w-0 cursor-pointer items-center gap-3 rounded-md text-left outline-none focus-visible:ring-[3px] sm:gap-4 md:hidden"
					>
						<StationArtwork
							station={currentStation}
							className="size-12 rounded-md sm:size-14"
						/>
						<div className="min-w-0 flex-1">
							<div className="truncate font-medium">
								{currentStation.name}
							</div>
							<ScrollingText
								text={songOrLocation}
								className="text-muted-foreground text-sm capitalize"
							/>
						</div>
						<ChevronUp className="text-muted-foreground size-5 shrink-0" />
					</button>
					<div className="hidden min-w-0 items-center gap-4 md:flex">
						<StationArtwork
							station={currentStation}
							className="size-14 rounded-md"
						/>
						<div className="min-w-0">
							<Link
								href={`/station/${currentStation.id}`}
								className="hover:text-primary block truncate font-medium transition-colors"
							>
								{currentStation.name}
							</Link>
							<ScrollingText
								text={songOrLocation}
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

					{/* Expand, website link and volume, md and up only */}
					<div className="hidden min-w-0 items-center justify-end gap-4 md:flex">
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									onClick={openDrawer}
									aria-haspopup="dialog"
									aria-expanded={drawerOpen}
									aria-label="Now playing"
									className="size-10 cursor-pointer"
								>
									<Maximize2 className="h-5 w-5" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="top">
								Now playing
							</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									asChild
									aria-label={`Open ${currentStation.name} website`}
									className="size-10 cursor-pointer"
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

						<VolumeControl />
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
