import { RadioStationList } from "@/components/radio-station-list";

export default function Home() {
	return (
		<div className="container mx-auto pb-20">
			<section className="py-8 md:py-12">
				<div className="space-y-4">
					<h2 className="text-3xl font-bold tracking-tight">
						Browse Local Radio Stations
					</h2>
					<p className="text-muted-foreground">
						Discover and listen to your favourite Maltese radio
						stations!
					</p>
				</div>
			</section>

			<RadioStationList />
		</div>
	);
}
