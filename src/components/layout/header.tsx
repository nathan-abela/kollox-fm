"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Radio, Search } from "lucide-react";

import { useStationFilters } from "@/lib/hooks/station-filters";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
	const pathname = usePathname();
	const router = useRouter();
	const { searchTerm, setSearchTerm } = useStationFilters();

	const handleSearchChange = (value: string) => {
		setSearchTerm(value);
		// The station grid lives on the homepage, so searching elsewhere navigates there
		if (pathname !== "/") router.push("/");
	};

	return (
		<header className="bg-background sticky top-0 z-40 w-full border-b">
			<div className="container mx-auto flex h-16 items-center gap-4 px-4">
				<Link
					href="/"
					className="flex shrink-0 items-center gap-2 text-lg font-bold"
				>
					<Radio className="text-primary h-6 w-6" />
					Kollox FM
				</Link>

				<div className="relative ml-auto w-full max-w-[180px] min-[425px]:max-w-xs sm:max-w-sm">
					<Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
					<Input
						type="search"
						placeholder="Search station, town or genre"
						aria-label="Search stations"
						value={searchTerm}
						onChange={(e) => handleSearchChange(e.target.value)}
						className="h-9 pl-9"
					/>
				</div>

				<ThemeToggle />
			</div>
		</header>
	);
}
