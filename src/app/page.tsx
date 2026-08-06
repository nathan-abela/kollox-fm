"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";

import { stations } from "@/lib/data/stations";
import { useAudioPlayer } from "@/lib/hooks/audio-player";
import { useStationFilters } from "@/lib/hooks/station-filters";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useFavourites } from "@/lib/hooks/use-favourites";
import { RadioStation } from "@/lib/types/radio";
import { Button } from "@/components/ui/button";
import {
	FilterBar,
	SortOption,
	ViewOption,
} from "@/components/radio/filter-bar";
import { HomeHero } from "@/components/radio/home-hero";
import { RadioStationList } from "@/components/radio/radio-station-list";
import { SkeletonStation } from "@/components/radio/skeleton-station";
import { SurveyToast } from "@/components/survey-toast";

const enabledStations = stations.filter((s) => s.isEnabled !== false);

const genreCounts = new Map<string, number>();
for (const station of enabledStations) {
	for (const genre of station.genres ?? []) {
		genreCounts.set(genre, (genreCounts.get(genre) ?? 0) + 1);
	}
}
const topGenres = [...genreCounts.entries()]
	.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
	.slice(0, 12)
	.map(([genre]) => genre);

const sortComparators: Record<
	SortOption,
	(a: RadioStation, b: RadioStation) => number
> = {
	popularity: (a, b) =>
		(a.popularity ?? Number.MAX_SAFE_INTEGER) -
		(b.popularity ?? Number.MAX_SAFE_INTEGER),
	surveyRank: (a, b) =>
		(a.surveyRank ?? Number.MAX_SAFE_INTEGER) -
		(b.surveyRank ?? Number.MAX_SAFE_INTEGER),
	name: (a, b) => a.name.localeCompare(b.name),
	frequency: (a, b) =>
		(a.fmFrequency ? parseFloat(a.fmFrequency) : Number.MAX_SAFE_INTEGER) -
		(b.fmFrequency ? parseFloat(b.fmFrequency) : Number.MAX_SAFE_INTEGER),
};

const viewTitles: Record<ViewOption, string> = {
	all: "All stations",
	favourites: "Favourites",
	recent: "Recently played",
};

function EmptyState({
	title,
	description,
	actionLabel,
	onAction,
}: {
	title: string;
	description: string;
	actionLabel: string;
	onAction: () => void;
}) {
	return (
		<div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-14 text-center">
			<h3 className="mb-1.5 text-lg font-semibold">{title}</h3>
			<p className="text-muted-foreground mb-5 text-sm">{description}</p>
			<Button
				variant="outline"
				size="sm"
				onClick={onAction}
				className="cursor-pointer"
			>
				{actionLabel}
			</Button>
		</div>
	);
}

export default function Home() {
	const [view, setView] = useState<ViewOption>("all");
	const [sortBy, setSortBy] = useState<SortOption>("popularity");
	const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

	// Search term shared with the header search input, debounced to avoid frequent ui changes
	const { searchTerm } = useStationFilters();
	const debouncedSearchTerm = useDebounce(searchTerm, 50);

	// Favourite stations persisted to localStorage
	const { favourites, isFavourite, toggleFavourite } = useFavourites();
	const { recentlyPlayed, setStationsOrder, clearRecentlyPlayed } =
		useAudioPlayer();

	const visibleStations = useMemo(() => {
		let list = enabledStations;

		if (view === "favourites") {
			list = list.filter((s) => favourites.includes(s.id));
		} else if (view === "recent") {
			list = list
				.filter((s) => recentlyPlayed.includes(s.id))
				.sort(
					(a, b) =>
						recentlyPlayed.indexOf(a.id) - recentlyPlayed.indexOf(b.id)
				);
		}

		if (selectedGenre) {
			list = list.filter((s) => s.genres?.includes(selectedGenre));
		}

		const term = debouncedSearchTerm.trim().toLowerCase();
		if (term) {
			list = list.filter(
				(s) =>
					s.name.toLowerCase().includes(term) ||
					s.location.toLowerCase().includes(term) ||
					s.genres?.some((g) => g.toLowerCase().includes(term))
			);
		}

		// Recently played keeps its play order instead of sorting
		if (view === "recent") return list;

		const featured = list.filter((s) => s.isFeatured);
		const standard = list
			.filter((s) => !s.isFeatured)
			.sort(sortComparators[sortBy]);
		return [...featured, ...standard];
	}, [
		view,
		favourites,
		recentlyPlayed,
		selectedGenre,
		debouncedSearchTerm,
		sortBy,
	]);

	// Keep player prev/ next cycling through exactly what is on screen
	useEffect(() => {
		setStationsOrder(visibleStations);
	}, [visibleStations, setStationsOrder]);

	const showFavouritesEmpty = view === "favourites" && favourites.length === 0;
	const showRecentEmpty = view === "recent" && recentlyPlayed.length === 0;

	return (
		<div className="container mx-auto px-4 pb-12">
			<HomeHero />

			<FilterBar
				view={view}
				onViewChange={setView}
				sortBy={sortBy}
				onSortByChange={setSortBy}
				sortDisabled={view === "recent"}
				genres={topGenres}
				selectedGenre={selectedGenre}
				onGenreChange={setSelectedGenre}
			/>

			<div className="mt-6 mb-4 flex items-baseline gap-2.5">
				<h2 className="text-base font-semibold">{viewTitles[view]}</h2>
				<span className="text-muted-foreground font-mono text-xs">
					{visibleStations.length}
				</span>
				{view === "recent" && recentlyPlayed.length > 0 && (
					<Button
						variant="outline"
						size="sm"
						onClick={clearRecentlyPlayed}
						className="text-muted-foreground hover:text-destructive ml-auto cursor-pointer"
					>
						<Trash2 className="h-4 w-4" />
						Clear All
					</Button>
				)}
			</div>

			{showFavouritesEmpty ? (
				<EmptyState
					title="No favourites yet"
					description="Tap the heart on any station to keep it here."
					actionLabel="Browse stations"
					onAction={() => setView("all")}
				/>
			) : showRecentEmpty ? (
				<EmptyState
					title="No recently played stations yet"
					description="Start listening and stations will appear here."
					actionLabel="Browse stations"
					onAction={() => setView("all")}
				/>
			) : (
				<Suspense fallback={<SkeletonStation />}>
					<RadioStationList
						stations={visibleStations}
						isFavourite={isFavourite}
						onToggleFavourite={toggleFavourite}
					/>
				</Suspense>
			)}

			<SurveyToast />
		</div>
	);
}
