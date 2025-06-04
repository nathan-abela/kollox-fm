"use client";

import { Suspense, useState } from "react";

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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { PlayerBar } from "@/components/player-bar";
import { RadioStationList } from "@/components/radio-station-list";

type SortOption = "name" | "location" | "popularity";

// TODO:
// - Hook up favourite toggle
// - Add Tab List UI (e.g. All, Favourites, Recently Played)
// - Add debounce for search input
// - Consider extracting Search + Sort controls into a <SearchSortControls /> component

export default function Home() {
	// State for search input
	const [searchTerm, setSearchTerm] = useState("");
	// State for sort option
	const [sortBy, setSortBy] = useState<SortOption>("popularity"); // Default sort by popularity

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
			<Tabs defaultValue="local" className="w-full">
				{/* TODO: Add Tab List - Stations - Favourites - Recently Played */}
				<TabsContent value="local" className="mt-6">
					<Suspense fallback={<SkeletonStation />}>
						<RadioStationList stations={filteredStations} />
					</Suspense>
				</TabsContent>
			</Tabs>

			{/* Fixed audio player bar at the bottom of the screen */}
			<PlayerBar />
		</div>
	);
}
