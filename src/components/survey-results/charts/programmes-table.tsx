"use client";

import { useMemo, useState } from "react";
import {
	ArrowUpDown,
	ChevronDown,
	ChevronUp,
	TableIcon,
	Users,
} from "lucide-react";

import { ProgrammeSummary } from "@/lib/types/survey";
import { Badge } from "@/components/ui/badge";
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

type SortKey = "programme" | "station" | "percentage" | "respondents";

/**
 * Component for displaying all radio programmes with demographic breakdown in a sortable table.
 *
 * @param props - Component props
 * @param props.programmes - Array of programme data with demographic breakdowns
 */
export function ProgrammesTable({
	programmes,
}: {
	programmes: ProgrammeSummary[];
}) {
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState<{
		key: SortKey;
		direction: "asc" | "desc";
	}>({
		key: "percentage",
		direction: "desc",
	});

	const programmesWithRank = useMemo(() => {
		// Filter out "No preferred programme" and add rank
		return programmes
			.filter((p) => p.id !== "no-preferred-programme")
			.sort((a, b) => b.percentage - a.percentage)
			.map((programme, index) => ({ ...programme, rank: index + 1 }));
	}, [programmes]);

	const filteredProgrammes = useMemo(() => {
		return programmesWithRank
			.filter((programme) => {
				const query = searchQuery.toLowerCase();
				return (
					programme.name.toLowerCase().includes(query) ||
					programme.station?.toLowerCase().includes(query) ||
					false
				);
			})
			.sort((a, b) => {
				const { key, direction } = sortBy;
				const order = direction === "asc" ? 1 : -1;

				switch (key) {
					case "programme":
						return order * a.name.localeCompare(b.name);
					case "station":
						return (
							order *
							(a.station || "").localeCompare(b.station || "")
						);
					case "percentage":
						return order * (a.percentage - b.percentage);
					case "respondents":
						return (order * (a.totalRespondents - b.totalRespondents)); // prettier-ignore
					default:
						return 0;
				}
			});
	}, [programmesWithRank, searchQuery, sortBy]);

	const handleSort = (key: SortKey) => {
		setSortBy((prev) => ({
			key,
			direction:
				prev.key === key && prev.direction === "asc" ? "desc" : "asc",
		}));
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};

	const renderSortIcon = (key: SortKey) => {
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
		<Card className="rounded-2xl shadow-md">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg font-semibold">
					<TableIcon className="text-muted-foreground h-5 w-5" />
					All Radio Programmes
				</CardTitle>
				<CardDescription>
					Complete list of radio programmes with demographic breakdown
				</CardDescription>
			</CardHeader>

			<CardContent>
				<div className="mb-6 flex items-center gap-4">
					<Input
						placeholder="Search programmes or stations..."
						value={searchQuery}
						onChange={handleSearchChange}
						className="max-w-sm"
					/>
					<div className="text-muted-foreground flex items-center gap-2 text-sm">
						<Users className="h-4 w-4" />
						<span>
							{filteredProgrammes.length} programme
							{filteredProgrammes.length !== 1 ? "s" : ""}
						</span>
					</div>
				</div>

				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-16">Rank</TableHead>

								<TableHead
									className="hover:bg-accent min-w-[280px] cursor-pointer rounded-sm px-2"
									onClick={() => handleSort("programme")}
								>
									Programme {renderSortIcon("programme")}
								</TableHead>

								<TableHead
									className="hover:bg-accent min-w-[140px] cursor-pointer rounded-sm px-2"
									onClick={() => handleSort("station")}
								>
									Station {renderSortIcon("station")}
								</TableHead>

								<TableHead
									className="hover:bg-accent cursor-pointer rounded-sm px-2 text-right"
									onClick={() => handleSort("percentage")}
								>
									Preference %{renderSortIcon("percentage")}
								</TableHead>

								<TableHead
									className="hover:bg-accent cursor-pointer rounded-sm px-2 text-right"
									onClick={() => handleSort("respondents")}
								>
									Respondents
									{renderSortIcon("respondents")}
								</TableHead>

								<TableHead className="text-center">
									Age 12-20
								</TableHead>
								<TableHead className="text-center">
									Age 21-30
								</TableHead>
								<TableHead className="text-center">
									Age 31-40
								</TableHead>
								<TableHead className="text-center">
									Age 41-50
								</TableHead>
								<TableHead className="text-center">
									Age 51-60
								</TableHead>
								<TableHead className="text-center">
									Age 61-70
								</TableHead>
								<TableHead className="text-center">
									Age 71+
								</TableHead>

								<TableHead className="text-center">
									Male %
								</TableHead>
								<TableHead className="text-center">
									Female %
								</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{filteredProgrammes.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={15}
										className="text-muted-foreground h-32 text-center"
									>
										No programmes found matching &quot;
										{searchQuery}&quot;
									</TableCell>
								</TableRow>
							) : (
								filteredProgrammes.map((programme) => (
									<TableRow key={programme.id}>
										<TableCell className="font-medium">
											#{programme.rank}
										</TableCell>

										<TableCell className="font-medium">
											{programme.name}
										</TableCell>

										<TableCell>
											<Badge variant="secondary">
												{programme.station || "N/A"}
											</Badge>
										</TableCell>

										<TableCell className="text-right tabular-nums">
											{programme.percentage.toFixed(1)}%
										</TableCell>

										<TableCell className="text-right tabular-nums">
											{programme.totalRespondents}
										</TableCell>

										{/* Age demographics */}
										<TableCell className="text-center text-sm tabular-nums">
											{programme.ageDemographics
												?.age12to20.percentage
												? `${programme.ageDemographics.age12to20.percentage.toFixed(1)}%`
												: "-"}
										</TableCell>
										<TableCell className="text-center text-sm tabular-nums">
											{programme.ageDemographics
												?.age21to30.percentage
												? `${programme.ageDemographics.age21to30.percentage.toFixed(1)}%`
												: "-"}
										</TableCell>
										<TableCell className="text-center text-sm tabular-nums">
											{programme.ageDemographics
												?.age31to40.percentage
												? `${programme.ageDemographics.age31to40.percentage.toFixed(1)}%`
												: "-"}
										</TableCell>
										<TableCell className="text-center text-sm tabular-nums">
											{programme.ageDemographics
												?.age41to50.percentage
												? `${programme.ageDemographics.age41to50.percentage.toFixed(1)}%`
												: "-"}
										</TableCell>
										<TableCell className="text-center text-sm tabular-nums">
											{programme.ageDemographics
												?.age51to60.percentage
												? `${programme.ageDemographics.age51to60.percentage.toFixed(1)}%`
												: "-"}
										</TableCell>
										<TableCell className="text-center text-sm tabular-nums">
											{programme.ageDemographics
												?.age61to70.percentage
												? `${programme.ageDemographics.age61to70.percentage.toFixed(1)}%`
												: "-"}
										</TableCell>
										<TableCell className="text-center text-sm tabular-nums">
											{programme.ageDemographics
												?.age71plus.percentage
												? `${programme.ageDemographics.age71plus.percentage.toFixed(1)}%`
												: "-"}
										</TableCell>

										{/* Gender demographics */}
										<TableCell className="text-center text-sm tabular-nums">
											{programme.genderDemographics?.male
												.percentage
												? `${programme.genderDemographics.male.percentage.toFixed(1)}%`
												: "-"}
										</TableCell>
										<TableCell className="text-center text-sm tabular-nums">
											{programme.genderDemographics
												?.female.percentage
												? `${programme.genderDemographics.female.percentage.toFixed(1)}%`
												: "-"}
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>

				<p className="text-muted-foreground mt-4 text-xs italic">
					Demographic percentages show preference within each age/
					gender bracket. Total respondents: 1,382 radio listeners.
				</p>
			</CardContent>
		</Card>
	);
}
