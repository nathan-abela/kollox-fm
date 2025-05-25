import { RadioStation } from "@/lib/types/radio";

import { RadioStationCard } from "./radio-station-card";

export function RadioStationList({ stations }: { stations: RadioStation[] }) {
	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{stations.map((station) => (
				<RadioStationCard key={station.id} station={station} />
			))}
		</div>
	);
}
