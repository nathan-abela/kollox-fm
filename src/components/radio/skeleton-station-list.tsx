import { SkeletonStation } from "@/components/radio/skeleton-station";

export function SkeletonStationList() {
	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{Array(8)
				.fill(0)
				.map((_, i) => (
					<SkeletonStation key={i} />
				))}
		</div>
	);
}
