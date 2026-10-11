"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Radio, Search } from "lucide-react";

import { useStationFilters } from "@/lib/hooks/station-filters";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
	{
		href: "/",
		label: "Stations",
		isActive: (pathname: string) => pathname === "/" || pathname.startsWith("/station/"), // prettier-ignore
	},
	{
		href: "/survey-results",
		label: "Survey results",
		isActive: (pathname: string) => pathname.startsWith("/survey-results"),
	},
];

export function Header() {
	const pathname = usePathname();
	const router = useRouter();
	const { searchTerm, setSearchTerm } = useStationFilters();
	// The full search placeholder only fits once the input reaches its sm width
	const isNarrow = useMediaQuery("(max-width: 639px)");

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

				<nav
					aria-label="Main"
					className="hidden items-center gap-1 md:flex"
				>
					{navLinks.map((link) => {
						const active = link.isActive(pathname);
						return (
							<Link
								key={link.href}
								href={link.href}
								aria-current={active ? "page" : undefined}
								className={cn(
									"inline-flex h-9 items-center rounded-md px-3 text-sm font-medium transition-colors",
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

				<div className="relative ml-auto w-full max-w-[180px] min-[425px]:max-w-xs sm:max-w-sm">
					<Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
					<Input
						type="search"
						placeholder={
							isNarrow
								? "Search"
								: "Search station, locality or genre"
						}
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
