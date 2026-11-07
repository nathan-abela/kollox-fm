"use client";

import Link from "next/link";
import { ExternalLink, Heart } from "lucide-react";

import { useFavourites } from "@/lib/hooks/use-favourites";
import { RadioStation } from "@/lib/types/radio";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/** Favourite, station page link and website link. Icon-only below `md`, labelled from `md`. */
export function StationActions({
	station,
	onViewStation,
}: {
	station: RadioStation;
	/** Called when the station page link is followed, ex. to close a drawer */
	onViewStation?: () => void;
}) {
	const { isFavourite, toggleFavourite } = useFavourites();
	const favourited = isFavourite(station.id);

	return (
		<div className="flex w-full max-w-sm gap-2 md:max-w-none md:flex-wrap">
			<Button
				variant="outline"
				onClick={() => toggleFavourite(station.id)}
				aria-pressed={favourited}
				aria-label={
					favourited ? "Remove from favourites" : "Add to favourites"
				}
				className="size-10 cursor-pointer px-0 md:w-auto md:px-4"
			>
				<Heart
					className={cn(
						"size-5",
						favourited && "fill-current text-red-500"
					)}
				/>
				<span className="hidden md:inline">
					{favourited ? "Favourited" : "Favourite"}
				</span>
			</Button>
			<Button
				variant="outline"
				asChild
				className="h-10 flex-1 md:flex-none md:px-4"
			>
				<Link href={`/station/${station.id}`} onClick={onViewStation}>
					View station
				</Link>
			</Button>
			<Button
				variant="outline"
				asChild
				aria-label={`Open ${station.name} website`}
				className="size-10 px-0 md:w-auto md:px-4"
			>
				<a
					href={station.website}
					target="_blank"
					rel="noopener noreferrer"
				>
					<ExternalLink className="size-5" />
					<span className="hidden md:inline">Station website</span>
				</a>
			</Button>
		</div>
	);
}
