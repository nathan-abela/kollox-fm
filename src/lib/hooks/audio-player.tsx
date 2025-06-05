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

import { RadioStation } from "@/lib/types/radio";

interface AudioPlayerContextType {
	currentStation: RadioStation | null;
	isPlaying: boolean;
	isLoading: boolean;
	volume: number;
	setStation: (station: RadioStation) => void;
	togglePlayPause: () => void;
	setVolume: (volume: number) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
	undefined
);

// TODO: Add debounce for volume changes - useDebounce

/**
 * Provides audio playback functionality for radio stations.
 */
export function AudioPlayerProvider({ children }: { children: ReactNode }) {
	const [currentStation, setCurrentStation] = useState<RadioStation | null>(
		null
	);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [volume, setVolume] = useState(70); // Initial volume set to 70%

	const audioRef = useRef<HTMLAudioElement | null>(null);

	// Initialize audio element on mount
	useEffect(() => {
		audioRef.current = new Audio();
		audioRef.current.volume = volume / 100;

		return () => {
			audioRef.current?.pause();
			audioRef.current = null;
		};
	}, []);

	// Control volume change
	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume / 100;
		}
	}, [volume]);

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
	}, [currentStation]);

	/**
	 * Sets the current station and begins playback.
	 */
	const setStation = useCallback(
		(station: RadioStation) => {
			if (currentStation?.id !== station.id) {
				setIsLoading(true);
			}
			setCurrentStation(station);
			setIsPlaying(true);
		},
		[currentStation]
	);

	/**
	 * Toggles between playing and paused states for the current station.
	 */
	const togglePlayPause = useCallback(() => {
		if (currentStation) {
			setIsPlaying((prev) => !prev);
		}
	}, [currentStation]);

	// Toggle playback with spacebar
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.code === "Space") togglePlayPause();
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [togglePlayPause]);

	return (
		<AudioPlayerContext.Provider
			value={{
				currentStation,
				isPlaying,
				isLoading,
				volume: volume,
				setStation,
				togglePlayPause,
				setVolume,
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
