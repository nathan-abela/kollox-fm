import { cn } from "@/lib/utils";

/**
 * Decorative Valletta skyline at night with a transmitter beacon, drawn
 * to fill the idle hero from the right. The sky glows toward the bottom,
 * far buildings sit as a light haze and near ones as dark silhouettes, so
 * the depth reads correctly in both themes.
 */
export function MaltaSkyline({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 -20 640 128"
			preserveAspectRatio="xMaxYMax slice"
			aria-hidden="true"
			className={cn("text-foreground pointer-events-none", className)}
		>
			<defs>
				<linearGradient id="skyline-sky" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="currentColor" stopOpacity="0" />
					<stop
						offset="1"
						stopColor="currentColor"
						stopOpacity="0.14"
					/>
				</linearGradient>
				<radialGradient
					id="skyline-beacon"
					cx="560"
					cy="30"
					r="90"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0" stopColor="#f97316" stopOpacity="0.35" />
					<stop offset="1" stopColor="#f97316" stopOpacity="0" />
				</radialGradient>
			</defs>
			<rect y="-20" width="640" height="128" fill="url(#skyline-sky)" />
			<rect y="-20" width="640" height="128" fill="url(#skyline-beacon)" />
			<g fill="none" stroke="#fb923c" strokeWidth="1">
				<circle cx="560" cy="30" r="14" opacity="0.6" />
				<circle cx="560" cy="30" r="30" opacity="0.35" />
				<circle cx="560" cy="30" r="50" opacity="0.18" />
			</g>
			{/* Far layer: hazy */}
			<g className="fill-foreground/10">
				<rect x="0" y="86" width="640" height="22" />
				<rect x="18" y="74" width="20" height="20" />
				<rect x="60" y="68" width="16" height="24" />
				<path d="M96 92V74Q96 58 112 58Q128 58 128 74V92Z" />
				<rect x="110" y="46" width="4" height="12" />
				<rect x="190" y="70" width="22" height="22" />
				<path d="M228 92V58L232 44L236 58V92Z" />
				<rect x="300" y="72" width="26" height="20" />
				<path d="M390 92V72Q390 60 402 60Q414 60 414 72V92Z" />
				<rect x="470" y="70" width="18" height="22" />
				<rect x="500" y="76" width="30" height="16" />
			</g>
			{/* Near layer: silhouettes darker than the card */}
			<g className="fill-foreground/25 dark:fill-background">
				<rect x="0" y="96" width="640" height="12" />
				<rect x="40" y="84" width="30" height="24" />
				<rect x="80" y="90" width="22" height="18" />
				<rect x="112" y="80" width="26" height="28" />
				<path d="M150 108V82Q150 60 172 60Q194 60 194 82V108Z" />
				<rect x="168" y="44" width="7" height="18" />
				<path d="M166 44L171.5 32L177 44Z" />
				<rect x="206" y="88" width="28" height="20" />
				<path d="M246 108V48L252 28L258 48V108Z" />
				<rect x="270" y="78" width="34" height="30" />
				<rect x="312" y="88" width="24" height="20" />
				<path d="M346 108V74Q346 58 360 58Q374 58 374 74V108Z" />
				<rect x="384" y="92" width="30" height="16" />
				<rect x="424" y="84" width="26" height="24" />
				<rect x="460" y="94" width="22" height="14" />
				<rect x="598" y="86" width="28" height="22" />
			</g>
			<g className="fill-amber-400" opacity="0.75">
				<rect x="46" y="90" width="2" height="3" />
				<rect x="58" y="96" width="2" height="3" />
				<rect x="118" y="86" width="2" height="3" />
				<rect x="128" y="94" width="2" height="3" />
				<rect x="212" y="94" width="2" height="3" />
				<rect x="224" y="98" width="2" height="3" />
				<rect x="278" y="86" width="2" height="3" />
				<rect x="292" y="92" width="2" height="3" />
				<rect x="318" y="94" width="2" height="3" />
				<rect x="392" y="98" width="2" height="3" />
				<rect x="430" y="90" width="2" height="3" />
				<rect x="442" y="98" width="2" height="3" />
				<rect x="604" y="92" width="2" height="3" />
				<rect x="616" y="98" width="2" height="3" />
			</g>
			<g
				className="stroke-muted-foreground"
				fill="none"
				strokeWidth="1.6"
				strokeLinejoin="round"
			>
				<path d="M538 108L560 34L582 108" />
				<path d="M545 88H575M550 70H570M554 54H566" />
				<path d="M545 88L570 70L554 54M575 88L550 70L566 54" />
			</g>
			<circle cx="560" cy="30" r="3.5" fill="#f97316" />
			<circle cx="560" cy="30" r="1.5" fill="#ffffff" />
		</svg>
	);
}
