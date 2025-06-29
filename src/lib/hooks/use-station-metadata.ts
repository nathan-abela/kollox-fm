import { useEffect, useState } from "react";

import { RadioStation } from "@/lib/types/radio";

/**
 * Fetches the currently playing song title for a radio station, if supported
 * and available at stations data file.
 *
 * This hook polls the station's metadata endpoint every 60 seconds while
 * the station is playing and only in production environments.
 *
 * @param station The current radio station object.
 * @param isPlaying Whether the station is currently playing.
 */
export function useStationMetadata(
	station: RadioStation | null,
	isPlaying: boolean
) {
	const [currentSong, setCurrentSong] = useState<string | null>(null);

	useEffect(() => {
		// Skip fetching if SSR, dev, metadata unavailable, or not playing
		if (
			typeof window === "undefined" ||
			process.env.NODE_ENV === "development" ||
			!station?.metadata?.isEnabled ||
			!station?.metadata?.currentSongUrl ||
			!isPlaying
		) {
			return;
		}

		const fetchMetadata = async () => {
			try {
				if (!station?.metadata?.currentSongUrl) return;

				const res = await fetch(station?.metadata?.currentSongUrl);
				const text = await res.text();

				let parsed: string | null = null;

				switch (station?.metadata?.currentSongMethod) {
					case "voscast":
					case "icecast":
						const json = JSON.parse(text);
						const sources = Array.isArray(json.icestats?.source)
							? json.icestats.source
							: [];
						const source = sources.find(
							(s: { title?: string }) => s.title !== undefined
						); // Filter source containing title

						parsed = source?.title ?? null;
						break;
					case "shoutcast":
					default:
						parsed = text.trim();
				}

				setCurrentSong(parsed);
			} catch (err) {
				console.error("Metadata fetch failed:", err);
				setCurrentSong(null);
			}
		};

		fetchMetadata();
		const interval = setInterval(fetchMetadata, 60_000);
		return () => clearInterval(interval);
	}, [
		station?.metadata?.currentSongUrl,
		station?.metadata?.currentSongMethod,
		isPlaying,
	]);

	return currentSong;
}
