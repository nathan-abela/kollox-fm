import { cn } from "@/lib/utils";

const SHAPES = 3;

const GOLDEN_RATIO = (Math.sqrt(5) - 1) / 2;

/**
 * Deterministic value in [0, 1) per bar and seed, so server and client
 * agree. Multiples of the golden ratio spread evenly without repeating.
 */
const spread = (i: number, seed: number) => ((i + 1) * seed * GOLDEN_RATIO) % 1;

/**
 * Bars that move like a level meter while a station plays and sit low and
 * grey while it is stopped, so the row keeps its height either way.
 * Decorative, not driven by the audio: the control next to it carries the
 * playing state for assistive tech. Each bar loops one of three keyframe
 * shapes at its own duration and offset, so the row never lines up; the
 * animation runs on the compositor, with no per-frame script. Reduced
 * motion shows the bars still.
 */
export function LiveBars({
	bars = 3,
	active = true,
	className,
}: {
	bars?: number;
	active?: boolean;
	className?: string;
}) {
	return (
		<span
			aria-hidden="true"
			className={cn("flex h-4 items-end gap-0.5", className)}
		>
			{Array.from({ length: bars }, (_, i) => {
				const shape = Math.floor(spread(i, 1) * SHAPES) + 1;
				const duration = 2.4 + spread(i, 2) * 2.2;
				const delay = -spread(i, 3) * duration;
				return (
					<span
						key={i}
						data-live-bar
						className={cn(
							"h-full w-1 origin-bottom rounded-full bg-green-500 motion-reduce:animate-none! md:w-1.5",
							!active && "bg-muted-foreground/30 h-1/4"
						)}
						style={
							active
								? {
										animation: `live-bar-${shape} ${duration.toFixed(2)}s ease-in-out ${delay.toFixed(2)}s infinite`,
										transform: `scaleY(${(0.3 + spread(i, 4) * 0.6).toFixed(2)})`,
									}
								: undefined
						}
					/>
				);
			})}
		</span>
	);
}
