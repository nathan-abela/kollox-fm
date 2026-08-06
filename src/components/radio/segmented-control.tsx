"use client";

import { KeyboardEvent } from "react";

import { cn } from "@/lib/utils";

interface SegmentedControlOption {
	value: string;
	label: string;
}

interface SegmentedControlProps {
	options: SegmentedControlOption[];
	value: string;
	onValueChange: (value: string) => void;
	"aria-label": string;
	className?: string;
}

/**
 * Controlled segmented button group with radiogroup semantics and
 * arrow-key navigation.
 */
export function SegmentedControl({
	options,
	value,
	onValueChange,
	"aria-label": ariaLabel,
	className,
}: SegmentedControlProps) {
	const handleKeyDown = (
		event: KeyboardEvent<HTMLButtonElement>,
		index: number
	) => {
		const offset =
			event.key === "ArrowRight" || event.key === "ArrowDown"
				? 1
				: event.key === "ArrowLeft" || event.key === "ArrowUp"
					? -1
					: 0;
		if (offset === 0) return;

		event.preventDefault();
		const nextIndex = (index + offset + options.length) % options.length;
		onValueChange(options[nextIndex].value);
		const next = event.currentTarget.parentElement?.children[nextIndex];
		if (next instanceof HTMLButtonElement) next.focus();
	};

	return (
		<div
			role="radiogroup"
			aria-label={ariaLabel}
			className={cn(
				"bg-muted inline-flex w-fit items-center gap-0.5 rounded-lg p-[3px]",
				className
			)}
		>
			{options.map((option, index) => {
				const isActive = option.value === value;
				return (
					<button
						key={option.value}
						type="button"
						role="radio"
						aria-checked={isActive}
						tabIndex={isActive ? 0 : -1}
						onClick={() => onValueChange(option.value)}
						onKeyDown={(event) => handleKeyDown(event, index)}
						className={cn(
							"cursor-pointer rounded-md px-3 py-1.5 text-sm whitespace-nowrap transition-colors",
							isActive
								? "bg-background text-foreground shadow-sm"
								: "text-muted-foreground hover:text-foreground"
						)}
					>
						{option.label}
					</button>
				);
			})}
		</div>
	);
}
