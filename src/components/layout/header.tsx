"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

import { useStationFilters } from "@/lib/hooks/station-filters";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
	{
		href: "/",
		label: "Stations",
		isActive: (pathname: string) => pathname === "/" || pathname.startsWith("/station/"), // prettier-ignore
		// Below sm the site name link covers this destination
		className: "hidden sm:inline-flex",
	},
	{
		href: "/survey-results",
		label: "Survey Results",
		isActive: (pathname: string) => pathname.startsWith("/survey-results"),
		className: "inline-flex",
	},
];

export function Header() {
	const pathname = usePathname();
	const router = useRouter();
	const { searchTerm, setSearchTerm } = useStationFilters();
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	const handleSearchChange = (value: string) => {
		setSearchTerm(value);
		// The station grid lives on the homepage, so searching elsewhere navigates there
		if (pathname !== "/") router.push("/");
	};

	const closeSearch = () => setIsSearchOpen(false);

	const clearAndCloseSearch = () => {
		setSearchTerm("");
		closeSearch();
	};

	return (
		<header className="bg-background sticky top-0 z-40 w-full border-b">
			<div className="relative container mx-auto flex h-16 items-center gap-2 px-4 sm:gap-4">
				<Link href="/" className="shrink-0 text-lg font-bold">
					Kollox FM
				</Link>

				<nav
					aria-label="Main"
					className="flex shrink-0 items-center gap-1"
				>
					{navLinks.map((link) => {
						const active = link.isActive(pathname);
						return (
							<Link
								key={link.href}
								href={link.href}
								aria-current={active ? "page" : undefined}
								className={cn(
									"h-9 items-center rounded-md px-2 text-sm font-medium whitespace-nowrap transition-colors sm:px-3",
									link.className,
									active
										? "bg-accent text-foreground"
										: "text-muted-foreground hover:text-foreground"
								)}
							>
								{link.label}
							</Link>
						);
					})}
				</nav>

				<div className="relative ml-auto hidden w-full max-w-xs md:block lg:max-w-sm">
					<Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
					<Input
						type="search"
						placeholder="Search station, locality or genre"
						aria-label="Search stations"
						value={searchTerm}
						onChange={(e) => handleSearchChange(e.target.value)}
						className="h-9 pl-9"
					/>
				</div>

				{/* Below md the search is a button that opens a full-width input over the header row */}
				<Button
					variant="ghost"
					size="icon"
					aria-label="Search stations"
					onClick={() => setIsSearchOpen(true)}
					className="ml-auto size-10 cursor-pointer md:hidden"
				>
					<Search className="h-5 w-5" />
				</Button>

				<ThemeToggle />

				{isSearchOpen && (
					<div className="bg-background absolute inset-0 z-10 flex items-center gap-2 px-4 md:hidden">
						<div className="relative flex-1">
							<Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
							{/* Enter keeps the term and closes, Escape or the X clears it. The browser's own clear button is hidden. */}
							<Input
								type="search"
								autoFocus
								enterKeyHint="search"
								placeholder="Search station, locality or genre"
								aria-label="Search stations"
								value={searchTerm}
								onChange={(e) =>
									handleSearchChange(e.target.value)
								}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.currentTarget.blur();
										closeSearch();
									}
									if (e.key === "Escape")
										clearAndCloseSearch();
								}}
								className="h-10 pl-9 [&::-webkit-search-cancel-button]:hidden"
							/>
						</div>
						<Button
							variant="ghost"
							size="icon"
							aria-label="Clear and close search"
							onClick={clearAndCloseSearch}
							className="size-10 cursor-pointer"
						>
							<X className="h-5 w-5" />
						</Button>
					</div>
				)}
			</div>
		</header>
	);
}
