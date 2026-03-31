import type { Metadata } from "next";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
	title: "Privacy Policy",
	description:
		"Privacy Policy for Kollox FM - learn how we handle your data.",
};

export default function Privacy() {
	return (
		<div className="container mx-auto px-4 py-8 md:py-12">
			<div className="mx-auto max-w-3xl space-y-12">
				<section className="space-y-4">
					<div className="flex items-center gap-3">
						<div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
							<Shield className="text-primary-foreground h-6 w-6" />
						</div>
						<h1 className="text-3xl font-bold md:text-4xl">
							Privacy Policy
						</h1>
					</div>
					<p className="text-muted-foreground">
						Last updated: March 2026
					</p>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Overview</h2>
					<p className="text-muted-foreground leading-relaxed">
						Kollox FM is committed to protecting your privacy. This
						policy explains what information we collect, how we use
						it, and your rights regarding your data.
					</p>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">
						Information We Collect
					</h2>
					<div className="text-muted-foreground space-y-3 leading-relaxed">
						<p>
							We collect minimal, anonymous analytics data to
							understand how visitors use Kollox FM. This
							includes:
						</p>
						<ul className="list-disc space-y-2 pl-6">
							<li>
								<strong>Country/region</strong> - General
								geographic location based on IP address
							</li>
							<li>
								<strong>Pages visited</strong> - Which pages you
								view on the site
							</li>
							<li>
								<strong>Device type</strong> - Whether you are
								using mobile, tablet, or desktop
							</li>
							<li>
								<strong>Referrer</strong> - How you found Kollox
								FM
							</li>
						</ul>
						<p>
							We do not collect personally identifiable
							information such as your name, email address, or
							precise location.
						</p>
					</div>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">
						How We Use This Information
					</h2>
					<div className="text-muted-foreground space-y-3 leading-relaxed">
						<p>We use analytics data solely to:</p>
						<ul className="list-disc space-y-2 pl-6">
							<li>
								Understand which stations and features are most
								popular
							</li>
							<li>Improve the user experience</li>
							<li>Identify and fix technical issues</li>
						</ul>
					</div>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Analytics Provider</h2>
					<p className="text-muted-foreground leading-relaxed">
						We use{" "}
						<a
							href="https://posthog.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary hover:underline"
						>
							PostHog
						</a>{" "}
						for analytics. PostHog processes data in accordance
						with their privacy policy. No data is sold to third
						parties.
					</p>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Cookies</h2>
					<p className="text-muted-foreground leading-relaxed">
						Kollox FM may use cookies for analytics purposes.
						Cookies are small files stored on your device that help
						us understand how you use the site. You can disable
						cookies in your browser settings, though this may affect
						some functionality.
					</p>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Third-Party Links</h2>
					<p className="text-muted-foreground leading-relaxed">
						Kollox FM contains links to external websites, including
						radio station websites and social media pages. We are
						not responsible for the privacy practices of these
						external sites.
					</p>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Your Rights</h2>
					<p className="text-muted-foreground leading-relaxed">
						Analytics data is anonymous and automatically deleted
						after a retention period. You can opt out of analytics
						tracking by using browser privacy settings, ad blockers,
						or extensions that block tracking scripts.
					</p>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">
						Changes to This Policy
					</h2>
					<p className="text-muted-foreground leading-relaxed">
						We may update this Privacy Policy from time to time.
						Changes will be posted on this page with an updated
						revision date.
					</p>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Contact</h2>
					<p className="text-muted-foreground leading-relaxed">
						If you have questions about this Privacy Policy, please{" "}
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
