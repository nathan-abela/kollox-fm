import type { Metadata } from "next";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
	title: "Terms of Use",
	description:
		"Terms of Use for Kollox FM - the Maltese radio station directory.",
};

export default function Terms() {
	return (
		<div className="container mx-auto px-4 py-8 md:py-12">
			<div className="mx-auto max-w-3xl space-y-12">
				<section className="space-y-4">
					<div className="flex items-center gap-3">
						<div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
							<FileText className="text-primary-foreground h-6 w-6" />
						</div>
						<h1 className="text-3xl font-bold md:text-4xl">
							Terms of Use
						</h1>
					</div>
					<p className="text-muted-foreground">
						Last updated: March 2026
					</p>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">
						1. Acceptance of Terms
					</h2>
					<p className="text-muted-foreground leading-relaxed">
						By accessing and using Kollox FM, you accept and agree
						to be bound by these Terms of Use. If you do not agree
						to these terms, please do not use this website.
					</p>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">
						2. Description of Service
					</h2>
					<p className="text-muted-foreground leading-relaxed">
						Kollox FM is a free, non-commercial directory and
						streaming aggregator for Maltese radio stations. We
						provide links to publicly available radio streams and do
						not host, store, or redistribute any audio content
						ourselves.
					</p>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">
						3. Intellectual Property
					</h2>
					<p className="text-muted-foreground leading-relaxed">
						All radio station names, logos, streams, and related
						media displayed on Kollox FM are the property of their
						respective owners. Kollox FM does not claim ownership of
						any third-party content.
					</p>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">
						4. Third-Party Content
					</h2>
					<div className="text-muted-foreground space-y-3 leading-relaxed">
						<p>
							Kollox FM links to and embeds content from
							third-party radio stations. We are not responsible
							for:
						</p>
						<ul className="list-disc space-y-2 pl-6">
							<li>
								The content, quality, or availability of
								third-party streams
							</li>
							<li>
								Any changes to stream URLs or station
								availability
							</li>
							<li>
								Content broadcast by individual radio stations
							</li>
							<li>
								External websites linked from station pages
							</li>
						</ul>
					</div>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">5. User Conduct</h2>
					<div className="text-muted-foreground space-y-3 leading-relaxed">
						<p>When using Kollox FM, you agree not to:</p>
						<ul className="list-disc space-y-2 pl-6">
							<li>
								Attempt to interfere with or disrupt the service
							</li>
							<li>
								Use automated systems to access the service in a
								manner that could damage or overload it
							</li>
							<li>
								Reproduce, duplicate, or redistribute the
								service for commercial purposes
							</li>
							<li>
								Violate any applicable local, national, or
								international law
							</li>
						</ul>
					</div>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">
						6. Disclaimer of Warranties
					</h2>
					<p className="text-muted-foreground leading-relaxed">
						Kollox FM is provided &quot;as is&quot; without any
						warranties, express or implied. We do not guarantee that
						the service will be uninterrupted, secure, or
						error-free. Stream availability depends on third-party
						providers and may change without notice.
					</p>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">
						7. Limitation of Liability
					</h2>
					<p className="text-muted-foreground leading-relaxed">
						To the fullest extent permitted by law, Kollox FM and
						its creators shall not be liable for any indirect,
						incidental, special, or consequential damages arising
						from your use of the service.
					</p>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">
						8. Changes to Terms
					</h2>
					<p className="text-muted-foreground leading-relaxed">
						We reserve the right to modify these Terms of Use at any
						time. Changes will be effective immediately upon posting
						to the website. Your continued use of Kollox FM after
						any changes indicates your acceptance of the new terms.
					</p>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">9. Source Code</h2>
					<p className="text-muted-foreground leading-relaxed">
						The source code for Kollox FM is publicly viewable for
						transparency and educational purposes. However, the code
						is not licensed for redistribution or commercial use.
						You may not copy, modify, or create derivative works
						based on the codebase without explicit permission.
					</p>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">10. Contact</h2>
					<p className="text-muted-foreground leading-relaxed">
						If you have any questions about these Terms of Use,
						please{" "}
						<a
							href="mailto:nathanabela7@gmail.com"
							className="text-primary hover:underline"
						>
							contact us here
						</a>
						.
					</p>
				</section>
			</div>
		</div>
	);
}
