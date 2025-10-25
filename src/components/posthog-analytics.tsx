"use client";

import { useEffect } from "react";

import { initPostHog } from "@/lib/posthog";

export function PostHogAnalytics() {
	useEffect(() => {
		initPostHog();
	}, []);

	return null;
}
