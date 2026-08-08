"use client";

import { useAudioPlayer } from "@/lib/hooks/audio-player";
import { RadioStation } from "@/lib/types/radio";
import { cn } from "@/lib/utils";

const MIN_FREQ = 87.5;
const MAX_FREQ = 108;
const SCALE_MARKS = ["87.5", "92", "96", "100", "104", "108.0"];

interface FmDialProps {
	stations: RadioStation[];
}

/**
 * Interactive FM band with one tick per station, positioned at its
 * frequency. Clicking a tick tunes the player to that station.
 */
export function FmDial({ stations }: FmDialProps) {
	const { currentStation, setStation } = useAudioPlayer();

	const ticks = stations
		.filter((station) => station.fmFrequency)
		.sort((a, b) => parseFloat(a.fmFrequency!) - parseFloat(b.fmFrequency!));

	return (
		<div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			<div className="relative h-20 min-w-[560px]">
				<div className="text-muted-foreground/70 absolute inset-x-0 top-0 flex justify-between font-mono text-[10px]">
					{SCALE_MARKS.map((mark) => (
						<span key={mark}>{mark}</span>
					))}
				</div>

				<div className="bg-border absolute inset-x-0 top-[26px] h-px" />

				{ticks.map((station, index) => {
					const frequency = parseFloat(station.fmFrequency!);
					const isActive = currentStation?.id === station.id;
					const isTall = index % 2 === 1;
					return (
						<button
							key={station.id}
							type="button"
							onClick={() => setStation(station)}
							aria-label={`Tune to ${station.name}, ${station.fmFrequency} FM`}
							className="group absolute top-[26px] flex -translate-x-1/2 cursor-pointer flex-col items-center hover:z-10 focus-visible:z-10"
							style={{
								left: `${((frequency - MIN_FREQ) / (MAX_FREQ - MIN_FREQ)) * 100}%`,
							}}
						>
							<span
								className={cn(
									"rounded-full transition-colors",
									isTall ? "h-[18px]" : "h-[7px]",
									isActive
										? "bg-primary w-[3px]"
										: "bg-muted-foreground/60 group-hover:bg-foreground w-0.5"
								)}
							/>
							<span
								className={cn(
									"mt-1 font-mono text-[10px] whitespace-nowrap transition-colors",
									isActive
										? "text-primary"
										: "text-muted-foreground group-hover:text-foreground"
								)}
							>
								{station.fmFrequency}
							</span>
							<span
								className={cn(
									"bg-card rounded px-1 text-[10px] whitespace-nowrap transition-opacity",
									isActive
										? "text-foreground opacity-100"
										: "text-muted-foreground opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
								)}
							>
								{station.name}
							</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}
