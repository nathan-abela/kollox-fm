"use client";

import { ReactNode, RefObject } from "react";
import { Loader2, Play, SkipBack, SkipForward, Square } from "lucide-react";

import { useAudioPlayer } from "@/lib/hooks/audio-player";
import { RadioStation } from "@/lib/types/radio";
import { Button } from "@/components/ui/button";

/** Previous, play/stop and next for the current station, with room for extras such as volume after them */
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
	const { isPlaying, isLoading, setStation, togglePlayPause } =
		useAudioPlayer();

	return (
		<div className="flex items-center gap-6">
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
	);
}
