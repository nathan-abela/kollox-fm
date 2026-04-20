/**
 * Configuration values derived from site settings.
 *
 * Import `siteUrl` for absolute URLs (meta tags, sitemap, robots.txt).
 * Import `basePath` for asset path prefixes.
 */

import {
	CUSTOM_DOMAIN_URL,
	GITHUB_PAGES_URL,
	REPO_NAME,
	USE_CUSTOM_DOMAIN,
} from "@/config/site";

// Determines if the current environment is production
const isProd = process.env.NODE_ENV === "production";

/** The full site URL based on deployment target. */
export const siteUrl = USE_CUSTOM_DOMAIN ? CUSTOM_DOMAIN_URL : GITHUB_PAGES_URL;

/** The base path prefix for assets (empty for custom domain, `/repo-name` for GitHub Pages). */
export const basePath = isProd && !USE_CUSTOM_DOMAIN ? `/${REPO_NAME}` : "";
