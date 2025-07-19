"use client";

import { Globe, Headphones, Radio, Shield, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export default function About() {
	return (
		<div className="container mx-auto px-4 py-8 md:py-12">
			<div className="mx-auto max-w-3xl space-y-16">
				<section className="space-y-4 text-center">
					<div className="flex justify-center">
						<div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
							<Radio className="text-primary-foreground h-6 w-6" />
						</div>
					</div>
					<h1 className="text-3xl font-bold md:text-4xl">
						About Kollox FM
					</h1>
					<p className="text-muted-foreground text-lg">
						All your favourite Maltese radio stations - in one
						place, on a fast, modern interface.
					</p>
				</section>

				<section className="space-y-6">
					<h2 className="text-2xl font-semibold">Why Kollox FM?</h2>
					<p className="text-muted-foreground text-base leading-relaxed">
						Most global radio platforms are designed to showcase
						international stations, but for Maltese listeners, the
						experience is often cluttered, inconsistent, or
						incomplete. Station metadata may be outdated, streams
						broken, or non-local content mixed in.
					</p>
					<p className="text-muted-foreground text-base leading-relaxed">
						Kollox FM was built to offer a better alternative - a
						lightweight, mobile-friendly directory focused entirely
						on Maltese radio. With all local stations presented
						side-by-side, easy to browse, compare, and switch
						between stations without distractions. Stations are
						curated for accuracy, making discovery simple and
						frustration-free.
					</p>
					<p className="text-muted-foreground text-base leading-relaxed">
						The name &quot;Kollox&quot; reflects that vision:
						everything in one place - made with local knowledge, for
						local listeners.
					</p>
				</section>

				<section className="space-y-6">
					<h2 className="text-center text-2xl font-semibold">
						What Makes It Different?
					</h2>
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="bg-card flex items-start gap-3 rounded-lg border p-4">
							<Headphones className="text-primary h-7 w-7" />
							<div>
								<h3 className="font-medium">
									Modern Audio Player
								</h3>
								<p className="text-muted-foreground pt-2 text-sm">
									Clean player with responsive layout, volume
									control, and smooth streaming on all
									devices.
								</p>
							</div>
						</div>
						<div className="bg-card flex items-start gap-3 rounded-lg border p-4">
							<Globe className="h-6 w-6 text-green-500" />
							<div>
								<h3 className="font-medium">
									Local-first Directory
								</h3>
								<p className="text-muted-foreground pt-2 text-sm">
									A focused collection of verified Maltese
									stations - clean, current, and relevant.
								</p>
							</div>
						</div>
						<div className="bg-card flex items-start gap-3 rounded-lg border p-4">
							<Shield className="h-7 w-7 text-blue-500" />
							<div>
								<h3 className="font-medium">
									Respect for Creators
								</h3>
								<p className="text-muted-foreground pt-2 text-sm">
									Streams are played directly from their
									official sources, and each station is
									clearly credited.
								</p>
							</div>
						</div>
						<div className="bg-card flex items-start gap-3 rounded-lg border p-4">
							<Users className="h-6 w-6 text-pink-500" />
							<div>
								<h3 className="font-medium">
									Built for Listeners
								</h3>
								<p className="text-muted-foreground pt-2 text-sm">
									Simple UI, fast search, genre filters, and
									curated discovery for Maltese radio fans.
								</p>
							</div>
						</div>
					</div>
				</section>

				<section className="space-y-6">
					<h2 className="text-2xl font-semibold">Principles</h2>
					<div className="text-muted-foreground space-y-4 text-base">
						<p>
							<b>Community Focused.</b> Kollox FM highlights
							Maltese radio stations and provides a simple way for
							listeners to reconnect with local content - whether
							it&apos;s music, news, or talk.
						</p>
						<p>
							<b>Non-Commercial.</b> This project is built for
							public access and personal use.
						</p>
						<p>
							<b>Copyright-Respecting.</b> Station logos, names,
							and streams are owned by their original
							broadcasters. Kollox FM does not claim ownership.
						</p>
					</div>
				</section>

				<section className="space-y-6">
					<h2 className="text-center text-2xl font-semibold">
						Tech Stack
					</h2>
					<p className="text-muted-foreground text-center">
						Designed with a modern frontend stack, fully responsive
						and built for performance.
					</p>
					<div className="flex flex-wrap justify-center gap-2">
						<Badge variant="secondary">Next.js</Badge>
						<Badge variant="secondary">TypeScript</Badge>
						<Badge variant="secondary">Tailwind CSS</Badge>
						<Badge variant="secondary">Shadcn UI</Badge>
					</div>
				</section>
			</div>
		</div>
	);
}
