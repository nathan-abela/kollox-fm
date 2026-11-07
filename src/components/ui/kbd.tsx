import { ReactNode } from "react";

/** A keyboard key, for shortcut hints */
export function Kbd({ children }: { children: ReactNode }) {
	return (
		<kbd className="bg-muted text-foreground rounded border px-1.5 py-0.5 font-mono text-[10px]">
			{children}
		</kbd>
	);
}
