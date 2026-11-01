"use client";

import { useState } from "react";
import Image from "next/image";
import { RadioTower } from "lucide-react";

import { RadioStation } from "@/lib/types/radio";
import { cn } from "@/lib/utils";

/**
 * Station image in a muted square, falling back to a radio tower icon when
 * the image fails to load. Size and radius come from `className`.
 */
export function StationArtwork({
	station,
	className,
	iconClassName,
}: {
	station: RadioStation;
	className?: string;
	iconClassName?: string;
}) {
	const [failedImage, setFailedImage] = useState<string | null>(null);

	return (
		<div
			className={cn(
				"bg-muted text-muted-foreground relative flex shrink-0 items-center justify-center overflow-hidden",
				className
			)}
		>
			{failedImage === station.image ? (
				<RadioTower className={cn("size-5", iconClassName)} />
			) : (
				<Image
					src={station.image}
					alt={station.name}
					fill
					className="object-cover"
					onError={() => setFailedImage(station.image)}
				/>
			)}
		</div>
	);
}
