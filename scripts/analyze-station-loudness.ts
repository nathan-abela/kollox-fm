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
 *   --dry-run              Print the changes to stations.ts without writing them
 *
 * Results are written back into stations.ts: only the `lufs:` number of each measured
 * station changes, rounded to LUFS_STEP_DB, and changes smaller than MIN_CHANGE_DB are
 * skipped to avoid noisy diffs.
 */

import { spawn } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

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
const DRY_RUN = process.argv.includes("--dry-run");

const UNSTABLE_SPREAD_DB = 3;
const SILENCE_THRESHOLD_LUFS = -60;
const MIN_CHANGE_DB = 1;
const LUFS_STEP_DB = 0.5;
const STATIONS_FILE = resolve(
	dirname(fileURLToPath(import.meta.url)),
	"../src/lib/data/stations.ts"
);

interface AnalysisResult {
	id: string;
	name: string;
	samples: number[];
	median: number | null;
	spread: number;
	errors: string[];
}

type MeasuredResult = AnalysisResult & { median: number };

interface StationChange {
	name: string;
	oldLufs: number | null;
	newLufs: number;
	spread: number;
	status: "changed" | "unchanged" | "missing";
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
		.filter((r): r is MeasuredResult => r.median !== null)
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

/**
 * Replaces the `lufs:` number inside each measured station's object literal.
 * Only that number changes, so comments, formatting and `// prettier-ignore` lines survive.
 */
function applyMeasurements(
	source: string,
	results: MeasuredResult[]
): { source: string; changes: StationChange[] } {
	const changes: StationChange[] = [];

	for (const r of results) {
		const newLufs = Math.round(r.median / LUFS_STEP_DB) * LUFS_STEP_DB;
		const base = { name: r.name, newLufs, spread: r.spread };

		const start = source.indexOf(`id: "${r.id}"`);
		const nextStation = start === -1 ? -1 : source.indexOf('id: "', start + 1); // prettier-ignore
		const block = start === -1 ? "" : source.slice(start, nextStation === -1 ? undefined : nextStation); // prettier-ignore
		const match = block.match(/lufs:\s*(-?\d+(?:\.\d+)?)/);

		if (!match || match.index === undefined) {
			changes.push({ ...base, oldLufs: null, status: "missing" });
			continue;
		}

		const oldLufs = parseFloat(match[1]);

		if (Math.abs(newLufs - oldLufs) < MIN_CHANGE_DB) {
			changes.push({ ...base, oldLufs, status: "unchanged" });
			continue;
		}

		const valueStart = start + match.index + match[0].length - match[1].length; // prettier-ignore
		source =
			source.slice(0, valueStart) +
			newLufs.toFixed(1) +
			source.slice(valueStart + match[1].length);
		changes.push({ ...base, oldLufs, status: "changed" });
	}

	return { source, changes };
}

function printChanges(changes: StationChange[]) {
	console.log(`\nChanges to stations.ts${DRY_RUN ? " (dry run, nothing written)" : ""}:`); // prettier-ignore

	for (const c of changes) {
		const name = c.name.padEnd(22);
		const unstable = c.spread > UNSTABLE_SPREAD_DB ? `  UNSTABLE (spread ${c.spread.toFixed(1)} dB)` : ""; // prettier-ignore

		if (c.status === "missing") {
			console.log(`  ${name} no lufs value found, add it manually: ${c.newLufs.toFixed(1)}`); // prettier-ignore
		} else if (c.status === "unchanged") {
			console.log(`  ${name} ${c.oldLufs?.toFixed(1).padStart(6)} (unchanged, difference under ${MIN_CHANGE_DB} dB)`); // prettier-ignore
		} else {
			console.log(`  ${name} ${c.oldLufs?.toFixed(1).padStart(6)} -> ${c.newLufs.toFixed(1)}${unstable}`); // prettier-ignore
		}
	}

	const count = (status: StationChange["status"]) =>
		changes.filter((c) => c.status === status).length;
	console.log(`\nChanged: ${count("changed")}, unchanged: ${count("unchanged")}, missing: ${count("missing")}`); // prettier-ignore
}

function runPrettier(file: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const prettier = spawn("npx", ["prettier", "--write", file], {
			stdio: "inherit",
			shell: true,
		});
		prettier.on("close", (code) =>
			code === 0
				? resolve()
				: reject(new Error(`prettier exited with code ${code}`))
		);
		prettier.on("error", reject);
	});
}

async function updateStationsFile(results: AnalysisResult[]) {
	const measured = results.filter((r): r is MeasuredResult => r.median !== null); // prettier-ignore
	if (measured.length === 0) return;

	const original = readFileSync(STATIONS_FILE, "utf8");
	const { source, changes } = applyMeasurements(original, measured);

	printChanges(changes);

	if (DRY_RUN || source === original) return;

	writeFileSync(STATIONS_FILE, source, "utf8");
	await runPrettier(STATIONS_FILE);
	console.log(`\nWrote ${STATIONS_FILE}`);
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
	await updateStationsFile(results);
}

main().catch(console.error);
