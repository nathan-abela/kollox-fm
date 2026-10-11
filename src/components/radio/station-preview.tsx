import Image from "next/image";

import { RadioStation } from "@/lib/types/radio";
import { cn } from "@/lib/utils";

interface StationPreviewProps {
	station: RadioStation;
	tilt?: "left" | "right" | "none";
	className?: string;
}

/**
 * A station's logo as a lifted, slightly tilted print, for hover previews.
 * Purely visual: whatever triggers it must name the station for screen
 * readers.
 */
export function StationPreview({
	station,
	tilt = "none",
	className,
}: StationPreviewProps) {
	return (
		<span
			aria-hidden="true"
			className={cn(
				"animate-preview-in bg-card block w-[152px] rounded-lg p-1 shadow-xl",
				tilt === "left" && "-rotate-6",
				tilt === "right" && "rotate-6",
				className
			)}
		>
			<Image
				src={station.image}
				alt={station.name + " logo"}
				width={144}
				height={108}
				className="h-[108px] w-full rounded-md object-cover"
			/>
		</span>
	);
}
