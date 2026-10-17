import { useEffect, useState } from "react";

import { RadioStation } from "@/lib/types/radio";

/**
 * Strips internal tracking codes from station metadata.
 *
 * Radio 105 appends 4-character codes like `[2zeb]` to track plays.
 * Pattern: bracket, digit, 3 alphanumerics (ex. `[2w0j]`, `[2vvd]`).
 */
function cleanMetadata(text: string | null): string | null {
	if (!text) return null;
	return text.replace(/\s*\[\d[a-z0-9]{3}\]$/i, "").trim() || null;
}

/**
 * Fetches the currently playing song title for a radio station, if supported
 * and available at stations data file.
 *
 * Only runs in production while the station is playing. Zeno stations stream
 * updates over a single open connection. All other methods poll the
 * station's metadata endpoint every 60 seconds, pausing while the tab is
 * hidden.
 *
 * @param station The current radio station object.
 * @param isPlaying Whether the station is currently playing.
 */
export function useStationMetadata(
	station: RadioStation | null,
	isPlaying: boolean
) {
	// Each title is stored with the station it belongs to, so switching stations
	// hides the previous title right away without needing a separate reset.
	const [song, setSong] = useState<{
		stationId: string;
		title: string | null;
	} | null>(null);

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

		const stationId = station.id;
		const url = station.metadata.currentSongUrl;
		const setCurrentSong = (title: string | null) =>
			setSong({ stationId, title });

		// Zeno pushes updates over a long-lived SSE stream instead of being polled
		if (station.metadata.currentSongMethod === "zeno") {
			const source = new EventSource(url);
			source.onmessage = (event) => {
				try {
					const json = JSON.parse(event.data);
					setCurrentSong(cleanMetadata(json.streamTitle ?? null));
				} catch (err) {
					console.error("Metadata parse failed:", err);
				}
			};
			return () => source.close();
		}

		// Cancels a check still in progress when the station changes, so a late
		// response from the previous station can't overwrite the new title.
		const controller = new AbortController();

		const fetchMetadata = async () => {
			try {
				const res = await fetch(url, { signal: controller.signal });
				// `fetch` doesn't throw when the server returns an error.
				// Without this check, the error page text would be shown as the song title.
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				const text = await res.text();

				let parsed: string | null = null;

				/**
				 * Parses the current song title based on the streaming provider
				 *
				 * Supported methods:
				 * - voscast/ icecast: Parses JSON containing `icestats.source`, which may be
				 *   an array or a single object. Extracts the first source with a `title`.
				 * - radioco: Extracts the `title` from `json.data.title`.
				 * - radioking: Joins top-level `artist` and `title` as `Artist - Title`,
				 *   falling back to `title` alone when no artist is set.
				 * - shoutcast/ default: Falls back to trimming the raw response text.
				 *
				 * @param text - The raw response body from the streaming server.
				 * @returns `parsed` - assigned the extracted song title, or `null` if not found.
				 */
				switch (station?.metadata?.currentSongMethod) {
					case "voscast":
					case "icecast": {
						const json = JSON.parse(text);
						const sources = Array.isArray(json.icestats?.source)
							? json.icestats.source
							: [json.icestats?.source].filter(Boolean);
						const source = sources.find(
							(s: { title?: string }) => s.title !== undefined
						); // Filter source containing title

						parsed = source?.title ?? null;
						break;
					}
					case "radioco": {
						const json = JSON.parse(text);
						parsed = json.data?.title ?? null;
						break;
					}
					case "radioking": {
						const json = JSON.parse(text);
						parsed =
							json.artist && json.title
								? `${json.artist} - ${json.title}`
								: (json.title ?? null);
						break;
					}
					case "shoutcast":
					default:
						parsed = text.trim();
				}

				setCurrentSong(cleanMetadata(parsed));
			} catch (err) {
				if (controller.signal.aborted) return;
				// Leave the current title as is. If one check fails the song is most
				// likely still playing, so clearing it would make the title disappear
				// for no reason until the next check.
				console.error("Metadata fetch failed:", err);
			}
		};

		// Pause metadata polling while the user is viewing another tab.
		// Refresh the title when the user returns.
		const fetchIfVisible = () => {
			if (!document.hidden) fetchMetadata();
		};

		fetchIfVisible();
		const interval = setInterval(fetchIfVisible, 60_000);
		document.addEventListener("visibilitychange", fetchIfVisible);
		return () => {
			controller.abort();
			clearInterval(interval);
			document.removeEventListener("visibilitychange", fetchIfVisible);
		};
	}, [
		station?.id,
		station?.metadata?.isEnabled,
		station?.metadata?.currentSongUrl,
		station?.metadata?.currentSongMethod,
		isPlaying,
	]);

	return song?.stationId === station?.id ? (song?.title ?? null) : null;
}
