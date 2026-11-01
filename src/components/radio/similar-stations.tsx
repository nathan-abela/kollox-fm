import Link from "next/link";

import { displayFrequency, getSimilarStations } from "@/lib/data/stations";
import { RadioStation } from "@/lib/types/radio";
import { cn } from "@/lib/utils";
import { StationArtwork } from "@/components/radio/station-artwork";

const COUNT = 3;

/**
 * Compact picker of the stations closest in genre to `station`: logo over
 * name below `md`, logo beside name and frequency from `md`, in a grid the
 * parent shapes through `className`. Renders nothing when no station shares
 * a genre.
 */
export function SimilarStations({
	station,
	totalCount,
	onPick,
	onViewAll,
	className,
}: {
	station: RadioStation;
	/** Shown in the link to the full station list */
	totalCount: number;
	onPick: (station: RadioStation) => void;
	/** Called when the full-list link is followed, ex. to close a drawer */
	onViewAll?: () => void;
	className?: string;
}) {
	const similar = getSimilarStations(station, COUNT);
	if (similar.length === 0) return null;

	return (
		<section className={cn("min-w-0 text-left", className)}>
			<div className="mb-2 flex items-baseline justify-between">
				<h2 className="font-medium">Similar stations</h2>
				<Link
					href="/"
					onClick={onViewAll}
					className="text-muted-foreground hover:text-primary text-sm transition-colors"
				>
					All {totalCount} stations
				</Link>
			</div>
			<ul className="grid grid-cols-3 gap-2 xl:grid-cols-1">
				{similar.map((s) => (
					<li key={s.id}>
						<button
							type="button"
							onClick={() => onPick(s)}
							aria-label={`Play ${s.name}`}
							className="bg-card/60 hover:bg-accent focus-visible:ring-ring/50 flex w-full cursor-pointer flex-col items-center gap-2 rounded-lg border p-2 text-center transition-[color,background-color,transform] outline-none focus-visible:ring-[3px] active:scale-[0.97] md:flex-row md:gap-3 md:text-left"
						>
							<StationArtwork
								station={s}
								className="size-12 rounded-md md:size-10"
							/>
							<span className="w-full min-w-0 md:w-auto">
								<span className="block truncate text-xs font-medium md:text-sm">
									{s.name}
								</span>
								<span className="text-muted-foreground hidden truncate text-xs md:block">
									{displayFrequency(s) ?? s.location}
								</span>
							</span>
						</button>
					</li>
				))}
			</ul>
		</section>
	);
}
