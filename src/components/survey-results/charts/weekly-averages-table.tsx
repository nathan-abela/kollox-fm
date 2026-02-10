"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, ChevronDown, ChevronUp, TableIcon } from "lucide-react";

import { StationSummary } from "@/lib/types/survey";
import {
	Card,
	CardContent,
	CardDescription,
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

interface WeeklyAveragesTableProps {
	stations: StationSummary[];
	days: string[];
}

/**
 * Component for displaying weekly average listeners in a sortable table.
 *
 * This component renders a table of radio stations with their weekly average listeners,
 * calculated from daily listener counts across the survey period.
 *
 * @param props - Component props
 * @param props.stations - Array of station data with daily listener counts
 * @param props.days - Array of ISO date strings for the survey period
 */
export const WeeklyAveragesTable: React.FC<WeeklyAveragesTableProps> = ({
	stations,
	days,
}) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState<{
		key: "station" | "average" | "share";
		direction: "asc" | "desc";
	}>({
		key: "average",
		direction: "desc",
	});

	const stationsWithAverages = useMemo(() => {
		return stations
			.filter((station) => station.id !== "no-radio")
			.map((station) => {
				const daily = station.dailyListeners || {};
				const sum = days.reduce((acc, d) => acc + (daily[d] ?? 0), 0);
				const avg = days.length > 0 ? Math.round(sum / days.length) : 0;
				const weeklyShare = station.weeklySharePct;
				return { ...station, avg, weeklyShare };
			})
			.sort((a, b) => b.avg - a.avg)
			.map((station, index) => ({ ...station, rank: index + 1 }));
	}, [stations, days]);

	const filteredStations = useMemo(() => {
		return stationsWithAverages
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
					case "average":
						return order * (stationA.avg - stationB.avg);
					case "share":
						// prettier-ignore
						return (order * ((stationA.weeklyShare ?? 0) - (stationB.weeklyShare ?? 0)));
					default:
						return 0;
				}
			});
	}, [stationsWithAverages, searchQuery, sortBy]);

	/**
	 * Handles column sort toggling.
	 */
	const handleSort = (key: typeof sortBy.key) => {
		setSortBy((prevCriteria: typeof sortBy) => ({
			key,
			direction:
				prevCriteria.key === key && prevCriteria.direction === "asc"
					? "desc"
					: "asc",
		}));
	};

	/**
	 * Handles search input changes.
	 */
	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};

	/**
	 * Renders the appropriate sort icon for a column.
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
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg font-semibold">
					<TableIcon className="text-muted-foreground h-5 w-5" />
					Weekly Average Listeners
				</CardTitle>
				<CardDescription>
					Average daily listeners calculated across all surveyed days.
				</CardDescription>
			</CardHeader>

			<CardContent>
				<div className="mb-6 flex">
					<Input
						placeholder="Search stations..."
						value={searchQuery}
						onChange={handleSearchChange}
						className="w-full sm:max-w-sm"
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
								onClick={() => handleSort("average")}
							>
								Weekly Avg. Listeners
								{renderSortIcon("average")}
							</TableHead>
							<TableHead
								className="hover:bg-accent cursor-pointer rounded-sm px-2"
								onClick={() => handleSort("share")}
							>
								Audience Share (%)
								{renderSortIcon("share")}
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
								<TableCell className="tabular-nums">
									{station.avg.toLocaleString()}
								</TableCell>
								<TableCell className="tabular-nums">
									{`${station.weeklyShare}%` || "N/A"}
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
		</Card>
	);
};
