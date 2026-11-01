"use client";

import {
	ComponentProps,
	KeyboardEvent,
	ReactNode,
	RefObject,
	useRef,
	useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
	ChevronDown,
	ExternalLink,
	Heart,
	Loader2,
	Maximize2,
	Play,
	SkipBack,
	SkipForward,
	Square,
	X,
} from "lucide-react";

import { displayFrequency } from "@/lib/data/stations";
import { useAudioPlayer } from "@/lib/hooks/audio-player";
import { useFavourites } from "@/lib/hooks/use-favourites";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { RadioStation } from "@/lib/types/radio";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerTitle,
} from "@/components/ui/drawer";
import { VolumeControl } from "@/components/layout/volume-control";
import { LiveBars } from "@/components/radio/live-bars";
import { SimilarStations } from "@/components/radio/similar-stations";
import { StationArtwork } from "@/components/radio/station-artwork";
import { ScrollingText } from "@/components/scrolling-text";

const MD_QUERY = "(min-width: 48rem)";
/** Phones open at the half sheet and can be dragged up to the full view */
const PHONE_SNAP_POINTS: (string | number)[] = ["448px", 1];

/**
 * Now-playing view opened from the player bar. On phones it opens as a half
 * sheet (artwork, station, on-air card, controls) that drags up to a full
 * screen with large artwork on a backdrop blurred from it and similar
 * stations. From `md` it opens full screen straight away, with volume and
 * keyboard shortcuts. Closes by swipe down, Escape, the close button, or
 * by picking a station link.
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
	const {
		currentStation,
		currentSong,
		isPlaying,
		isLoading,
		stationsOrder,
		setStation,
		togglePlayPause,
	} = useAudioPlayer();
	const { isFavourite, toggleFavourite } = useFavourites();
	const isPhone = !useMediaQuery(MD_QUERY);
	const [snap, setSnap] = useState<string | number | null>(PHONE_SNAP_POINTS[0]); // prettier-ignore
	const [backdropError, setBackdropError] = useState<string | null>(null);
	const playButtonRef = useRef<HTMLButtonElement>(null);

	if (!currentStation) return null;

	const isFull = !isPhone || snap === 1;
	const isLive = isPlaying && !isLoading;
	const favourited = isFavourite(currentStation.id);
	const song = currentSong?.toLowerCase();
	const subtitle = [displayFrequency(currentStation), currentStation.location]
		.filter(Boolean)
		.join(" · ");
	const genres = currentStation.genres?.slice(0, 3).join(", ");

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
		if (isLoading || (e.target as HTMLElement).closest("[role=slider]")) return; // prettier-ignore
		if (e.key === "ArrowLeft" && prevStation) setStation(prevStation);
		if (e.key === "ArrowRight" && nextStation) setStation(nextStation);
	};

	const controls = (
		<div className="flex items-center gap-6">
			<Button
				variant="ghost"
				size="icon"
				onClick={() => prevStation && setStation(prevStation)}
				aria-label={
					prevStation
						? `Previous station: ${prevStation.name}`
						: "Previous station"
				}
				className="size-12 cursor-pointer"
				disabled={isLoading}
			>
				<SkipBack className="size-6" />
			</Button>
			<Button
				ref={playButtonRef}
				size="icon"
				onClick={togglePlayPause}
				aria-label={isPlaying ? "Stop" : "Play"}
				className="size-16 cursor-pointer rounded-full active:scale-[0.97]"
				disabled={isLoading}
			>
				{isLoading ? (
					<Loader2 className="size-7 animate-spin" />
				) : isPlaying ? (
					<Square className="size-5 fill-current" />
				) : (
					<Play className="size-7" />
				)}
			</Button>
			<Button
				variant="ghost"
				size="icon"
				onClick={() => nextStation && setStation(nextStation)}
				aria-label={
					nextStation
						? `Next station: ${nextStation.name}`
						: "Next station"
				}
				className="size-12 cursor-pointer"
				disabled={isLoading}
			>
				<SkipForward className="size-6" />
			</Button>
			{isFull && <VolumeControl className="hidden md:flex" />}
		</div>
	);

	const actions = (
		<div className="flex w-full max-w-sm gap-2 md:max-w-none md:flex-wrap">
			<Button
				variant="outline"
				onClick={() => toggleFavourite(currentStation.id)}
				aria-pressed={favourited}
				aria-label={
					favourited ? "Remove from favourites" : "Add to favourites"
				}
				className="size-10 cursor-pointer px-0 md:w-auto md:px-4"
			>
				<Heart
					className={cn(
						"size-5",
						favourited && "fill-current text-red-500"
					)}
				/>
				<span className="hidden md:inline">
					{favourited ? "Favourited" : "Favourite"}
				</span>
			</Button>
			<Button
				variant="outline"
				asChild
				className="h-10 flex-1 md:flex-none md:px-4"
			>
				<Link href={`/station/${currentStation.id}`} onClick={close}>
					View station
				</Link>
			</Button>
			<Button
				variant="outline"
				asChild
				aria-label={`Open ${currentStation.name} website`}
				className="size-10 px-0 md:w-auto md:px-4"
			>
				<a
					href={currentStation.website}
					target="_blank"
					rel="noopener noreferrer"
				>
					<ExternalLink className="size-5" />
					<span className="hidden md:inline">Station website</span>
				</a>
			</Button>
		</div>
	);

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
				{/* Blurred artwork backdrop, as on the station page hero. Full view only, so the half sheet's buttons keep their contrast */}
				{isFull && backdropError !== currentStation.image && (
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-x-0 top-0 h-[70%] overflow-hidden"
					>
						<Image
							src={currentStation.image}
							alt=""
							fill
							className="scale-110 object-cover blur-3xl"
							onError={() =>
								setBackdropError(currentStation.image)
							}
						/>
						<div className="from-background/90 via-background/60 to-background absolute inset-0 bg-gradient-to-b" />
					</div>
				)}

				<div className="relative flex h-full flex-col overflow-y-auto px-4 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:px-6 md:px-10 md:pt-6">
					<div className="relative flex h-10 shrink-0 items-center">
						<div
							aria-hidden="true"
							className="bg-muted-foreground/30 absolute inset-x-0 top-0 mx-auto h-1.5 w-12 rounded-full md:hidden"
						/>
						<Link
							href="/"
							onClick={close}
							className="hidden text-lg font-bold md:block"
						>
							Kollox FM
						</Link>
						{isFull ? (
							<DrawerClose asChild>
								<Button
									variant="ghost"
									size="icon"
									aria-label="Close now playing"
									className="size-10 cursor-pointer md:ml-auto"
								>
									<ChevronDown className="size-6 md:hidden" />
									<X className="hidden size-5 md:block" />
								</Button>
							</DrawerClose>
						) : (
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setSnap(1)}
								aria-label="Full view"
								className="ml-auto size-10 cursor-pointer"
							>
								<Maximize2 className="size-5" />
							</Button>
						)}
					</div>

					{isFull ? (
						<div className="container mx-auto flex flex-1 flex-col items-center gap-4 py-2 text-center md:grid md:grid-cols-[auto_minmax(0,1fr)] md:content-center md:gap-12 md:text-left xl:grid-cols-[auto_minmax(0,1fr)_18rem] xl:gap-16">
							<StationArtwork
								station={currentStation}
								className="size-[clamp(8rem,calc(100dvh-35rem),18rem)] rounded-xl shadow-xl md:size-64 xl:size-80"
								iconClassName="size-12"
							/>

							<div className="flex w-full min-w-0 flex-col items-center gap-6 md:items-start">
								<div className="w-full min-w-0 space-y-1">
									<DrawerTitle className="text-2xl md:text-4xl">
										{currentStation.name}
									</DrawerTitle>
									{song && (
										<p className="text-lg font-medium text-balance capitalize">
											{song}
										</p>
									)}
									<DrawerDescription className="text-base">
										{subtitle}
									</DrawerDescription>
									{genres && (
										<p className="text-muted-foreground text-sm">
											{genres}
										</p>
									)}
									<LiveBars
										bars={40}
										active={isLive}
										className="mt-3 h-8 w-full justify-between md:max-w-md"
									/>
								</div>
								{controls}
								{actions}
								<p className="text-muted-foreground hidden flex-wrap gap-x-4 gap-y-1 text-xs md:flex">
									<span>
										<Kbd>Space</Kbd> play / stop
									</span>
									<span>
										<Kbd>←</Kbd> <Kbd>→</Kbd> switch station
									</span>
									<span>
										<Kbd>Esc</Kbd> close
									</span>
								</p>
							</div>

							<SimilarStations
								station={currentStation}
								totalCount={stationsOrder.length}
								onPick={setStation}
								onViewAll={close}
								className="mt-auto w-full md:col-span-2 md:mt-0 xl:col-span-1"
							/>
						</div>
					) : (
						<div className="flex flex-col items-center gap-4 py-2">
							<div className="flex w-full items-center gap-4">
								<StationArtwork
									station={currentStation}
									className="size-16 rounded-xl"
								/>
								<div className="min-w-0 flex-1 space-y-0.5 text-left">
									<DrawerTitle className="truncate text-xl">
										{currentStation.name}
									</DrawerTitle>
									<DrawerDescription className="truncate">
										{subtitle}
									</DrawerDescription>
									{genres && (
										<p className="text-muted-foreground truncate text-sm">
											{genres}
										</p>
									)}
								</div>
							</div>
							<div className="bg-card w-full rounded-xl border p-4">
								<p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
									{isLive
										? "On air now"
										: isLoading
											? "Loading"
											: "Stopped"}
								</p>
								{song && (
									<ScrollingText
										text={song}
										className="mt-1 font-medium capitalize"
									/>
								)}
								<LiveBars
									bars={40}
									active={isLive}
									className="mt-3 h-8 w-full justify-between"
								/>
							</div>
							{controls}
							{actions}
						</div>
					)}
				</div>
			</DrawerContent>
		</Drawer>
	);
}

/**
 * Keyboard key component for displaying shortcut keys.
 */
function Kbd({ children }: { children: ReactNode }) {
	return (
		<kbd className="bg-muted text-foreground rounded border px-1.5 py-0.5 font-mono text-[10px]">
			{children}
		</kbd>
	);
}
