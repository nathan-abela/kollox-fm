import { Skeleton } from "./skeleton";

export function SkeletonStation() {
	return (
		<div className="flex flex-col space-y-3">
			<Skeleton className="h-[180px] w-full rounded-lg" />
			<Skeleton className="h-4 w-3/4" />
			<Skeleton className="h-4 w-1/2" />
		</div>
	);
}
