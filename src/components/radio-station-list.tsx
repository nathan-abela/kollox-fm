import { stations } from "@/lib/data/stations";

import { RadioStationCard } from "./radio-station-card";

export function RadioStationList() {
	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{stations.map((stations) => (
				<RadioStationCard key={stations.id} station={stations} />
			))}
		</div>
	);
}
