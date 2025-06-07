import type { NextConfig } from "next";

// Determines if the current environment is production
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
	/**
	 * Sets the base path for the application.
	 * For deploying to a subdirectory (ex. GitHub Pages).
	 * Uses '/kollox-fm' in production, empty otherwise.
	 */
	basePath: isProd ? "/kollox-fm" : "",
	/**
	 * Sets the asset prefix for the application.
	 * For serving assets from a different domain.
	 * Uses '/kollox-fm' in production, empty otherwise.
	 */
	assetPrefix: isProd ? "/kollox-fm" : "",
	output: "export",
	images: {
		unoptimized: true,
	},
};

export default nextConfig;
