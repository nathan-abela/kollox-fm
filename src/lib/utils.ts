import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string, optimizing for Tailwind CSS classes.
 * Uses `clsx` to handle conditional class names and `twMerge` to handle duplicate Tailwind classes.
 *
 * @param inputs - A list of class names, which can be strings, objects, or arrays. Conditional class names are supported.
 * @returns A single string with the merged class names, optimized for use with Tailwind CSS.
 *
 * @example
 * cn("bg-red-500", "text-white");
 * // returns "bg-red-500 text-white"
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Formats a date string into a human-readable date in "en-GB" locale (e.g., "1 January 2024").
 *
 * @param dateString - The date string to format. If not provided or invalid, returns `null`.
 * @returns The formatted date string or `null` if the input is invalid.
 *
 * @example
 * formatDate("2023-10-25");
 * // returns "25 October 2023"
 *
 * @example
 * formatDate("");
 * // returns null
 */
export function formatDate(dateString?: string): string | null {
	if (!dateString) return null;
	try {
		return new Date(dateString).toLocaleDateString("en-GB", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	} catch {
		return dateString;
	}
}

/**
 * Formats a number into a string with thousands separators (e.g. "1,000,000").
 *
 * @param num - The number to format. If not provided, returns `null`.
 * @returns The formatted number string or `null` if the input is invalid.
 *
 * @example
 * formatNumber(1000000);
 * // returns "1,000,000"
 *
 * @example
 * formatNumber(undefined);
 * // returns null
 */
export function formatNumber(num?: number): string | null {
	if (!num) return null;
	return num.toLocaleString();
}
