"use client";

import { RefObject } from "react";
import Link from "next/link";
import { X } from "lucide-react";

import { describeStation } from "@/lib/data/stations";
import { useAudioPlayer } from "@/lib/hooks/audio-player";
import { RadioStation } from "@/lib/types/radio";
import { Button } from "@/components/ui/button";
import {
	DrawerClose,
	DrawerDescription,
	DrawerTitle,
} from "@/components/ui/drawer";
import { Kbd } from "@/components/ui/kbd";
import { VolumeControl } from "@/components/layout/volume-control";
import { LiveBars } from "@/components/radio/live-bars";
import { PlaybackControls } from "@/components/radio/playback-controls";
import { SimilarStations } from "@/components/radio/similar-stations";
import { StationActions } from "@/components/radio/station-actions";
import { StationArtwork } from "@/components/radio/station-artwork";
import { StationBackdrop } from "@/components/radio/station-backdrop";

/**
 * Desktop content of the now-playing drawer: an open full-screen player on
 * the station's blurred artwork, with controls, volume, labelled actions and
 * shortcut hints, and similar stations in a column from `xl`. Meant to sit
 * open in the background while the station plays.
 */
export function NowPlayingDesktop({
	station,
	onClose,
	prevStation,
	nextStation,
	playButtonRef,
}: {
	station: RadioStation;
	onClose: () => void;
	prevStation: RadioStation | null;
	nextStation: RadioStation | null;
	playButtonRef: RefObject<HTMLButtonElement | null>;
}) {
	const { currentSong, isPlaying, isLoading, setStation } = useAudioPlayer();
	const isLive = isPlaying && !isLoading;
	const song = currentSong?.toLowerCase();
	const { subtitle, genres } = describeStation(station);

	return (
		<>
			<StationBackdrop station={station} className="h-full" />

			<div className="relative flex h-full flex-col overflow-y-auto px-8 pt-5 pb-8 lg:px-14">
				<div className="flex h-10 shrink-0 items-center gap-4">
					<Link
						href="/"
						onClick={onClose}
						className="text-lg font-bold"
					>
						Kollox FM
					</Link>
					<DrawerClose asChild>
						<Button
							variant="outline"
							size="icon"
							aria-label="Close now playing"
							className="ml-auto size-10 cursor-pointer rounded-full"
						>
							<X className="size-5" />
						</Button>
					</DrawerClose>
				</div>

				<div className="container mx-auto grid flex-1 content-center items-center gap-10 px-4 py-8 md:grid-cols-[auto_minmax(0,1fr)] lg:gap-14 lg:px-10 xl:grid-cols-[auto_minmax(0,1fr)_18rem] xl:gap-12 xl:px-4">
					<StationArtwork
						station={station}
						className="size-56 rounded-2xl shadow-2xl lg:size-72 xl:size-80"
						iconClassName="size-12"
					/>
					<div className="flex min-w-0 flex-col items-start gap-6">
						<div className="w-full min-w-0 space-y-1">
							<DrawerTitle className="text-4xl lg:text-5xl">
								{station.name}
							</DrawerTitle>
							{song && (
								<p className="text-lg font-medium text-balance capitalize">
									{song}
								</p>
							)}
							<DrawerDescription className="text-base">
								{subtitle}
							</DrawerDescription>
							{genres && (
								<p className="text-muted-foreground text-sm">
									{genres}
								</p>
							)}
							<LiveBars
								bars={40}
								active={isLive}
								className="mt-3 h-8 w-full max-w-md justify-between"
							/>
						</div>
						<PlaybackControls
							prevStation={prevStation}
							nextStation={nextStation}
							playButtonRef={playButtonRef}
						>
							<VolumeControl />
						</PlaybackControls>
						<StationActions
							station={station}
							onViewStation={onClose}
						/>
						<p className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
							<span>
								<Kbd>Space</Kbd> play / stop
							</span>
							<span>
								<Kbd>←</Kbd> <Kbd>→</Kbd> switch station
							</span>
							<span>
								<Kbd>F</Kbd> favourite
							</span>
							<span>
								<Kbd>M</Kbd> mute
							</span>
							<span>
								<Kbd>Esc</Kbd> close
							</span>
						</p>
					</div>
					<SimilarStations
						station={station}
						onPick={setStation}
						className="w-full md:col-span-2 xl:col-span-1"
					/>
				</div>
			</div>
		</>
	);
}
