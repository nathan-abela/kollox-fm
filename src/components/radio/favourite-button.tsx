"use client";

import { Heart } from "lucide-react";

import { useFavourites } from "@/lib/hooks/use-favourites";
import { RadioStation } from "@/lib/types/radio";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/** Toggles a station in the favourites. Icon only unless `label` is set. */
export function FavouriteButton({
	station,
	label = false,
	className,
}: {
	station: RadioStation;
	label?: boolean;
	className?: string;
}) {
	const { isFavourite, toggleFavourite } = useFavourites();
	const favourited = isFavourite(station.id);

	return (
		<Button
			variant="outline"
			onClick={() => toggleFavourite(station.id)}
			aria-pressed={favourited}
			aria-label={
				favourited ? "Remove from favourites" : "Add to favourites"
			}
			className={cn("cursor-pointer", className)}
		>
			<Heart
				className={cn(
					"size-5",
					favourited && "fill-current text-red-500"
				)}
			/>
			{label && (favourited ? "Favourited" : "Favourite")}
		</Button>
	);
}
