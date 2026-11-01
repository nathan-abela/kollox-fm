"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "favourites";
const CHANGE_EVENT = "favourites-change";

interface UseFavouritesResult {
	favourites: string[];
	isFavourite: (stationId: string) => boolean;
	toggleFavourite: (stationId: string) => void;
}

function readFavourites(): string[] {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
	} catch {
		return [];
	}
}

/**
 * Manages the user's favourite station ids, persisted to localStorage.
 * Every hook instance re-reads storage on `CHANGE_EVENT`, so a toggle in one
 * component (ex. the now-playing drawer) updates all the others.
 */
export function useFavourites(): UseFavouritesResult {
	const [favourites, setFavourites] = useState<string[]>([]);

	useEffect(() => {
		const sync = () => setFavourites(readFavourites());
		sync();
		window.addEventListener(CHANGE_EVENT, sync);
		return () => window.removeEventListener(CHANGE_EVENT, sync);
	}, []);

	const toggleFavourite = useCallback((stationId: string) => {
		const current = readFavourites();
		const next = current.includes(stationId)
			? current.filter((id) => id !== stationId)
			: [...current, stationId];
		localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
		window.dispatchEvent(new Event(CHANGE_EVENT));
	}, []);

	const isFavourite = useCallback(
		(stationId: string) => favourites.includes(stationId),
		[favourites]
	);

	return { favourites, isFavourite, toggleFavourite };
}
