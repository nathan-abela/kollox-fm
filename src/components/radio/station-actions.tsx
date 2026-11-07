"use client";

import Link from "next/link";
import { ExternalLink, Share2 } from "lucide-react";
import { toast } from "sonner";

import { siteUrl } from "@/lib/config";
import { RadioStation } from "@/lib/types/radio";
import { Button } from "@/components/ui/button";
import { FavouriteButton } from "@/components/radio/favourite-button";

/**
 * Station page link, website link and share, with favourite from `md`
 * (phones carry it in the playback controls). Icon-only below `md`,
 * labelled from `md`.
 */
export function StationActions({
	station,
	onViewStation,
}: {
	station: RadioStation;
	/** Called when the station page link is followed, ex. to close a drawer */
	onViewStation?: () => void;
}) {
	// Native share sheet where there is one, otherwise the link goes to the clipboard
	const share = async () => {
		const url = `${siteUrl}/station/${station.id}`;
		if (navigator.share) {
			await navigator.share({ title: station.name, url }).catch(() => {});
			return;
		}
		try {
			await navigator.clipboard.writeText(url);
			toast("Link copied");
		} catch {
			toast("Couldn't copy the link");
		}
	};

	return (
		<div className="flex w-full max-w-sm gap-2 md:max-w-none md:flex-wrap">
			<FavouriteButton
				station={station}
				label
				className="hidden h-10 px-4 md:inline-flex"
			/>
			<Button
				variant="outline"
				onClick={share}
				aria-label={`Share ${station.name}`}
				className="order-first size-10 cursor-pointer px-0 md:order-last md:w-auto md:px-4"
			>
				<Share2 className="size-5" />
				<span className="hidden md:inline">Share</span>
			</Button>
			<Button
				variant="outline"
				asChild
				className="h-10 flex-1 md:flex-none md:px-4"
			>
				<Link href={`/station/${station.id}`} onClick={onViewStation}>
					View station
				</Link>
			</Button>
			<Button
				variant="outline"
				asChild
				aria-label={`Open ${station.name} website`}
				className="size-10 px-0 md:w-auto md:px-4"
			>
				<a
					href={station.website}
					target="_blank"
					rel="noopener noreferrer"
				>
					<ExternalLink className="size-5" />
					<span className="hidden md:inline">Station website</span>
				</a>
			</Button>
		</div>
	);
}
