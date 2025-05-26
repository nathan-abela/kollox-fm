import { RadioStation } from "@/lib/types/radio";
import { RadioStationCard } from "@/components/radio-station-card";

/**
 * Renders a grid of radio stations using `RadioStationCard`, or a fallback message if none are available.
 *
 * @param stations - Array of `RadioStation` objects.
 */
export function RadioStationList({ stations }: { stations: RadioStation[] }) {
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
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{stations.map((station) => (
				<RadioStationCard key={station.id} station={station} />
			))}
		</div>
	);
}
