import { stations } from "@/lib/data/stations";
import { FmDial } from "@/components/radio/fm-dial";

const enabledStations = stations.filter((s) => s.isEnabled !== false);
const fmStations = enabledStations.filter((s) => s.fmFrequency);

/**
 * Homepage hero band: headline, status indicators, and the interactive
 * FM dial (desktop only).
 */
export function HomeHero() {
	return (
		<section className="pt-6 md:pt-8">
			<div className="bg-card rounded-xl border p-6 md:px-6 md:pt-6 md:pb-2">
				<div className="flex flex-wrap items-end justify-between gap-x-9 gap-y-4 md:mb-4">
					<div>
						<h1 className="text-foreground text-2xl font-bold tracking-tight md:text-3xl">
							Explore Malta&apos;s Radio Stations
						</h1>
						<p className="text-muted-foreground mt-2 max-w-2xl text-sm md:text-lg">
							All your favourite Maltese stations in one place.
							Free, live, and local!
						</p>

						{/* Status indicators */}
						<div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-4 text-xs md:text-sm">
							<div className="flex items-center gap-2">
								<div className="h-2 w-2 rounded-full bg-green-500"></div>
								<span>
									{enabledStations.length} Available Stations
								</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="h-2 w-2 rounded-full bg-purple-500"></div>
								<span>Live Metadata</span>
							</div>
						</div>
					</div>

					<p className="text-muted-foreground hidden text-xs md:block">
						Click a frequency to tune
					</p>
				</div>

				<div className="hidden md:block">
					<FmDial stations={fmStations} />
				</div>
			</div>
		</section>
	);
}
