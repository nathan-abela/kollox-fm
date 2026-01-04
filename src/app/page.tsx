"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Radio, Trash2 } from "lucide-react";

import { stations } from "@/lib/data/stations";
import { useAudioPlayer } from "@/lib/hooks/audio-player";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioStationList } from "@/components/radio/radio-station-list";
import { SkeletonStation } from "@/components/radio/skeleton-station";
import { SurveyToast } from "@/components/survey-toast";

type SortOption = "name" | "location" | "popularity";

// TODO:
// - SelectContent (Sort By) is removing page scroll when open - https://github.com/shadcn-ui/ui/issues/4227#issuecomment-2438290165
// - Consider extracting Search + Sort controls into a <SearchSortControls /> component

export default function Home() {
	// State for search input
	const [searchTerm, setSearchTerm] = useState("");
	// State for sort option
	const [sortBy, setSortBy] = useState<SortOption>("popularity"); // Default sort by popularity
	// State for favourites
	const [favourites, setFavourites] = useState<string[]>([]);
	// State for selected tab
	const [selectedTab, setSelectedTab] = useState("local");

	// Debounce the search input to avoid frequent ui changes
	const debouncedSearchTerm = useDebounce(searchTerm, 50);

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

	const enabledStationsCount = useMemo(
		() => stations.filter((s) => s.isEnabled !== false).length,
		[]
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

	// On mount initialize favourites from localStorage
	useEffect(() => {
		const storedFavourites = JSON.parse(
			localStorage.getItem("favourites") || "[]"
		);
		setFavourites(storedFavourites);
	}, []);

	// When favourites change update localStorage
	useEffect(() => {
		localStorage.setItem("favourites", JSON.stringify(favourites));
	}, [favourites]);

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

	const isFavourite = (id: string) => favourites.includes(id);
	const onToggleFavourite = (stationId: string) => {
		setFavourites((currentFavourites) =>
			currentFavourites.includes(stationId)
				? currentFavourites.filter((id) => id !== stationId)
				: [...currentFavourites, stationId]
		);
	};

	// Tabs for which search/ sort controls should be disabled
	const disabledSearchSortTabs = ["favourites", "recent"];
	const isSearchSortDisabled = disabledSearchSortTabs.includes(selectedTab);

	return (
		<div className="container mx-auto pb-12">
			{/* Page header section */}
			<section className="py-6 md:py-8">
				<div className="bg-card relative overflow-hidden rounded-xl border p-6 md:p-8">
					<div className="relative z-10 flex flex-col items-center gap-6 md:flex-row">
						<div className="flex flex-1 flex-col gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
							<div className="flex-1 space-y-3">
								{/* Main title and description */}
								<h2 className="text-foreground text-2xl font-bold tracking-tight md:text-3xl">
									Explore Malta&apos;s Radio Stations
								</h2>
								<p className="text-muted-foreground max-w-2xl text-sm md:text-lg">
									All your favourite Maltese stations in one
									place. Free, live, and local!
								</p>

								{/* Status indicators */}
								<div className="text-muted-foreground flex flex-wrap items-center justify-center gap-4 text-xs md:justify-start md:text-sm">
									<div className="flex items-center gap-2">
										<div className="h-2 w-2 rounded-full bg-green-500"></div>
										{/* prettier-ignore */}
										<span>
											{enabledStationsCount} Available Stations
										</span>
									</div>
									<div className="flex items-center gap-2">
										<div className="h-2 w-2 rounded-full bg-purple-500"></div>
										<span>Live Metadata</span>
									</div>
								</div>
							</div>

							<div
								className="hidden items-center justify-center md:flex md:items-center md:justify-end"
								aria-hidden="true"
							>
								<Radio className="h-24 w-24 opacity-[0.02] dark:opacity-[0.05]" />
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Search + Sort Controls */}
			<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
				<div
					className={cn(
						"flex-1 space-y-4",
						isSearchSortDisabled && "pointer-events-none opacity-50"
					)}
				>
					<Label htmlFor="search">Search Stations</Label>
					<Input
						id="search"
						placeholder="Search by name or location"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="max-w-md transition-opacity"
					/>
				</div>

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
							onToggleFavourite={onToggleFavourite}
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
								onToggleFavourite={onToggleFavourite}
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
									onToggleFavourite={onToggleFavourite}
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
