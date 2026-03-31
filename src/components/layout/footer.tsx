"use client";

import Link from "next/link";
import { Github, Mail, Radio, Shield } from "lucide-react";

import { useAudioPlayer } from "@/lib/hooks/audio-player";

export function Footer() {
	const { currentStation } = useAudioPlayer();

	return (
		<footer
			className={`bg-card mt-auto border-t ${currentStation ? "pb-24" : ""}`}
		>
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 gap-12 md:grid-cols-4">
					{/* Brand Section */}
					<div className="md:col-span-2">
						<div className="mb-4 flex items-center gap-2">
							<div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
								<Radio className="text-primary-foreground h-4 w-4" />
							</div>
							<span className="text-lg font-semibold">
								Kollox FM
							</span>
						</div>
						<p className="text-muted-foreground mb-4 max-w-md text-sm">
							Kollox FM is a modern platform for discovering and
							listening to Maltese radio stations, with full
							respect for content creators, stream providers, and
							copyright holders.
						</p>
						<div className="flex items-center gap-4">
							<Link
								href="mailto:nathanabela7@gmail.com"
								title="Send an email"
								aria-label="Contact us"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								<Mail className="h-4 w-4" />
							</Link>
							<Link
								href="https://github.com/nathan-abela"
								target="_blank"
								rel="noopener noreferrer"
								title="View on GitHub"
								aria-label="GitHub"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								<Github className="h-4 w-4" />
							</Link>
						</div>
					</div>

					{/* Quick Links */}
					<nav aria-label="Quick Links">
						<h3 className="mb-3 font-semibold">Quick Links</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="/"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									Home
								</Link>
							</li>
							<li>
								<Link
									href="/about"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									About
								</Link>
							</li>
							<li>
								<Link
									href="/survey-results"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									Survey Results
								</Link>
							</li>
						</ul>
					</nav>

					{/* Legal */}
					<nav aria-label="Legal">
						<h3 className="mb-3 font-semibold">Legal</h3>
						<ul className="space-y-2 text-sm">
							<li className="flex items-center gap-2">
								<Shield className="h-3 w-3 text-green-500" />
								<span className="text-muted-foreground">
									Copyright Compliant
								</span>
							</li>
							<li>
								<Link
									href="/terms"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									Terms of Use
								</Link>
							</li>
							<li>
								<Link
									href="/privacy"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									Privacy Policy
								</Link>
							</li>
						</ul>
					</nav>
				</div>

				{/* Bottom Note */}
				<div className="mt-8 border-t pt-6">
					<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
						<div className="text-muted-foreground text-center text-sm md:text-left">
							<p className="mb-2">
								All radio station names, logos, streams, and
								related media are the property of their
								respective owners. Kollox FM does not claim
								ownership of any third-party content.
							</p>
							<p className="text-muted-foreground text-sm">
								© {new Date().getFullYear()} Kollox FM. All
								rights reserved.
							</p>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
