import { useSyncExternalStore } from "react";

/**
 * Tracks whether a CSS media query currently matches.
 * Returns `false` during prerender so the static export never diverges
 * from the first client render.
 */
export function useMediaQuery(query: string): boolean {
	return useSyncExternalStore(
		(onChange) => {
			const mediaQueryList = window.matchMedia(query);
			mediaQueryList.addEventListener("change", onChange);
			return () => mediaQueryList.removeEventListener("change", onChange);
		},
		() => window.matchMedia(query).matches,
		() => false
	);
}
