"use client";

import Link from "next/link";
import { Music2, Radio } from "lucide-react";

import { useAudioPlayer } from "@/lib/hooks/audio-player";
import { useStationMetadata } from "@/lib/hooks/use-station-metadata";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
	const { currentStation, isPlaying } = useAudioPlayer();

	// Store the current song metadata based on the current station and playback state
	const currentSong = useStationMetadata(currentStation, isPlaying);

	return (
		<header className="bg-background sticky top-0 z-40 w-full border-b">
			<div className="container mx-auto flex h-16 items-center justify-between py-4">
				<Link
					href="/"
					className="flex items-center gap-2 text-lg font-bold"
				>
					<Radio className="text-primary h-6 w-6" />
					Kollox FM
				</Link>

				<div className="flex max-w-[500px] items-center justify-end gap-2">
					{currentSong && (
						<div className="text-muted-foreground hidden items-center gap-1 truncate text-sm sm:flex">
							<Music2 className="h-4 w-4 opacity-60" />
							<span className="truncate font-medium capitalize">
								{currentSong.toLowerCase()}
							</span>
						</div>
					)}

					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}
