"use client";

import { Suspense, useState } from "react";

import { stations } from "@/lib/data/stations";
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
import { RadioStationList } from "@/components/radio-station-list";

// TODO:
// - Hook up favourite toggle
// - Add Tab List UI (e.g. All, Favourites, Recently Played)
// - Add debounce for search input
// - Consider extracting Search + Sort controls into a <SearchSortControls /> component

export default function Home() {
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState<"name" | "location">("name");

	const filteredStations = stations
		.filter(
			(station) =>
				station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				station.location
					.toLowerCase()
					.includes(searchTerm.toLowerCase())
		)
		.sort((a, b) => {
			if (sortBy === "name") {
				return a.name.localeCompare(b.name);
			} else if (sortBy === "location") {
				return a.location.localeCompare(b.location);
			}
			return 0;
		});

	return (
		<div className="container mx-auto pb-20">
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
						onValueChange={(value) =>
							setSortBy(value as "name" | "location")
						}
					>
						<SelectTrigger id="sort" className="w-[180px]">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="name">Name</SelectItem>
							<SelectItem value="location">Location</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<Tabs defaultValue="local" className="w-full">
				{/* TODO: Add Tab List - Stations - Favourites - Recently Played */}
				<TabsContent value="local" className="mt-6">
					<Suspense fallback={<SkeletonStation />}>
						<RadioStationList stations={filteredStations} />
					</Suspense>
				</TabsContent>
			</Tabs>
		</div>
	);
}
