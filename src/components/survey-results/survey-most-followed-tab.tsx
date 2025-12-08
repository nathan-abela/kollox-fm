"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, ChevronDown, ChevronUp, TableIcon } from "lucide-react";

import { Survey } from "@/lib/types/survey";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";

/**
 * Component for displaying the "Most Followed Radio Stations" tab in the survey results.
 *
 * This component renders a table of radio stations ranked by followers, weekly share, and estimated listeners.
 * It includes search and sorting functionality for better user interaction.
 *
 * @param {Object} props - The component props.
 * @param {Survey} props.survey - The survey data containing station information.
 */
export function SurveyMostFollowedTab({ survey }: { survey: Survey }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState<{
		key: "station" | "followers" | "listeners";
		direction: "asc" | "desc";
	}>({
		key: "followers",
		direction: "desc",
	});

	const filteredStations = useMemo(() => {
		const stations = survey.stations || [];

		// Static rank based on the default sorting (followers descending)
		const rankedStations = stations
			.filter((station) => station.id !== "no-radio")
			.map((station, index) => ({ ...station, rank: index + 1 }))
			.sort((stationA, stationB) => {
				return (
					(stationB.mostFollowedPct ?? 0) -
					(stationA.mostFollowedPct ?? 0)
				);
			});

		return rankedStations
			.filter((station) =>
				station.label.toLowerCase().includes(searchQuery.toLowerCase())
			)
			.sort((stationA, stationB) => {
				const { key, direction } = sortBy;
				const order = direction === "asc" ? 1 : -1;

				switch (key) {
					case "station":
						// prettier-ignore
						return (order * stationA.label.localeCompare(stationB.label));
					case "followers":
						// prettier-ignore
						return (order * ((stationA.mostFollowedPct ?? 0) - (stationB.mostFollowedPct ?? 0)));
					case "listeners":
						// prettier-ignore
						return (order * ((stationA.stationListeners ?? 0) - (stationB.stationListeners ?? 0)));
					default:
						return 0;
				}
			});
	}, [survey.stations, searchQuery, sortBy]);

	const handleSort = (key: typeof sortBy.key) => {
		setSortBy((prevCriteria: typeof sortBy) => ({
			key,
			direction:
				prevCriteria.key === key && prevCriteria.direction === "asc" ? "desc" : "asc", // prettier-ignore
		}));
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};

	/**
	 * Renders the appropriate sort icon for a given column.
	 *
	 * @param {"station" | "followers" | "share" | "listeners"} key - The key of the column.
	 */
	const renderSortIcon = (key: typeof sortBy.key) => {
		if (sortBy.key !== key) {
			return (
				<ArrowUpDown className="ml-2 inline-block h-3 w-3 opacity-50" />
			);
		}
		return sortBy.direction === "asc" ? (
			<ChevronUp className="ml-2 inline-block h-3 w-3" />
		) : (
			<ChevronDown className="ml-2 inline-block h-3 w-3" />
		);
	};

	return (
		<TabsContent value="followers" className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg font-semibold">
						<TableIcon className="text-muted-foreground h-5 w-5" />
						Most Followed Radio Stations
					</CardTitle>
					<CardDescription>
						Ranking of stations by followers, weekly share, and
						estimated listeners.
					</CardDescription>
				</CardHeader>

				<CardContent>
					<div className="mb-6 flex">
						<Input
							placeholder="Search stations..."
							value={searchQuery}
							onChange={handleSearchChange}
							className="max-w-sm"
						/>
					</div>

					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Rank</TableHead>

								<TableHead
									className="hover:bg-accent cursor-pointer rounded-sm px-2"
									onClick={() => handleSort("station")}
								>
									Station {renderSortIcon("station")}
								</TableHead>

								<TableHead
									className="hover:bg-accent cursor-pointer rounded-sm px-2"
									onClick={() => handleSort("followers")}
								>
									Followers % {renderSortIcon("followers")}
								</TableHead>

								<TableHead
									className="hover:bg-accent cursor-pointer rounded-sm px-2"
									onClick={() => handleSort("listeners")}
								>
									Listeners {renderSortIcon("listeners")}
								</TableHead>

								<TableHead className="w-[140px] px-2 text-right">
									FM Frequency
								</TableHead>
								<TableHead className="w-[140px] px-2 text-right">
									Location
								</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{filteredStations.map((station) => (
								<TableRow key={station.id}>
									<TableCell className="font-medium">
										#{station.rank}
									</TableCell>
									<TableCell className="font-medium">
										{station.label}
									</TableCell>
									<TableCell>
										{station.mostFollowedPct != null
											? `${station.mostFollowedPct.toFixed(1)}%`
											: "N/A"}
									</TableCell>

									{/* prettier-ignore */}
									<TableCell>
										{station.stationListeners?.toLocaleString() ?? "N/A"}
									</TableCell>
									<TableCell className="text-right">
										{station.fmFrequency || "N/A"}
									</TableCell>
									<TableCell className="text-right">
										{station.location || "N/A"}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>

				<CardFooter>
					<p className="text-muted-foreground text-xs italic">
						Respondents could name up to 3 stations they listen.
						Percentages are based on Malta population aged 12+.
					</p>
				</CardFooter>
			</Card>
		</TabsContent>
	);
}
