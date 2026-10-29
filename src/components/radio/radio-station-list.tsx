import { RadioStation } from "@/lib/types/radio";
import { RadioStationCard } from "@/components/radio/radio-station-card";

/** Narrowest layout is two columns, so the first two cards are the first row everywhere */
const FIRST_ROW_CARDS = 2;

/**
 * Renders a grid of radio stations using `RadioStationCard`, or a fallback message if none are available.
 * Callers are expected to pass a display-ready (already filtered) list.
 *
 * The first row of logos loads eagerly, since one of them is the largest paint
 * on the homepage. The rest stay lazy.
 */
export function RadioStationList({
	stations,
	isFavourite,
	onToggleFavourite,
}: {
	stations: RadioStation[];
	isFavourite: (id: string) => boolean;
	onToggleFavourite: (id: string) => void;
}) {
	if (stations.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<h3 className="mb-2 text-xl font-semibold">
					No stations found!
				</h3>
				<p className="text-muted-foreground">
					Try a different search or genre.
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 2xl:grid-cols-5">
			{stations.map((station, index) => (
				<RadioStationCard
					key={station.id}
					station={station}
					isFavourite={isFavourite(station.id)}
					onToggleFavourite={() => onToggleFavourite(station.id)}
					priority={index < FIRST_ROW_CARDS}
				/>
			))}
		</div>
	);
}
