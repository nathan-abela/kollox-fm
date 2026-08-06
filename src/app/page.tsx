"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";

import { stations } from "@/lib/data/stations";
import { useAudioPlayer } from "@/lib/hooks/audio-player";
import { useStationFilters } from "@/lib/hooks/station-filters";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useFavourites } from "@/lib/hooks/use-favourites";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HomeHero } from "@/components/radio/home-hero";
import { RadioStationList } from "@/components/radio/radio-station-list";
import { SkeletonStation } from "@/components/radio/skeleton-station";
import { SurveyToast } from "@/components/survey-toast";

type SortOption = "name" | "location" | "popularity" | "surveyRank";

// TODO: SelectContent (Sort By) is removing page scroll when open - https://github.com/shadcn-ui/ui/issues/4227#issuecomment-2438290165

export default function Home() {
	// State for sort option
	const [sortBy, setSortBy] = useState<SortOption>("popularity"); // Default sort by popularity
	// State for selected tab
	const [selectedTab, setSelectedTab] = useState("local");

	// Search term shared with the header search input
	const { searchTerm } = useStationFilters();

	// Debounce the search input to avoid frequent ui changes
	const debouncedSearchTerm = useDebounce(searchTerm, 50);

	const { favourites, isFavourite, toggleFavourite } = useFavourites();

	// Get values from audio player hook
	const { recentlyPlayed, setStationsOrder, clearRecentlyPlayed } =
		useAudioPlayer();

	// Filter and sort stations based on search and sort
	const filteredStations = useMemo(() => {
		const filtered = stations.filter(
			(station) =>
				station.name
					.toLowerCase()
					.includes(debouncedSearchTerm.toLowerCase()) ||
				station.location
					.toLowerCase()
					.includes(debouncedSearchTerm.toLowerCase())
		);

		// Separate featured and standard stations
		const featured = filtered.filter((s) => s.isFeatured);
		const standard = filtered.filter((s) => !s.isFeatured);

		// Sort standard stations based on sort option
		standard.sort((a, b) => {
			switch (sortBy) {
				case "name":
					return a.name.localeCompare(b.name);
				case "location":
					return a.location.localeCompare(b.location);
				case "popularity":
					return (a.popularity ?? 0) - (b.popularity ?? 0);
				case "surveyRank":
					return (
						(a.surveyRank ?? Infinity) - (b.surveyRank ?? Infinity)
					);
				default:
					return 0;
			}
		});

		// Return featured stations first, then sorted standard stations
		return [...featured, ...standard];
	}, [debouncedSearchTerm, sortBy]);

	const favouriteStations = useMemo(
		() => stations.filter((s) => favourites.includes(s.id)),
		[favourites]
	);

	// Get recently played stations in the order they were played
	const recentStations = useMemo(
		() =>
			stations
				.filter((station) => recentlyPlayed.includes(station.id))
				.sort(
					(a, b) =>
						recentlyPlayed.indexOf(a.id) -
						recentlyPlayed.indexOf(b.id)
				),
		[recentlyPlayed]
	);

	// Update stations order in audio player context when filtered stations change
	useEffect(() => {
		if (selectedTab === "local") {
			setStationsOrder(filteredStations);
		} else if (selectedTab === "favourites") {
			setStationsOrder(favouriteStations);
		} else if (selectedTab === "recent") {
			setStationsOrder(recentStations);
		}
	}, [
		selectedTab,
		filteredStations,
		favouriteStations,
		recentStations,
		setStationsOrder,
	]);

	// Tabs for which search/ sort controls should be disabled
	const disabledSearchSortTabs = ["favourites", "recent"];
	const isSearchSortDisabled = disabledSearchSortTabs.includes(selectedTab);

	return (
		<div className="container mx-auto px-4 pb-12">
			<HomeHero />

			{/* Sort Controls */}
			<div className="flex justify-end">
				<div
					className={cn(
						"w-full space-y-4 md:w-[180px]",
						isSearchSortDisabled && "pointer-events-none opacity-50"
					)}
				>
					<Label htmlFor="sort">Sort By</Label>
					<Select
						value={sortBy}
						onValueChange={(value: SortOption) => setSortBy(value)}
					>
						<SelectTrigger id="sort" className="w-[180px]">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="popularity">
								Popularity
							</SelectItem>
							<SelectItem value="surveyRank">
								Survey Rank
							</SelectItem>
							<SelectItem value="name">Name</SelectItem>
							<SelectItem value="location">Location</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Tabs for station lists */}
			<Tabs
				defaultValue="local"
				onValueChange={setSelectedTab}
				className="mt-4 w-full"
			>
				<TabsList className="bg-input/30 dark:bg-input/30 flex flex-wrap gap-2 rounded-md border p-0 md:flex-nowrap">
					{/* TODO: Consider adding tab count, example, Favourites (2) */}
					{[
						{ value: "local", label: "Local Stations" },
						{ value: "favourites", label: "Favourites" },
						{ value: "recent", label: "Recently Played" },
					].map((tab) => (
						<TabsTrigger
							key={tab.value}
							value={tab.value}
							className="data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground flex cursor-pointer rounded-md px-3 py-1.5 text-sm transition-colors"
						>
							{tab.label}
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent
					value="local"
					className="mt-12 [@media(min-width:348px)]:mt-4"
				>
					<Suspense fallback={<SkeletonStation />}>
						<RadioStationList
							stations={filteredStations}
							isFavourite={isFavourite}
							onToggleFavourite={toggleFavourite}
						/>
					</Suspense>
				</TabsContent>

				<TabsContent value="favourites" className="mt-4">
					{favourites.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<h3 className="mb-2 text-xl font-semibold">
								No favourite stations yet.
							</h3>
							<p className="text-muted-foreground">
								Mark stations as favourites to see them here.
							</p>
						</div>
					) : (
						<Suspense fallback={<SkeletonStation />}>
							<RadioStationList
								stations={favouriteStations}
								isFavourite={isFavourite}
								onToggleFavourite={toggleFavourite}
							/>
						</Suspense>
					)}
				</TabsContent>

				{/* Disable Search Sort By in this view */}
				<TabsContent value="recent" className="mt-4">
					{recentlyPlayed.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<h3 className="mb-2 text-xl font-semibold">
								No recently played stations yet.
							</h3>
							<p className="text-muted-foreground">
								Start listening to stations and they will appear
								here.
							</p>
						</div>
					) : (
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-medium">
									Recently Played ({recentlyPlayed.length})
								</h3>
								<Button
									variant="outline"
									size="sm"
									onClick={clearRecentlyPlayed}
									className="text-muted-foreground hover:text-destructive cursor-pointer"
								>
									<Trash2 className="h-4 w-4" />
									Clear All
								</Button>
							</div>
							<Suspense fallback={<SkeletonStation />}>
								<RadioStationList
									stations={recentStations}
									isFavourite={isFavourite}
									onToggleFavourite={toggleFavourite}
								/>
							</Suspense>
						</div>
					)}
				</TabsContent>
			</Tabs>

			<SurveyToast />
		</div>
	);
}
