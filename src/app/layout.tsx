import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { AudioPlayerProvider } from "@/lib/hooks/audio-player";
import { Header } from "@/components/ui/header";
import { Toaster } from "@/components/ui/sonner";
import { BreakpointIndicator } from "@/components/breakpoint-indicator";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Kollox FM",
	description:
		"Listen to all Maltese radio stations in one place. Discover, play, and enjoy live radio from Malta with Kollox FM.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem={false}
					disableTransitionOnChange
				>
					<Header />
					<AudioPlayerProvider>{children}</AudioPlayerProvider>
					<Toaster richColors />
				</ThemeProvider>
				<BreakpointIndicator />
			</body>
		</html>
	);
}
