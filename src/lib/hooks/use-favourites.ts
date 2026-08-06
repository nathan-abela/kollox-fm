"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "favourites";

interface UseFavouritesResult {
	favourites: string[];
	isFavourite: (stationId: string) => boolean;
	toggleFavourite: (stationId: string) => void;
}

/**
 * Manages the user's favourite station ids, persisted to localStorage.
 * Storage writes happen inside the toggle action (not an effect) so the
 * stored list is never clobbered before the mount read completes.
 */
export function useFavourites(): UseFavouritesResult {
	const [favourites, setFavourites] = useState<string[]>([]);

	useEffect(() => {
		try {
			setFavourites(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
		} catch {
			setFavourites([]);
		}
	}, []);

	const toggleFavourite = useCallback((stationId: string) => {
		setFavourites((current) => {
			const next = current.includes(stationId)
				? current.filter((id) => id !== stationId)
				: [...current, stationId];
			localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
			return next;
		});
	}, []);

	const isFavourite = useCallback(
		(stationId: string) => favourites.includes(stationId),
		[favourites]
	);

	return { favourites, isFavourite, toggleFavourite };
}
