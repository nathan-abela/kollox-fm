import { RadioStation } from "@/lib/types/radio";
import { RadioStationCard } from "@/components/radio/radio-station-card";

/**
 * Renders a grid of radio stations using `RadioStationCard`, or a fallback message if none are available.
 * Callers are expected to pass a display-ready (already filtered) list.
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
					Try adjusting your search terms.
				</p>
			</div>
		);
	}

	return (
		<div className="grid gap-6 min-[425px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
			{stations.map((station) => (
				<RadioStationCard
					key={station.id}
					station={station}
					isFavourite={isFavourite(station.id)}
					onToggleFavourite={() => onToggleFavourite(station.id)}
				/>
			))}
		</div>
	);
}
