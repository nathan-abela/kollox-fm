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
import { useStationMetadata } from "@/lib/hooks/use-station-metadata";
import { RadioStation } from "@/lib/types/radio";

const TARGET_LUFS = -16;
const MAX_BOOST_DB = 12;

/**
 * DynamicsCompressorNode settings that make it act as a brick-wall limiter:
 * anything above -3 dBFS is squashed at 20:1 with no soft knee, reacting within
 * 3 ms and recovering over 250 ms. This is what stops the boost from clipping.
 */
const LIMITER_SETTINGS = {
	threshold: -3,
	knee: 0,
	ratio: 20,
	attack: 0.003,
	release: 0.25,
} as const;

interface BoostGraph {
	context: AudioContext;
	gain: GainNode;
}

/**
 * Converts decibels to linear gain multiplier.
 * Examples: 0 dB = 1.0, +6 dB ≈ 2.0, -6 dB ≈ 0.5
 */
function dbToLinear(db: number): number {
	return Math.pow(10, db / 20);
}

/**
 * Calculates effective volume for a station, applying per-station gain adjustment.
 * Gain is derived from the station's measured LUFS relative to the target (-16 LUFS).
 *
 * Note: Since HTMLAudioElement.volume is clamped to 0-1, boosting quiet stations
 * only works if the user's volume is below 100%. Stations with `boost: true`
 * use calculateBoostGain through Web Audio instead.
 */
function calculateEffectiveVolume(
	userVolume: number,
	stationLufs: number
): number {
	const baseVolume = userVolume / 100;
	const gainDb = TARGET_LUFS - stationLufs;
	const stationMultiplier = dbToLinear(gainDb);
	return Math.min(1, Math.max(0, baseVolume * stationMultiplier));
}

/**
 * Calculates the Web Audio gain for a boosted station. Unlike the element volume
 * it may exceed 1; the boost is capped at MAX_BOOST_DB and a limiter prevents clipping.
 */
function calculateBoostGain(userVolume: number, stationLufs: number): number {
	const gainDb = Math.min(TARGET_LUFS - stationLufs, MAX_BOOST_DB);
	return (userVolume / 100) * dbToLinear(gainDb);
}

/**
 * Builds the Web Audio chain for the boosted element:
 * source -> gain -> limiter -> speakers.
 */
function createBoostGraph(element: HTMLAudioElement): BoostGraph {
	const context = new AudioContext();
	const gain = context.createGain();
	const limiter = context.createDynamicsCompressor();
	limiter.threshold.value = LIMITER_SETTINGS.threshold;
	limiter.knee.value = LIMITER_SETTINGS.knee;
	limiter.ratio.value = LIMITER_SETTINGS.ratio;
	limiter.attack.value = LIMITER_SETTINGS.attack;
	limiter.release.value = LIMITER_SETTINGS.release;

	context
		.createMediaElementSource(element)
		.connect(gain)
		.connect(limiter)
		.connect(context.destination);

	return { context, gain };
}

interface AudioPlayerContextType {
	currentStation: RadioStation | null;
	currentSong: string | null;
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
	const [stationsOrder, setStationsOrder] = useState<RadioStation[]>(
		stations.filter((s) => s.isEnabled !== false)
	);

	// Fetched once here and shared through context, so every component showing
	// the song reuses the same request instead of starting its own
	const currentSong = useStationMetadata(currentStation, isPlaying);

	// Debounce the volume change to avoid frequent updates
	const debouncedVolume = useDebounce(volume, 50);

	/**
	 * Two audio elements: a plain one for most stations, and a CORS-enabled one wired
	 * through Web Audio for `boost` stations. A MediaElementSource can never be
	 * disconnected from its element, and a connected element plays silence for streams
	 * without CORS headers, so the plain element must never join the graph.
	 */
	const plainAudioRef = useRef<HTMLAudioElement | null>(null);
	const boostAudioRef = useRef<HTMLAudioElement | null>(null);
	const boostGraphRef = useRef<BoostGraph | null>(null);

	// Whichever of the two elements the current station plays through
	const activeAudioRef = useRef<HTMLAudioElement | null>(null);

	// Initialize audio elements on mount
	useEffect(() => {
		plainAudioRef.current = new Audio();
		plainAudioRef.current.volume = volume / 100;

		boostAudioRef.current = new Audio();
		boostAudioRef.current.crossOrigin = "anonymous";

		activeAudioRef.current = plainAudioRef.current;

		return () => {
			plainAudioRef.current?.pause();
			boostAudioRef.current?.pause();
			boostGraphRef.current?.context.close();
			plainAudioRef.current = null;
			boostAudioRef.current = null;
			boostGraphRef.current = null;
			activeAudioRef.current = null;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Creates the Web Audio graph on first use. Must be called from a user gesture
	// so the AudioContext is allowed to start.
	const ensureBoostGraph = useCallback(() => {
		if (!boostGraphRef.current && boostAudioRef.current) {
			boostGraphRef.current = createBoostGraph(boostAudioRef.current);
		}
	}, []);

	// Control playback state - Play/ Pause
	useEffect(() => {
		// Return early if audio is not ready, no station is selected, or if it's currently loading a new station.
		// This prevents play attempts while the source is being updated or not yet playable.
		if (!activeAudioRef.current || !currentStation || isLoading) return;

		if (isPlaying) {
			boostGraphRef.current?.context.resume();
			const playPromise = activeAudioRef.current.play();
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
			activeAudioRef.current.pause();
		}
	}, [isPlaying, currentStation, isLoading]);

	// Load the stream when the station changes and auto-play once it can play.
	// Playback itself is driven by the play/pause effect via isPlaying.
	useEffect(() => {
		if (!activeAudioRef.current) return;

		// When currentStation becomes null (e.g., when 'stop' is called),
		// pause the audio, clear the source, and set isLoading to false.
		if (!currentStation) {
			activeAudioRef.current.pause();
			activeAudioRef.current.src = "";
			setIsLoading(false);
			return;
		}

		// Switch to the element matching the station and silence the other one
		const nextElement = currentStation.boost
			? boostAudioRef.current
			: plainAudioRef.current;
		if (nextElement && nextElement !== activeAudioRef.current) {
			activeAudioRef.current.pause();
			activeAudioRef.current.src = "";
			activeAudioRef.current = nextElement;
		}

		// Always pause before changing the source to prevent errors
		activeAudioRef.current.pause();
		activeAudioRef.current.src = currentStation.streamUrl;
		setIsLoading(true);

		const handleCanPlay = () => {
			setIsLoading(false);
			setIsPlaying(true);
		};

		const handleError = () => {
			setIsLoading(false);
			setIsPlaying(false);

			toast.error(
				"Unable to load the stream. This station may be offline."
			);
		};

		activeAudioRef.current.addEventListener("canplay", handleCanPlay);
		activeAudioRef.current.addEventListener("error", handleError);
		activeAudioRef.current.load();

		return () => {
			activeAudioRef.current?.removeEventListener("canplay", handleCanPlay); // prettier-ignore
			activeAudioRef.current?.removeEventListener("error", handleError);
		};
	}, [currentStation]);

	// Control volume change, muting, and per-station gain adjustments.
	// Declared after the station-change effect so it applies to the newly chosen element.
	useEffect(() => {
		const element = activeAudioRef.current;
		if (!element) return;

		const lufs = currentStation?.lufs ?? TARGET_LUFS;
		const graph = boostGraphRef.current;

		if (
			currentStation?.boost &&
			graph &&
			element === boostAudioRef.current
		) {
			element.volume = 1;
			graph.gain.gain.value = isMuted ? 0 : calculateBoostGain(volume, lufs); // prettier-ignore
		} else {
			element.volume = isMuted
				? 0
				: calculateEffectiveVolume(volume, lufs);
		}
	}, [volume, isMuted, currentStation]);

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

			if (station.boost) ensureBoostGraph();
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
		[currentStation, togglePlayPause, ensureBoostGraph]
	);

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
			document.title = "Kollox FM | Maltese Radio Stations in One Place";
		}
	}, [isPlaying, currentStation]);

	return (
		<AudioPlayerContext.Provider
			value={{
				currentStation,
				currentSong,
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
