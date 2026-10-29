"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const PX_PER_SECOND = 25;
const MIN_DURATION_S = 6;

/**
 * One line of text that fits when it can and slides back and forth when it
 * overflows its container. Reduced-motion users get a truncated line instead.
 */
export function ScrollingText({
	text,
	className,
}: {
	text: string;
	className?: string;
}) {
	const outerRef = useRef<HTMLDivElement>(null);
	const innerRef = useRef<HTMLSpanElement>(null);
	const [overflowPx, setOverflowPx] = useState(0);

	useEffect(() => {
		const outer = outerRef.current;
		const inner = innerRef.current;
		if (!outer || !inner) return;
		const measure = () =>
			setOverflowPx(Math.max(0, inner.scrollWidth - outer.clientWidth));
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(outer);
		observer.observe(inner);
		return () => observer.disconnect();
	}, [text]);

	const isScrolling = overflowPx > 0;

	return (
		<div
			ref={outerRef}
			className={cn(
				"overflow-hidden whitespace-nowrap",
				isScrolling ? "motion-reduce:text-ellipsis" : "text-ellipsis",
				className
			)}
		>
			<span
				ref={innerRef}
				className={cn(
					"inline-block",
					isScrolling &&
						"animate-scroll-text motion-reduce:animate-none"
				)}
				style={
					{
						"--scroll-distance": `-${overflowPx}px`,
						"--scroll-duration": `${Math.max(MIN_DURATION_S, overflowPx / PX_PER_SECOND)}s`,
					} as CSSProperties
				}
			>
				{text}
			</span>
		</div>
	);
}
