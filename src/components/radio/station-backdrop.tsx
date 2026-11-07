"use client";

import { useState } from "react";
import Image from "next/image";

import { RadioStation } from "@/lib/types/radio";
import { cn } from "@/lib/utils";

/** Station artwork blurred under a gradient, as on the station page hero. Hidden if the image fails. */
export function StationBackdrop({
	station,
	className,
}: {
	station: RadioStation;
	className?: string;
}) {
	const [failedImage, setFailedImage] = useState<string | null>(null);
	if (failedImage === station.image) return null;

	return (
		<div
			aria-hidden="true"
			className={cn(
				"pointer-events-none absolute inset-x-0 top-0 overflow-hidden",
				className
			)}
		>
			<Image
				src={station.image}
				alt=""
				fill
				className="scale-110 object-cover blur-3xl"
				onError={() => setFailedImage(station.image)}
			/>
			<div className="from-background/90 via-background/60 to-background absolute inset-0 bg-gradient-to-b" />
		</div>
	);
}
