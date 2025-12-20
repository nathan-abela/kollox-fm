"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { getLatestSurvey } from "@/lib/data/surveys";

/** `localStorage` key for tracking survey toast dismissal */
const STORAGE_KEY = "survey-toast-dismissed";

/** Number of days to wait before showing reminder again */
const REMIND_AFTER_DAYS = 7;

/**
 * Displays a toast notification promoting the survey results page.
 *
 * @remarks
 * The toast appears automatically on page load with a 1.5s delay.
 * Dismissal is tracked per survey ID in `localStorage`.
 *
 * Behavior:
 * - First visit: Shows toast immediately
 * - After dismissal: Shows again after 7 days for the same survey
 * - Dismissal triggers: Close button (X), auto-close, or "View Results" button
 */
export function SurveyToast() {
	const router = useRouter();
	const latestSurvey = getLatestSurvey();

	useEffect(() => {
		if (!latestSurvey) {
			return;
		}

		const dismissedData = localStorage.getItem(STORAGE_KEY);

		// If user dismissed this survey, check if enough time has passed
		if (dismissedData) {
			try {
				const { surveyId, dismissedAt } = JSON.parse(dismissedData);

				if (surveyId === latestSurvey.meta.id) {
					// Same survey - check if 7 days have passed since dismissal
					const daysSinceDismissal = Math.floor(
						// prettier-ignore
						(Date.now() - new Date(dismissedAt).getTime()) / (1000 * 60 * 60 * 24)
					);

					if (daysSinceDismissal < REMIND_AFTER_DAYS) {
						return; // Don't show
					}
				}
				// Different survey ID - show immediately
			} catch {
				// Invalid data - continue to show toast
			}
		}

		const timer = setTimeout(() => {
			const handleDismiss = () => {
				localStorage.setItem(
					STORAGE_KEY,
					JSON.stringify({
						surveyId: latestSurvey.meta.id,
						dismissedAt: new Date().toISOString(),
					})
				);
			};

			toast("📊 Survey Results Available!", {
				description:
					"View official radio listenership data from Broadcasting Authority Malta.",
				action: {
					label: "View Results",
					onClick: () => {
						handleDismiss();
						router.push(`/survey-results/${latestSurvey.meta.id}`); // prettier-ignore
					},
				},
				onDismiss: handleDismiss,
				closeButton: true,
				duration: 8000,
			});
		}, 1500);

		return () => clearTimeout(timer);
	}, [latestSurvey, router]);

	return null;
}
