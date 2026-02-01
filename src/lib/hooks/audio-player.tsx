"use client";

import {
	ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { toast } from "sonner";

import { stations } from "@/lib/data/stations";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { RadioStation } from "@/lib/types/radio";

interface AudioPlayerContextType {
	currentStation: RadioStation | null;
	isPlaying: boolean;
	isLoading: boolean;
	volume: number;
	isMuted: boolean;
	recentlyPlayed: string[];
	stationsOrder: RadioStation[];
	setStation: (station: RadioStation) => void;
	togglePlayPause: () => void;
	setVolume: (volume: number) => void;
	toggleMute: () => void;
	clearRecentlyPlayed: () => void;
	setStationsOrder: (stations: RadioStation[]) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
	undefined
);

/**
 * Provides audio playback functionality for radio stations.
 */
export function AudioPlayerProvider({ children }: { children: ReactNode }) {
	const [currentStation, setCurrentStation] = useState<RadioStation | null>(null); // prettier-ignore
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [volume, setVolume] = useState(() => {
		const localVolume =
			typeof window !== "undefined"
				? localStorage.getItem("playerVolume")
				: null;
		return localVolume !== null ? Number(localVolume) : 70;
	}); // Initial volume set to 70% or fetched from localStorage
	const [isMuted, setIsMuted] = useState(false);
	const [recentlyPlayed, setRecentlyPlayed] = useState<string[]>([]);
	const [stationsOrder, setStationsOrder] =
		useState<RadioStation[]>(stations);

	// Debounce the volume change to avoid frequent updates
	const debouncedVolume = useDebounce(volume, 50);

	// Ref to hold the audio element
	const audioRef = useRef<HTMLAudioElement | null>(null);

	// Initialize audio element on mount
	useEffect(() => {
		audioRef.current = new Audio();
		audioRef.current.volume = volume / 100;

		return () => {
			audioRef.current?.pause();
			audioRef.current = null;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Control volume change and mute toggle
	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = isMuted ? 0 : volume / 100;
		}
	}, [volume, isMuted]);

	// Control playback state - Play/ Pause
	useEffect(() => {
		// Return early if audio is not ready, no station is selected, or if it's currently loading a new station.
		// This prevents play attempts while the source is being updated or not yet playable.
		if (!audioRef.current || !currentStation || isLoading) return;

		if (isPlaying) {
			const playPromise = audioRef.current.play();
			if (playPromise !== undefined) {
				playPromise.catch((error) => {
					console.error("Playback error:", error);
					setIsPlaying(false);

					toast.error("Playback Error", {
						description:
							"Failed to play this station. Please try again.",
					});
				});
			}
		} else {
			audioRef.current.pause();
		}
	}, [isPlaying, currentStation, isLoading]);

	// Set stream source when station changes
	useEffect(() => {
		if (!audioRef.current) return;

		// When currentStation becomes null (e.g., when 'stop' is called),
		// pause the audio, clear the source, and set isLoading to false.
		if (!currentStation) {
			audioRef.current.pause();
			audioRef.current.src = "";
			setIsLoading(false);
			return;
		}

		// Always pause before changing the source to prevent errors
		audioRef.current.pause(); // Pause current playback before changing source
		audioRef.current.src = currentStation.streamUrl;
		setIsLoading(true);

		const handleCanPlay = () => {
			setIsLoading(false);
			if (isPlaying) {
				audioRef.current?.play().catch((error) => {
					console.error("Error playing audio:", error);
					setIsPlaying(false);

					toast.error("Playback Error", {
						description:
							"Failed to play this station. Please try again.",
					});
				});
			}
		};

		const handleError = () => {
			setIsLoading(false);
			setIsPlaying(false);

			toast.error(
				"Unable to load the stream. This station may be offline."
			);
		};

		audioRef.current.addEventListener("canplay", handleCanPlay);
		audioRef.current.addEventListener("error", handleError);
		audioRef.current.load();

		return () => {
			audioRef.current?.removeEventListener("canplay", handleCanPlay);
			audioRef.current?.removeEventListener("error", handleError);
		};
		// Only re-run this effect if the currentStation ID actually changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentStation]);

	// Load recently played stations from localStorage on mount
	useEffect(() => {
		const recentlyPlayed = localStorage.getItem("recentlyPlayed");
		if (recentlyPlayed) {
			setRecentlyPlayed(JSON.parse(recentlyPlayed));
		}
	}, []);

	// Set volume to localStorage when volume changes
	useEffect(() => {
		localStorage.setItem("playerVolume", debouncedVolume.toString());
	}, [debouncedVolume]);

	// Toggles between playing and paused states for the current station
	const togglePlayPause = useCallback(() => {
		if (currentStation) {
			setIsPlaying((prev) => !prev);
		}
	}, [currentStation]);

	// Sets the current station and begins playback
	const setStation = useCallback(
		(station: RadioStation) => {
			// If the same station is selected again, toggle play/pause instead of reloading
			if (currentStation?.id === station.id) {
				togglePlayPause();
				return;
			}

			setCurrentStation(station);

			/**
			 * - Update the recently played list:
			 * - Place the new station at the beginning
			 * - Filter out duplicates of the current one
			 * - Limit the list to the 10 most recent
			 */
			const recentPlayedStations = [
				station.id,
				...(
					JSON.parse(
						localStorage.getItem("recentlyPlayed") || "[]"
					) as string[]
				).filter((id) => id !== station.id),
			].slice(0, 10);

			localStorage.setItem(
				"recentlyPlayed",
				JSON.stringify(recentPlayedStations)
			);
			setRecentlyPlayed(recentPlayedStations);
		},
		[currentStation, togglePlayPause]
	);

	// Plays the current station when it changes
	useEffect(() => {
		if (!audioRef.current || !currentStation) return;

		audioRef.current.src = currentStation.streamUrl;

		const playAfterLoad = async () => {
			try {
				await audioRef.current?.play();
				setIsPlaying(true);
			} catch (err) {
				console.error("Playback failed:", err);
				setIsPlaying(false);
			}
		};

		playAfterLoad();
	}, [currentStation]);

	// Toggles the mute state
	const toggleMute = useCallback(() => {
		setIsMuted((prev) => !prev);
	}, []);

	// Clears all recently played stations
	const clearRecentlyPlayed = useCallback(() => {
		setRecentlyPlayed([]);
		localStorage.removeItem("recentlyPlayed");
	}, []);

	/**
	 * Adds a global keyboard shortcut for toggling playback using the spacebar.
	 * Prevents default scroll behavior when pressing spacebar.
	 */
	useEffect(() => {
		// Determines whether the keyboard event target is an input, textarea, or contentEditable
		const isTypingInInput = (e: KeyboardEvent) => {
			const tag = (e.target as HTMLElement)?.tagName;
			const isContentEditable = (e.target as HTMLElement)
				?.isContentEditable;
			return tag === "INPUT" || tag === "TEXTAREA" || isContentEditable;
		};

		const handler = (e: KeyboardEvent) => {
			if (isTypingInInput(e)) return;

			if (e.code === "Space") {
				e.preventDefault(); // Prevent page bottom scroll
				togglePlayPause();
			}
		};

		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [togglePlayPause]);

	useEffect(() => {
		if (isPlaying && currentStation) {
			document.title = `Kollox FM | ${currentStation.name}`;
		} else {
			document.title =
				"Kollox FM | Maltese Radio Stations in One Place";
		}
	}, [isPlaying, currentStation]);

	return (
		<AudioPlayerContext.Provider
			value={{
				currentStation,
				isPlaying,
				isLoading,
				volume,
				isMuted,
				recentlyPlayed,
				stationsOrder,
				setStation,
				togglePlayPause,
				setVolume,
				toggleMute,
				clearRecentlyPlayed,
				setStationsOrder,
			}}
		>
			{children}
		</AudioPlayerContext.Provider>
	);
}

/**
 * Hook to access the audio player context.
 * Must be used inside an `<AudioPlayerProvider>`.
 */
export function useAudioPlayer() {
	const context = useContext(AudioPlayerContext);
	if (!context) {
		throw new Error(
			"useAudioPlayer must be used within an AudioPlayerProvider"
		);
	}
	return context;
}
