import { Metadata } from "next";

import { siteUrl } from "@/lib/config";
import { displayFrequency, stations } from "@/lib/data/stations";
import { RadioStation } from "@/lib/types/radio";

interface LayoutProps {
	children: React.ReactNode;
	params: Promise<{ id: string }>;
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

	const frequency = displayFrequency(station);
	const description = `Listen to ${station.name} live from ${station.location}${frequency ? ` on ${frequency}` : ""}. ${station.genres?.join(", ") || "Radio"} streaming online.`;

	return {
		title: `${station.name}${frequency ? ` - ${frequency}` : ""} | Maltese Radio`,
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
