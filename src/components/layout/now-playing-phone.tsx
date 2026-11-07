"use client";

import { RefObject } from "react";
import { ChevronDown, Maximize2 } from "lucide-react";

import { describeStation } from "@/lib/data/stations";
import { useAudioPlayer } from "@/lib/hooks/audio-player";
import { RadioStation } from "@/lib/types/radio";
import { Button } from "@/components/ui/button";
import {
	DrawerClose,
	DrawerDescription,
	DrawerTitle,
} from "@/components/ui/drawer";
import { FavouriteButton } from "@/components/radio/favourite-button";
import { LiveBars } from "@/components/radio/live-bars";
import { PlaybackControls } from "@/components/radio/playback-controls";
import { SimilarStations } from "@/components/radio/similar-stations";
import { StationActions } from "@/components/radio/station-actions";
import { StationArtwork } from "@/components/radio/station-artwork";
import { StationBackdrop } from "@/components/radio/station-backdrop";
import { ScrollingText } from "@/components/scrolling-text";

/**
 * Phone content of the now-playing drawer. The half sheet shows artwork,
 * station, an on-air card and the controls, the full view adds large
 * artwork on a blurred backdrop and similar stations at the bottom.
 */
export function NowPlayingPhone({
	station,
	full,
	onExpand,
	onClose,
	prevStation,
	nextStation,
	playButtonRef,
}: {
	station: RadioStation;
	/** Whether the sheet is at its full snap point */
	full: boolean;
	onExpand: () => void;
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
			{/* Full view only, so the half sheet's buttons keep their contrast */}
			{full && <StationBackdrop station={station} className="h-[70%]" />}

			<div className="relative flex h-full flex-col overflow-y-auto px-4 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:px-6">
				<div className="relative flex h-10 shrink-0 items-center">
					<div
						aria-hidden="true"
						className="bg-muted-foreground/30 absolute inset-x-0 top-0 mx-auto h-1.5 w-12 rounded-full"
					/>
					{full ? (
						<DrawerClose asChild>
							<Button
								variant="ghost"
								size="icon"
								aria-label="Close now playing"
								className="size-10 cursor-pointer"
							>
								<ChevronDown className="size-6" />
							</Button>
						</DrawerClose>
					) : (
						<Button
							variant="ghost"
							size="icon"
							onClick={onExpand}
							aria-label="Full view"
							className="ml-auto size-10 cursor-pointer"
						>
							<Maximize2 className="size-5" />
						</Button>
					)}
				</div>

				{full ? (
					<div className="flex flex-1 flex-col items-center gap-4 py-2 text-center">
						<StationArtwork
							station={station}
							className="size-[clamp(8rem,calc(100dvh-35rem),18rem)] rounded-xl shadow-xl"
							iconClassName="size-12"
						/>
						<div className="flex w-full min-w-0 flex-col items-center gap-6">
							<div className="w-full min-w-0 space-y-1">
								<DrawerTitle className="text-2xl">
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
									className="mt-3 h-8 w-full justify-between"
								/>
							</div>
							<PlaybackControls
								prevStation={prevStation}
								nextStation={nextStation}
								playButtonRef={playButtonRef}
							>
								<FavouriteButton
									station={station}
									className="size-12 rounded-full"
								/>
							</PlaybackControls>
							<StationActions
								station={station}
								onViewStation={onClose}
							/>
						</div>
						<SimilarStations
							station={station}
							onPick={setStation}
							className="mt-auto w-full"
						/>
					</div>
				) : (
					<div className="flex flex-col items-center gap-4 py-2">
						<div className="flex w-full items-center gap-4">
							<StationArtwork
								station={station}
								className="size-16 rounded-xl"
							/>
							<div className="min-w-0 flex-1 space-y-0.5 text-left">
								<DrawerTitle className="truncate text-xl">
									{station.name}
								</DrawerTitle>
								<DrawerDescription className="truncate">
									{subtitle}
								</DrawerDescription>
								{genres && (
									<p className="text-muted-foreground truncate text-sm">
										{genres}
									</p>
								)}
							</div>
						</div>
						<div className="bg-card w-full rounded-xl border p-4">
							<p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
								{isLive
									? "On air now"
									: isLoading
										? "Loading"
										: "Stopped"}
							</p>
							{song && (
								<ScrollingText
									text={song}
									className="mt-1 font-medium capitalize"
								/>
							)}
							<LiveBars
								bars={40}
								active={isLive}
								className="mt-3 h-8 w-full justify-between"
							/>
						</div>
						<PlaybackControls
							prevStation={prevStation}
							nextStation={nextStation}
							playButtonRef={playButtonRef}
						>
							<FavouriteButton
								station={station}
								className="size-12 rounded-full"
							/>
						</PlaybackControls>
						<StationActions
							station={station}
							onViewStation={onClose}
						/>
					</div>
				)}
			</div>
		</>
	);
}
