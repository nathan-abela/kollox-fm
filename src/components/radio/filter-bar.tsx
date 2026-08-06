"use client";

import { cn } from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SegmentedControl } from "@/components/radio/segmented-control";

export type SortOption = "popularity" | "surveyRank" | "name" | "frequency";
export type ViewOption = "all" | "favourites" | "recent";

// TODO: SelectContent (Sort) is removing page scroll when open - https://github.com/shadcn-ui/ui/issues/4227#issuecomment-2438290165

interface FilterBarProps {
	view: ViewOption;
	onViewChange: (view: ViewOption) => void;
	sortBy: SortOption;
	onSortByChange: (sortBy: SortOption) => void;
	sortDisabled?: boolean;
	genres: string[];
	selectedGenre: string | null;
	onGenreChange: (genre: string | null) => void;
}

/**
 * Sticky filter bar under the header: list view switcher, sort select,
 * and a scrollable genre chip row.
 */
export function FilterBar({
	view,
	onViewChange,
	sortBy,
	onSortByChange,
	sortDisabled = false,
	genres,
	selectedGenre,
	onGenreChange,
}: FilterBarProps) {
	return (
		<div className="bg-background sticky top-16 z-30 border-b pt-5 pb-3">
			<div className="flex flex-wrap items-center gap-3">
				<SegmentedControl
					aria-label="Station list"
					value={view}
					onValueChange={(value) => onViewChange(value as ViewOption)}
					options={[
						{ value: "all", label: "All" },
						{ value: "favourites", label: "Favourites" },
						{ value: "recent", label: "Recent" },
					]}
				/>

				<Select
					value={sortBy}
					onValueChange={(value: SortOption) => onSortByChange(value)}
					disabled={sortDisabled}
				>
					<SelectTrigger
						aria-label="Sort stations"
						className="ml-auto w-[170px]"
					>
						<SelectValue placeholder="Sort by" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="popularity">
							Sort: Popularity
						</SelectItem>
						<SelectItem value="surveyRank">
							Sort: Survey rank
						</SelectItem>
						<SelectItem value="name">Sort: Name</SelectItem>
						<SelectItem value="frequency">
							Sort: Frequency
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="mt-3 flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				{genres.map((genre) => {
					const isActive = genre === selectedGenre;
					return (
						<button
							key={genre}
							type="button"
							aria-pressed={isActive}
							onClick={() => onGenreChange(isActive ? null : genre)}
							className={cn(
								"shrink-0 cursor-pointer rounded-md border px-3 py-1 text-xs whitespace-nowrap transition-colors",
								isActive
									? "bg-primary border-primary text-primary-foreground"
									: "text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground"
							)}
						>
							{genre}
						</button>
					);
				})}
			</div>
		</div>
	);
}
