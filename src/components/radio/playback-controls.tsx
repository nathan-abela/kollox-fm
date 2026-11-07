"use client";

import { ReactNode, RefObject } from "react";
import {
	Loader2,
	Play,
	Shuffle,
	SkipBack,
	SkipForward,
	Square,
} from "lucide-react";

import { useAudioPlayer } from "@/lib/hooks/audio-player";
import { RadioStation } from "@/lib/types/radio";
import { Button } from "@/components/ui/button";

/**
 * Random station, previous, play/stop and next, with `children` after
 * them (volume on desktop, favourite on phones). Below `md` the row is a
 * `1fr auto 1fr` grid so play stays on the centre line; from `md` it is a
 * plain row.
 */
export function PlaybackControls({
	prevStation,
	nextStation,
	playButtonRef,
	children,
}: {
	prevStation: RadioStation | null;
	nextStation: RadioStation | null;
	playButtonRef: RefObject<HTMLButtonElement | null>;
	children?: ReactNode;
}) {
	const {
		isPlaying,
		isLoading,
		setStation,
		playRandomStation,
		togglePlayPause,
	} = useAudioPlayer();

	return (
		<div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4 md:flex md:w-auto md:gap-6">
			<div className="flex items-center justify-end gap-2 sm:gap-4 md:contents">
				<Button
					variant="outline"
					size="icon"
					onClick={playRandomStation}
					aria-label="Random station"
					className="size-12 cursor-pointer rounded-full"
					disabled={isLoading}
				>
					<Shuffle className="size-5" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => prevStation && setStation(prevStation)}
					aria-label={
						prevStation
							? `Previous station: ${prevStation.name}`
							: "Previous station"
					}
					className="size-12 cursor-pointer"
					disabled={isLoading}
				>
					<SkipBack className="size-6" />
				</Button>
			</div>
			<Button
				ref={playButtonRef}
				size="icon"
				onClick={togglePlayPause}
				aria-label={isPlaying ? "Stop" : "Play"}
				className="size-16 cursor-pointer rounded-full"
				disabled={isLoading}
			>
				{isLoading ? (
					<Loader2 className="size-7 animate-spin" />
				) : isPlaying ? (
					<Square className="size-5 fill-current" />
				) : (
					<Play className="size-7" />
				)}
			</Button>
			<div className="flex items-center gap-2 sm:gap-4 md:contents">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => nextStation && setStation(nextStation)}
					aria-label={
						nextStation
							? `Next station: ${nextStation.name}`
							: "Next station"
					}
					className="size-12 cursor-pointer"
					disabled={isLoading}
				>
					<SkipForward className="size-6" />
				</Button>
				{children}
			</div>
		</div>
	);
}
