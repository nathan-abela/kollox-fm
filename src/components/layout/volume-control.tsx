"use client";

import { Volume1, Volume2, VolumeX } from "lucide-react";

import { useAudioPlayer } from "@/lib/hooks/audio-player";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Mute button and volume slider bound to the shared player, used by the
 * player bar and the now-playing drawer from `md` up.
 */
export function VolumeControl({ className }: { className?: string }) {
	const { volume, isMuted, setVolume, toggleMute } = useAudioPlayer();

	return (
		<div className={cn("flex min-w-[140px] items-center gap-2", className)}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						onClick={toggleMute}
						aria-label={isMuted ? "Unmute" : "Mute"}
						className="size-10 cursor-pointer"
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
					{isMuted || volume === 0 ? "Unmute" : "Mute"}
				</TooltipContent>
			</Tooltip>
			<Slider
				value={[isMuted ? 0 : volume]}
				max={100}
				step={1}
				onValueChange={(value) => setVolume(value[0])}
				className="w-24 cursor-pointer"
				aria-label="Volume control"
			/>
		</div>
	);
}
