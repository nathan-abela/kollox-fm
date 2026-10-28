"use client";

import Image from "next/image";
import { ExternalLink, Heart } from "lucide-react";

import { useAudioPlayer } from "@/lib/hooks/audio-player";
import { RadioStation } from "@/lib/types/radio";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { MaltaSkyline } from "@/components/illustrations/malta-skyline";
import { ScrollingText } from "@/components/scrolling-text";

interface HomeHeroProps {
	isFavourite: (stationId: string) => boolean;
	onToggleFavourite: (stationId: string) => void;
}

/**
 * Homepage hero band. The left half is the headline. The right half shows
 * the skyline while nothing is playing and swaps to a now-playing block
 * once a station starts. The right half is desktop-only, since the player
 * bar already covers now-playing on phones.
 */
export function HomeHero({ isFavourite, onToggleFavourite }: HomeHeroProps) {
	const { currentStation, currentSong, isPlaying, isLoading } = useAudioPlayer(); // prettier-ignore

	return (
		<section className="pt-6 md:pt-8">
			<div className="bg-card relative flex min-h-[120px] items-center gap-6 overflow-hidden rounded-xl border px-6 py-5 md:min-h-36">
				{currentStation ? (
					<StationTint station={currentStation} />
				) : (
					<MaltaSkyline className="absolute inset-y-0 right-0 hidden h-full w-auto max-w-[55%] [mask-image:linear-gradient(to_right,transparent,black_35%)] md:block" />
				)}

				<div className="relative min-w-0 md:basis-96">
					<h1 className="text-foreground text-2xl font-bold tracking-tight">
						Explore Malta&apos;s Radio Stations
					</h1>
					<p className="text-muted-foreground mt-1.5 text-sm">
						All your favourite Maltese stations in one place. Free,
						live, and local!
					</p>
				</div>

				<div className="bg-border relative my-1 hidden w-px self-stretch md:block" />

				{currentStation ? (
					<NowPlaying
						station={currentStation}
						currentSong={currentSong}
						isPlaying={isPlaying}
						isLoading={isLoading}
						isFavourite={isFavourite(currentStation.id)}
						onToggleFavourite={() =>
							onToggleFavourite(currentStation.id)
						}
					/>
				) : (
					<div className="text-muted-foreground relative hidden min-w-0 flex-1 md:block">
						<p className="text-foreground text-[15px] font-semibold">
							Nothing playing
						</p>
						<p className="text-[13px]">
							Pick a station below to start listening.
						</p>
					</div>
				)}
			</div>
		</section>
	);
}

/** Blurred copy of the station logo, washing the band's right edge in the station's colour */
function StationTint({ station }: { station: RadioStation }) {
	return (
		<div
			aria-hidden="true"
			className="absolute inset-y-0 right-0 hidden w-1/2 [mask-image:linear-gradient(to_left,black,transparent)] opacity-30 md:block"
		>
			<Image
				src={station.image}
				alt=""
				fill
				className="scale-125 object-cover blur-3xl"
			/>
		</div>
	);
}

/**
 * Station logo, playback status, the current song when the station
 * provides one, favourite and website actions.
 */
function NowPlaying({
	station,
	currentSong,
	isPlaying,
	isLoading,
	isFavourite,
	onToggleFavourite,
}: {
	station: RadioStation;
	currentSong: string | null;
	isPlaying: boolean;
	isLoading: boolean;
	isFavourite: boolean;
	onToggleFavourite: () => void;
}) {
	const isLive = isPlaying && !isLoading;

	const status = isLoading
		? "Loading…"
		: isPlaying
			? "Now playing"
			: "Paused";

	return (
		<div
			aria-label="Now playing"
			className="relative hidden min-w-0 flex-1 items-center gap-4 md:flex"
		>
			<div className="bg-muted relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg">
				<Image
					src={station.image}
					alt={station.name}
					fill
					className="object-cover"
				/>
			</div>

			<div className="min-w-0 flex-1">
				<div
					className={cn(
						"flex items-center gap-2 text-xs font-medium",
						isLive ? "text-green-500" : "text-muted-foreground"
					)}
				>
					<span
						className={cn(
							"h-2 w-2 rounded-full",
							isLive ? "bg-green-500" : "bg-muted-foreground/60"
						)}
					/>
					{status}
				</div>
				<ScrollingText
					text={currentSong ? currentSong.toLowerCase() : station.name} // prettier-ignore
					className="text-xl font-bold tracking-tight capitalize"
				/>
				<p className="text-muted-foreground truncate text-[13px]">
					{currentSong
						? `${station.name} · ${station.location}`
						: station.location}
				</p>
			</div>

			<div className="flex shrink-0 items-center gap-2">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							onClick={onToggleFavourite}
							aria-pressed={isFavourite}
							aria-label={
								isFavourite
									? "Remove from favourites"
									: "Add to favourites"
							}
							className="h-9 w-9 cursor-pointer rounded-full"
						>
							<Heart
								className={cn(
									"h-4 w-4",
									isFavourite && "fill-current text-red-500"
								)}
							/>
						</Button>
					</TooltipTrigger>
					<TooltipContent side="top">
						{isFavourite
							? "Remove from favourites"
							: "Add to favourites"}
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							asChild
							className="h-9 w-9 rounded-full"
						>
							<a
								href={station.website}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={`Open ${station.name} website`}
							>
								<ExternalLink className="h-4 w-4" />
							</a>
						</Button>
					</TooltipTrigger>
					<TooltipContent side="top">
						Visit {station.name}
					</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
}
