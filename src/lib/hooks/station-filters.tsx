"use client";

import { ReactNode, createContext, useContext, useState } from "react";

interface StationFiltersContextType {
	searchTerm: string;
	setSearchTerm: (term: string) => void;
}

const StationFiltersContext = createContext<
	StationFiltersContextType | undefined
>(undefined);

/**
 * Shares the homepage search term with the header search input.
 */
export function StationFiltersProvider({ children }: { children: ReactNode }) {
	const [searchTerm, setSearchTerm] = useState("");

	return (
		<StationFiltersContext.Provider value={{ searchTerm, setSearchTerm }}>
			{children}
		</StationFiltersContext.Provider>
	);
}

/**
 * Hook to access the station filters context.
 * Must be used inside a `<StationFiltersProvider>`.
 */
export function useStationFilters(): StationFiltersContextType {
	const context = useContext(StationFiltersContext);
	if (!context) {
		throw new Error(
			"useStationFilters must be used within a StationFiltersProvider"
		);
	}
	return context;
}
