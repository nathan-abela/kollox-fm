/**
 * Analyzes radio station stream loudness and outputs LUFS values.
 *
 * Uses ffmpeg's EBU R128 filter to measure integrated LUFS (Loudness Units relative to Full Scale),
 * the industry standard for loudness measurement (same as Spotify, YouTube, etc.).
 *
 * Each station is sampled several times, spaced apart so the samples catch different songs,
 * ads or talk. The median of the successful samples is reported, and stations whose samples
 * spread more than UNSTABLE_SPREAD_DB are flagged as unstable.
 *
 * Requirements:
 *   - ffmpeg must be installed and in PATH
 *   - Run with: npm run loudness -- [options]
 *
 * Options:
 *   --duration <seconds>   Length of each sample (default: 60)
 *   --samples <n>          Samples per station (default: 3)
 *   --spacing <seconds>    Minimum gap between a station's samples (default: 90)
 *   --concurrency <n>      Max simultaneous ffmpeg processes (default: 5)
 *   --station <id[,id]>    Analyze only these station ids
 */

import { spawn } from "child_process";

import { stations } from "../src/lib/data/stations";
import { RadioStation } from "../src/lib/types/radio";

const SAMPLE_DURATION = parseInt(getArg("--duration") || "60", 10);
const SAMPLE_COUNT = parseInt(getArg("--samples") || "3", 10);
const SAMPLE_SPACING = parseInt(getArg("--spacing") || "90", 10);
const CONCURRENCY = parseInt(getArg("--concurrency") || "5", 10);
const STATION_IDS = getArg("--station")
	?.split(",")
	.map((id) => id.trim())
	.filter(Boolean);

const UNSTABLE_SPREAD_DB = 3;
const SILENCE_THRESHOLD_LUFS = -60;

interface AnalysisResult {
	id: string;
	name: string;
	samples: number[];
	median: number | null;
	spread: number;
	errors: string[];
}

function getArg(flag: string): string | undefined {
	const index = process.argv.indexOf(flag);
	return index !== -1 ? process.argv[index + 1] : undefined;
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Limits how many callers run at once. `acquire()` resolves with the matching release function.
 */
function createSemaphore(limit: number): () => Promise<() => void> {
	let active = 0;
	const waiting: (() => void)[] = [];

	const release = () => {
		active--;
		waiting.shift()?.();
	};

	return async () => {
		if (active >= limit) {
			await new Promise<void>((resolve) => waiting.push(resolve));
		}
		active++;
		return release;
	};
}

function median(values: number[]): number | null {
	if (values.length === 0) return null;
	const sorted = [...values].sort((a, b) => a - b);
	const mid = Math.floor(sorted.length / 2);
	return sorted.length % 2 === 0
		? (sorted[mid - 1] + sorted[mid]) / 2
		: sorted[mid];
}

function spread(values: number[]): number {
	if (values.length < 2) return 0;
	return Math.max(...values) - Math.min(...values);
}

async function measureLoudness(
	streamUrl: string,
	durationSeconds: number
): Promise<number> {
	return new Promise((resolve, reject) => {
		// prettier-ignore
		const args = [
			"-nostdin", "-hide_banner",
			"-t", durationSeconds.toString(),
			"-i", streamUrl,
			"-af", "ebur128=framelog=quiet",
			"-f", "null",
			"-",
		];

		const ffmpeg = spawn("ffmpeg", args, {
			stdio: ["pipe", "pipe", "pipe"],
		});

		let stderrData = "";

		ffmpeg.stderr.on("data", (data) => {
			stderrData += data.toString();
		});

		const timeout = setTimeout(
			() => ffmpeg.kill("SIGTERM"),
			(durationSeconds + 10) * 1000
		);

		ffmpeg.on("close", (code) => {
			clearTimeout(timeout);

			// ffmpeg prints the ebur128 summary to stderr, ex. "I:  -16.2 LUFS" (integrated loudness)
			const match = stderrData.match(/I:\s*(-?\d+\.?\d*)\s*LUFS/);

			if (!match) {
				const lastLine = stderrData.trim().split("\n").pop()?.trim() ?? ""; // prettier-ignore
				reject(new Error(`ffmpeg exited with code ${code}, no LUFS data found (${lastLine})`)); // prettier-ignore
				return;
			}

			const lufs = parseFloat(match[1]);

			if (lufs <= SILENCE_THRESHOLD_LUFS) {
				reject(new Error(`silent sample (${lufs.toFixed(1)} LUFS), stream probably dropped`)); // prettier-ignore
				return;
			}

			resolve(lufs);
		});

		ffmpeg.on("error", (err) => {
			clearTimeout(timeout);
			reject(new Error(`Failed to spawn ffmpeg: ${err.message}`));
		});
	});
}

async function analyzeStation(
	station: RadioStation,
	acquire: () => Promise<() => void>
): Promise<AnalysisResult> {
	const samples: number[] = [];
	const errors: string[] = [];

	for (let i = 1; i <= SAMPLE_COUNT; i++) {
		if (i > 1) await sleep(SAMPLE_SPACING * 1000);

		const release = await acquire();
		const label = `[${station.id}] sample ${i}/${SAMPLE_COUNT}:`;

		try {
			const lufs = await measureLoudness(station.streamUrl, SAMPLE_DURATION); // prettier-ignore
			samples.push(lufs);
			console.log(`${label} ${lufs.toFixed(1)} LUFS`);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error); // prettier-ignore
			errors.push(message);
			console.log(`${label} ERROR: ${message}`);
		} finally {
			release();
		}
	}

	return {
		id: station.id,
		name: station.name,
		samples,
		median: median(samples),
		spread: spread(samples),
		errors,
	};
}

function printSummary(results: AnalysisResult[]) {
	console.log("\n" + "=".repeat(60));
	console.log("RESULTS");
	console.log("=".repeat(60));

	const successful = results
		.filter(
			(r): r is AnalysisResult & { median: number } => r.median !== null
		) // prettier-ignore
		.sort((a, b) => b.median - a.median);
	const failed = results.filter((r) => r.median === null);
	const unstable = successful.filter((r) => r.spread > UNSTABLE_SPREAD_DB);

	if (successful.length > 0) {
		console.log("");
		console.log(`${"Station".padEnd(22)} ${"Median".padStart(7)} ${"Spread".padStart(7)}  Samples`); // prettier-ignore

		for (const r of successful) {
			const samples = r.samples.map((s) => s.toFixed(1)).join(", ");
			const flag = r.spread > UNSTABLE_SPREAD_DB ? "  UNSTABLE" : "";
			console.log(`${r.name.padEnd(22)} ${r.median.toFixed(1).padStart(7)} ${r.spread.toFixed(1).padStart(7)}  ${samples}${flag}`); // prettier-ignore
		}

		console.log("\nCopy these values to stations.ts:\n");

		for (const r of successful) {
			console.log(`  lufs: ${r.median.toFixed(1)},  // ${r.name}`);
		}

		const loudest = successful[0];
		const quietest = successful[successful.length - 1];

		console.log(`\nLoudest: ${loudest.name} (${loudest.median.toFixed(1)} LUFS)`); // prettier-ignore
		console.log(`Quietest: ${quietest.name} (${quietest.median.toFixed(1)} LUFS)`); // prettier-ignore
		console.log(`Range: ${(loudest.median - quietest.median).toFixed(1)} dB`); // prettier-ignore
	}

	if (unstable.length > 0) {
		console.log(`\nUnstable (spread > ${UNSTABLE_SPREAD_DB} dB), consider re-running:`); // prettier-ignore
		for (const r of unstable) {
			console.log(`  - ${r.name}: ${r.spread.toFixed(1)} dB`);
		}
	}

	if (failed.length > 0) {
		console.log("\nFailed to analyze:");
		for (const r of failed) {
			console.log(`  - ${r.name}: ${r.errors[r.errors.length - 1]}`);
		}
	}
}

async function main() {
	console.log("=".repeat(60));
	console.log("Radio Station Loudness Analyzer");
	console.log("=".repeat(60));

	const options = [SAMPLE_DURATION, SAMPLE_COUNT, CONCURRENCY];
	if (
		options.some((n) => !Number.isInteger(n) || n < 1) ||
		!(SAMPLE_SPACING >= 0)
	) {
		// prettier-ignore
		console.error("ERROR: --duration, --samples and --concurrency must be positive integers, --spacing must be >= 0."); // prettier-ignore
		process.exit(1);
	}

	// Check ffmpeg is available
	try {
		await new Promise<void>((resolve, reject) => {
			const check = spawn("ffmpeg", ["-version"], { stdio: "pipe" });
			check.on("close", (code) => (code === 0 ? resolve() : reject()));
			check.on("error", reject);
		});
	} catch {
		console.error("ERROR: ffmpeg not found. Please install ffmpeg and ensure it's in your PATH."); // prettier-ignore
		console.error("  Windows: winget install ffmpeg");
		console.error("  macOS: brew install ffmpeg");
		console.error("  Linux: apt install ffmpeg");
		process.exit(1);
	}

	const enabledStations = stations.filter((s) => s.isEnabled !== false);
	const stationsToAnalyze = STATION_IDS
		? enabledStations.filter((s) => STATION_IDS.includes(s.id))
		: enabledStations;

	for (const id of STATION_IDS ?? []) {
		if (!stationsToAnalyze.some((s) => s.id === id)) {
			console.warn(`WARNING: no enabled station with id "${id}"`);
		}
	}

	if (stationsToAnalyze.length === 0) {
		console.error("No stations found to analyze.");
		process.exit(1);
	}

	console.log(`Stations: ${stationsToAnalyze.length}`);
	console.log(`Samples: ${SAMPLE_COUNT} x ${SAMPLE_DURATION}s per station, at least ${SAMPLE_SPACING}s apart`); // prettier-ignore
	console.log(`Concurrency: ${CONCURRENCY} ffmpeg process(es)\n`);

	const acquire = createSemaphore(CONCURRENCY);
	const results = await Promise.all(
		stationsToAnalyze.map((station) => analyzeStation(station, acquire))
	);

	printSummary(results);
}

main().catch(console.error);
