"use client";

import Link from "next/link";
import { Radio } from "lucide-react";

import { ThemeToggle } from "./theme-toggle";

export function Header() {
	return (
		<header className="bg-background sticky top-0 z-40 w-full border-b">
			<div className="container mx-auto flex h-16 items-center justify-between py-4">
				<Link
					href="/"
					className="flex items-center gap-2 text-lg font-bold"
				>
					<Radio className="text-primary h-6 w-6" />
					Kollox FM
				</Link>

				<ThemeToggle />
			</div>
		</header>
	);
}
