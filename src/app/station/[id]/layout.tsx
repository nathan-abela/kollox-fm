import { Metadata } from "next";

import { stations } from "@/lib/data/stations";

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
			title: "Station Not Found | Kollox FM",
		};
	}

	const description = `Listen to ${station.name} live from ${station.location}${station.fmFrequency ? ` on ${station.fmFrequency} FM` : ""}. ${station.genres?.join(", ") || "Radio"} streaming online.`;

	return {
		title: `${station.name}${station.fmFrequency ? ` - ${station.fmFrequency} FM` : ""} | Maltese Radio | Kollox FM`,
		description,
		openGraph: {
			title: `${station.name} | Kollox FM`,
			description,
			images: [station.image],
		},
	};
}

export async function generateStaticParams() {
	return stations.map((station) => ({
		id: station.id,
	}));
}

export default function StationLayout({ children }: LayoutProps) {
	return children;
}
