/**
 * Homepage hero: headline and tagline.
 */
export function HomeHero() {
	return (
		<section className="pt-6 md:pt-8">
			<div className="bg-card rounded-xl border p-6">
				<h1 className="text-foreground text-2xl font-bold tracking-tight md:text-3xl">
					Explore Malta&apos;s Radio Stations
				</h1>
				<p className="text-muted-foreground mt-2 max-w-2xl text-sm md:text-lg">
					All your favourite Maltese stations in one place. Free,
					live, and local!
				</p>
			</div>
		</section>
	);
}
