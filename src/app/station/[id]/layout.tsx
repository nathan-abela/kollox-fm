import { Metadata } from "next";

import { siteUrl } from "@/lib/config";
import { displayFrequency, stations } from "@/lib/data/stations";
import { RadioStation } from "@/lib/types/radio";

interface LayoutProps {
	children: React.ReactNode;
	params: Promise<{ id: string }>;
}

/**
 * "<name> <frequency> Malta - Listen Live", skipping the frequency when the
 * name already carries it and "Malta" when the name already have it.
 */
function stationTitle(station: RadioStation): string {
	const parts = [station.name];
	if (station.fmFrequency && displayFrequency(station)) {
		parts.push(station.fmFrequency);
	}
	if (!/malt/i.test(station.name)) parts.push("Malta");
	return `${parts.join(" ")} - Listen Live`;
}

/** The station's own about paragraph, or a generic line for stations without one. */
function stationDescription(station: RadioStation): string {
	if (station.description) return station.description;
	const frequency = displayFrequency(station);
	return `Listen to ${station.name} live from ${station.location}${frequency ? ` on ${frequency}` : ""}. ${station.genres?.join(", ") || "Radio"} streaming online.`;
}

export async function generateMetadata({
	params,
}: LayoutProps): Promise<Metadata> {
	const { id } = await params;
	const station = stations.find((s) => s.id === id);

	if (!station) {
		return {
			title: "Station Not Found",
		};
	}

	const description = stationDescription(station);

	return {
		title: stationTitle(station),
		description,
		openGraph: {
			title: `${station.name} | Kollox FM`,
			description,
			images: [station.image],
		},
	};
}

export async function generateStaticParams() {
	return stations
		.filter((station) => station.isEnabled !== false)
		.map((station) => ({
			id: station.id,
		}));
}

/**
 * schema.org graph for a station: the organisation, plus the FM channel that
 * carries its frequency and genres (those properties don't exist on the
 * organisation type). Online-only stations get the organisation alone.
 */
function stationJsonLd(station: RadioStation) {
	const organisation = {
		"@type": "RadioStation",
		"@id": `${siteUrl}/station/${station.id}#station`,
		name: station.name,
		description: station.description,
		url: station.website,
		image: new URL(station.image, siteUrl).href,
		address: {
			"@type": "PostalAddress",
			addressLocality: station.location,
			addressCountry: "MT",
		},
		sameAs: Object.values(station.socials ?? {}),
	};
	const channel = station.fmFrequency && {
		"@type": "FMRadioChannel",
		broadcastFrequency: `${station.fmFrequency} FM`,
		genre: station.genres,
		providesBroadcastService: {
			"@type": "BroadcastService",
			broadcastDisplayName: station.name,
			broadcaster: { "@id": organisation["@id"] },
		},
	};
	return {
		"@context": "https://schema.org",
		"@graph": channel ? [organisation, channel] : [organisation],
	};
}

export default async function StationLayout({ children, params }: LayoutProps) {
	const { id } = await params;
	const station = stations.find((s) => s.id === id);

	return (
		<>
			{station && (
				<script
					type="application/ld+json"
					// "<" is escaped so no station text can close the script tag early
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(stationJsonLd(station)).replace(/</g, "\\u003c"), // prettier-ignore
					}}
				/>
			)}
			{children}
		</>
	);
}
