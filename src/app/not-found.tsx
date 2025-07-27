"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
	ArrowLeft,
	ChevronLeft,
	ChevronRight,
	Home,
	Radio,
	Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const radioFacts: string[] = [
	"In the 1980s, some Maltese people listened to cable radio through wall-mounted loudspeakers - no volume or channel controls!",
	"Radio announcers in the 60s and 70s had to speak perfect Maltese and English - one slip, and they'd be pulled off air!",
	"Before Spotify, calling a station to request a song was the ultimate teenage move in Malta.",
	"Malta's first wired radio broadcasts were launched by Rediffusion Ltd on 11 November 1935.",
	"The island's first wireless radio transmission happened in 1933 from Fort Rinella's Naval Wireless Station.",
	"In 1948, Malta began broadcasting school lessons over the radio through the Education Department.",
	"Radio Malta launched on 8 January 1973, bringing the country its first over-the-air broadcasts.",
	"After more than 50 years, Malta's cable radio service shut down on 31 January 1989.",
	"Magic Malta, the PBS pop music station, officially launched on 21 August 2003.",
	"Bay Radio (89.7 Bay), founded in 1991, has been Malta's most popular station for over 15 years.",
	"Listeners used to pay a small fee just to connect to Rediffusion's wall-mounted speaker boxes.",
];

export default function NotFound() {
	// State to manage the current fact index
	const [currentFactIndex, setCurrentFactIndex] = useState(0);
	const currentFact = radioFacts[currentFactIndex];

	// State to manage the interval ID and pause state
	const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
	const [isPaused, setIsPaused] = useState(false);

	// Auto-advance facts every 4 seconds
	useEffect(() => {
		const startInterval = () => {
			const id = setInterval(() => {
				setCurrentFactIndex(
					(prevIndex) => (prevIndex + 1) % radioFacts.length
				);
			}, 4000);
			setIntervalId(id);
		};

		if (!isPaused) {
			startInterval();
		}

		return () => {
			if (intervalId) clearInterval(intervalId);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isPaused]);

	// Reset interval when navigating via next/ prev buttons
	const resetInterval = () => {
		if (intervalId) {
			clearInterval(intervalId);
		}
		if (!isPaused) {
			const id = setInterval(() => {
				setCurrentFactIndex(
					(prevIndex) => (prevIndex + 1) % radioFacts.length
				);
			}, 4000);
			setIntervalId(id);
		}
	};

	// Navigate to next/ prev fact
	const nextFact = () => {
		setCurrentFactIndex((prevIndex) => (prevIndex + 1) % radioFacts.length);
		resetInterval();
	};
	const prevFact = () => {
		setCurrentFactIndex((prevIndex) =>
			prevIndex === 0 ? radioFacts.length - 1 : prevIndex - 1
		);
		resetInterval();
	};

	// Pause the carousel on hover
	const handleMouseEnter = () => {
		setIsPaused(true);
		if (intervalId) {
			clearInterval(intervalId);
		}
	};
	const handleMouseLeave = () => {
		setIsPaused(false);
	};

	return (
		<div className="container mx-auto px-4 py-6 md:py-8 lg:py-12">
			<div className="mx-auto max-w-4xl text-center">
				<div className="relative mb-8 md:mb-12">
					<div className="flex items-center justify-center">
						<div className="text-primary/40 text-6xl font-bold select-none md:text-8xl lg:text-9xl">
							404
						</div>
					</div>

					<h1 className="my-4 text-2xl font-bold md:my-6 md:text-3xl lg:text-4xl">
						Page Not Found
					</h1>
					<p className="text-muted-foreground mx-auto max-w-md px-4 text-base md:text-lg">
						Looks like this frequency is out of range. The page
						you&apos;re looking for doesn&apos;t exist or has been
						moved.
					</p>
				</div>

				{/* Action Cards */}
				<div className="mx-auto my-8 grid max-w-2xl gap-4 md:my-12 md:grid-cols-2">
					<Card className="p-0 transition-shadow hover:shadow-lg">
						<CardContent className="px-4 py-6 md:px-6">
							<div className="mb-4 flex items-center justify-center gap-2">
								<Home className="text-primary h-5 w-5" />
								<h3 className="text-sm font-semibold md:text-base">
									Return Home
								</h3>
							</div>
							<p className="text-muted-foreground mb-4 text-center text-xs md:text-sm">
								Go back to the main station directory and
								discover your favourite radio stations.
							</p>
							<Button asChild className="w-full text-sm">
								<Link href="/">
									<Home className="mr-2 h-4 w-4" />
									Back to Stations
								</Link>
							</Button>
						</CardContent>
					</Card>

					<Card className="p-0 transition-shadow hover:shadow-lg">
						<CardContent className="px-4 py-6 md:px-6">
							<div className="mb-4 flex items-center justify-center gap-2">
								<Search className="text-primary h-5 w-5" />
								<h3 className="text-sm font-semibold md:text-base">
									Search
								</h3>
							</div>
							<p className="text-muted-foreground mb-4 text-center text-xs md:text-sm">
								Use our search feature to find specific radio
								stations by name or location.
							</p>
							<Button
								variant="outline"
								asChild
								className="w-full text-sm"
							>
								<Link href="/#search">
									<Search className="mr-2 h-4 w-4" />
									Search Stations
								</Link>
							</Button>
						</CardContent>
					</Card>
				</div>

				{/* Malta Radio Facts Carousel */}
				<div
					className="bg-muted/50 relative mx-auto max-w-2xl overflow-hidden rounded-lg border p-4 md:p-6"
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					<div className="mb-4 flex items-center justify-center gap-2">
						<Radio className="text-primary h-4 w-4" />
						<span className="text-primary text-sm font-medium">
							Did You Know?
						</span>
					</div>

					{/* Carousel Content */}
					<div className="relative">
						<Button
							variant="ghost"
							size="icon"
							onClick={prevFact}
							className="hover:bg-background/80 absolute top-1/2 left-2 z-10 h-8 w-8 -translate-y-1/2 cursor-pointer"
							aria-label="Previous fact"
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>

						<Button
							variant="ghost"
							size="icon"
							onClick={nextFact}
							className="hover:bg-background/80 absolute top-1/2 right-2 z-10 h-8 w-8 -translate-y-1/2 cursor-pointer"
							aria-label="Next fact"
						>
							<ChevronRight className="h-4 w-4" />
						</Button>

						<div className="mx-10 transition-all duration-500 ease-in-out md:mx-12">
							<div className="flex min-h-[5rem] items-center justify-center md:min-h-[4.5rem]">
								<p className="text-muted-foreground max-w-2xl px-2 text-center text-xs leading-relaxed md:text-sm">
									{currentFact}
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-6 md:mt-8">
					<Button
						variant="ghost"
						onClick={() => window.history.back()}
						className="text-muted-foreground hover:text-primary cursor-pointer text-sm"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Go Back
					</Button>
				</div>
			</div>
		</div>
	);
}
