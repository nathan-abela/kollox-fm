import type { NextConfig } from "next";

// Determines if the current environment is production
const isProd = process.env.NODE_ENV === "production";

// Determines if the application is using GitHub Pages
const useGitHubPages = false;
const repoName = "kollox-fm";

const nextConfig: NextConfig = {
	basePath: isProd && useGitHubPages ? `/${repoName}` : "",
	assetPrefix: isProd && useGitHubPages ? `/${repoName}` : "",
	output: "export",
	images: {
		unoptimized: true,
	},
};

export default nextConfig;
