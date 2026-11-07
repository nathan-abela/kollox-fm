"use client";

import {
	ComponentProps,
	KeyboardEvent,
	RefObject,
	useRef,
	useState,
} from "react";

import { useAudioPlayer } from "@/lib/hooks/audio-player";
import { useFavourites } from "@/lib/hooks/use-favourites";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { RadioStation } from "@/lib/types/radio";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { NowPlayingDesktop } from "@/components/layout/now-playing-desktop";
import { NowPlayingPhone } from "@/components/layout/now-playing-phone";

const MD_QUERY = "(min-width: 48rem)";
/** Phones open at the half sheet and can be dragged up to the full view */
const PHONE_SNAP_POINTS: (string | number)[] = ["448px", 1];

/**
 * Now-playing view opened from the player bar. On phones it opens as a half
 * sheet that drags up to a full screen; from `md` it opens full screen
 * straight away. Owns the drawer shell: snap points, focus, keyboard
 * shortcuts (← → station, R random, F favourite, M mute, Esc close) and
 * closing by swipe, Escape, the close button or a station link.
 */
export function NowPlayingDrawer({
	open,
	onOpenChange,
	returnFocusRef,
	prevStation,
	nextStation,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** The control that opened the drawer, focused again when it closes */
	returnFocusRef: RefObject<HTMLElement | null>;
	prevStation: RadioStation | null;
	nextStation: RadioStation | null;
}) {
	const { currentStation, isLoading, setStation, playRandomStation, toggleMute } = useAudioPlayer(); // prettier-ignore
	const { toggleFavourite } = useFavourites();
	const isPhone = !useMediaQuery(MD_QUERY);
	const [snap, setSnap] = useState<string | number | null>(PHONE_SNAP_POINTS[0]); // prettier-ignore
	const playButtonRef = useRef<HTMLButtonElement>(null);

	if (!currentStation) return null;

	const snapProps: ComponentProps<typeof Drawer> = isPhone
		? {
				snapPoints: PHONE_SNAP_POINTS,
				activeSnapPoint: snap,
				setActiveSnapPoint: setSnap,
				fadeFromIndex: 0,
			}
		: {};

	const close = () => onOpenChange(false);
	const handleOpenChange = (next: boolean) => {
		if (!next) setSnap(PHONE_SNAP_POINTS[0]);
		onOpenChange(next);
	};
	const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.metaKey || e.ctrlKey || e.altKey) return;
		if ((e.target as HTMLElement).closest("[role=slider]")) return;
		switch (e.key) {
			case "ArrowLeft":
				if (!isLoading && prevStation) setStation(prevStation);
				break;
			case "ArrowRight":
				if (!isLoading && nextStation) setStation(nextStation);
				break;
			case "f":
				toggleFavourite(currentStation.id);
				break;
			case "m":
				toggleMute();
				break;
			case "r":
				if (!isLoading) playRandomStation();
				break;
		}
	};

	return (
		// Keyed on the breakpoint: vaul cannot switch snap points on and off while open
		<Drawer
			key={isPhone ? "phone" : "desktop"}
			open={open}
			onOpenChange={handleOpenChange}
			{...snapProps}
			autoFocus
		>
			<DrawerContent
				handle={false}
				className="bg-background h-dvh data-[vaul-drawer-direction=bottom]:mt-0 data-[vaul-drawer-direction=bottom]:max-h-none data-[vaul-drawer-direction=bottom]:rounded-none data-[vaul-drawer-direction=bottom]:border-t-0"
				onKeyDown={handleKeyDown}
				onCloseAutoFocus={(e) => {
					const opener = returnFocusRef.current;
					if (opener?.isConnected) {
						e.preventDefault();
						opener.focus();
					}
				}}
				onOpenAutoFocus={(e) => {
					const playButton = playButtonRef.current;
					if (playButton && !playButton.disabled) {
						e.preventDefault();
						playButton.focus();
					}
				}}
			>
				{isPhone ? (
					<NowPlayingPhone
						station={currentStation}
						full={snap === 1}
						onExpand={() => setSnap(1)}
						onClose={close}
						prevStation={prevStation}
						nextStation={nextStation}
						playButtonRef={playButtonRef}
					/>
				) : (
					<NowPlayingDesktop
						station={currentStation}
						onClose={close}
						prevStation={prevStation}
						nextStation={nextStation}
						playButtonRef={playButtonRef}
					/>
				)}
			</DrawerContent>
		</Drawer>
	);
}
