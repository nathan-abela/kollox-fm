import posthog from "posthog-js";

let isPosthogInitialized = false;
const isProd = process.env.NODE_ENV === "production";

/**
 * Initializes PostHog analytics tracking.
 *
 * Uses a configuration snapshot (via the `defaults` option) to lock in
 * behavior as it existed on 2025-05-24 - this ensures consistent tracking
 * features like session recordings, auto-capture, and console logging.
 *
 * Disabled if already initialized, server-side, or not production
 */
export function initPostHog() {
	if (
		isPosthogInitialized ||
		typeof window === "undefined" ||
		!isProd ||
		!process.env.NEXT_PUBLIC_POSTHOG_KEY
	) {
		console.warn("PostHog not initialized.");
		return;
	}

	posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
		api_host:
			process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com",
		defaults: "2025-05-24",
	});

	isPosthogInitialized = true;
	console.info("PostHog initialized.");
}
