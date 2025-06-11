import { RadioStation } from "@/lib/types/radio";
import { RadioStationCard } from "@/components/radio-station-card";

/**
 * Renders a grid of radio stations using `RadioStationCard`, or a fallback message if none are available.
 *
 * @param stations - Array of `RadioStation` objects.
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
		// Auto-fit grid: cards are at least 200px wide and expand to fill space
		// At 2xl and up, limit to 5 columns for wide screens
		// TODO: Fix responsive grid, when 1-2 stations are displayed, they should not stretch too wide
		<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 2xl:grid-cols-5">
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
