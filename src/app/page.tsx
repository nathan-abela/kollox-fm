"use client";

import { Suspense, useEffect, useState } from "react";

import { stations } from "@/lib/data/stations";
import { useAudioPlayer } from "@/lib/hooks/audio-player";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SkeletonStation } from "@/components/ui/skeleton-station";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayerBar } from "@/components/player-bar";
import { RadioStationList } from "@/components/radio-station-list";

type SortOption = "name" | "location" | "popularity";

// TODO:
// - SelectContent (Sort By) is removing page scroll when open - https://github.com/shadcn-ui/ui/issues/4227#issuecomment-2438290165
// - Hook up favourite toggle
// - Add Tab List UI (e.g. All, Favourites, Recently Played)
// - Add debounce for search input
// - Consider extracting Search + Sort controls into a <SearchSortControls /> component

export default function Home() {
	// State for search input
	const [searchTerm, setSearchTerm] = useState("");
	// State for sort option
	const [sortBy, setSortBy] = useState<SortOption>("popularity"); // Default sort by popularity
	// State for favourites
	const [favourites, setFavourites] = useState<string[]>([]);

	// Get currentStation from audio player hook
	const { currentStation } = useAudioPlayer();

	// Filter and sort stations based on search and sort
	const filteredStations = stations
		.filter(
			(station) =>
				station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				station.location
					.toLowerCase()
					.includes(searchTerm.toLowerCase())
		)
		.sort((a, b) => {
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

	/**
	 * On mount initialize favourites from localStorage
	 */
	useEffect(() => {
		const storedFavourites = JSON.parse(
			localStorage.getItem("favourites") || "[]"
		);
		setFavourites(storedFavourites);
	}, []);

	/**
	 * When favourites change update localStorage
	 */
	useEffect(() => {
		localStorage.setItem("favourites", JSON.stringify(favourites));
	}, [favourites]);

	const isFavourite = (id: string) => favourites.includes(id);
	const onToggleFavourite = (stationId: string) => {
		setFavourites((currentFavourites) =>
			currentFavourites.includes(stationId)
				? currentFavourites.filter((id) => id !== stationId)
				: [...currentFavourites, stationId]
		);
	};

	return (
		// Main content container. Adds extra bottom padding if player bar is visible
		<div
			className={`container mx-auto ${currentStation ? "pb-40" : "pb-20"}`}
		>
			{/* Page header section */}
			<section className="space-y-4 py-8 md:py-12">
				<h2 className="text-3xl font-bold tracking-tight">
					Browse Local Radio Stations
				</h2>
				<p className="text-muted-foreground">
					Discover and listen to your favourite Maltese radio
					stations!
				</p>
			</section>

			{/* Search + Sort Controls */}
			<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
				<div className="flex-1 space-y-4">
					<Label htmlFor="search">Search Stations</Label>
					<Input
						id="search"
						placeholder="Search by name or location"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="max-w-md"
					/>
				</div>

				<div className="w-full space-y-4 md:w-[180px]">
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
			<Tabs defaultValue="local" className="mt-4 w-full">
				<TabsList className="bg-input/30 dark:bg-input/30 flex gap-2 rounded-md border p-0">
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

				<TabsContent value="local" className="mt-4">
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
						<p className="text-muted-foreground text-sm">
							No favourites yet.
						</p>
					) : (
						<Suspense fallback={<SkeletonStation />}>
							<RadioStationList
								stations={stations.filter((s) =>
									favourites.includes(s.id)
								)}
								isFavourite={isFavourite}
								onToggleFavourite={onToggleFavourite}
							/>
						</Suspense>
					)}
				</TabsContent>

				<TabsContent value="recent" className="mt-4">
					<p className="text-muted-foreground text-sm">
						No recently played stations yet.
					</p>
				</TabsContent>
			</Tabs>

			{/* Fixed audio player bar at the bottom of the screen */}
			<PlayerBar stationsOrder={filteredStations} />
		</div>
	);
}
