/**
 * Analyzes radio station stream loudness and outputs LUFS values.
 *
 * Uses ffmpeg's EBU R128 filter to measure integrated LUFS (Loudness Units relative to Full Scale),
 * the industry standard for loudness measurement (same as Spotify, YouTube, etc.).
 *
 * Requirements:
 *   - ffmpeg must be installed and in PATH
 *   - Run with: npx tsx scripts/analyze-station-loudness.ts
 *
 * Options:
 *   --duration <seconds>  How long to sample each stream (default: 20)
 *   --station <id>        Analyze only a specific station
 */

import { spawn } from "child_process";

import { stations } from "../src/lib/data/stations";

const SAMPLE_DURATION = parseInt(getArg("--duration") || "20", 10);
const SPECIFIC_STATION = getArg("--station");

interface AnalysisResult {
	id: string;
	name: string;
	lufs: number | null;
	error?: string;
}

function getArg(flag: string): string | undefined {
	const index = process.argv.indexOf(flag);
	return index !== -1 ? process.argv[index + 1] : undefined;
}

async function measureLoudness(
	streamUrl: string,
	durationSeconds: number
): Promise<number> {
	return new Promise((resolve, reject) => {
		// prettier-ignore
		const args = [
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

		ffmpeg.on("close", (code) => {
			// ffmpeg outputs ebur128 summary to stderr
			// Look for: "I: -16.2 LUFS" (Integrated loudness)
			const match = stderrData.match(/I:\s*(-?\d+\.?\d*)\s*LUFS/);

			// prettier-ignore
			if (match) {
				resolve(parseFloat(match[1]));
			} else if (stderrData.includes("I:")) {
				// Try alternate format
				const altMatch = stderrData.match(/Integrated loudness:[\s\S]*?I:\s*(-?\d+\.?\d*)/);
				if (altMatch) {
					resolve(parseFloat(altMatch[1]));
				} else {
					reject(new Error("Could not parse LUFS from ffmpeg output"));
				}
			} else {
				reject(new Error(`ffmpeg exited with code ${code}, no LUFS data found`));
			}
		});

		ffmpeg.on("error", (err) => {
			reject(new Error(`Failed to spawn ffmpeg: ${err.message}`));
		});

		// prettier-ignore
		setTimeout(() => {
			ffmpeg.kill("SIGTERM");
		}, (durationSeconds + 10) * 1000);
	});
}

async function analyzeStation(
	id: string,
	name: string,
	streamUrl: string
): Promise<AnalysisResult> {
	process.stdout.write(`Analyzing ${name}...`);

	try {
		const lufs = await measureLoudness(streamUrl, SAMPLE_DURATION);
		console.log(` ${lufs.toFixed(1)} LUFS`);
		return { id, name, lufs };
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.log(` ERROR: ${message}`);
		return { id, name, lufs: null, error: message };
	}
}

async function main() {
	console.log("=".repeat(60));
	console.log("Radio Station Loudness Analyzer");
	console.log("=".repeat(60));
	console.log(`Sample duration: ${SAMPLE_DURATION} seconds per station`);
	console.log("");

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
	const stationsToAnalyze = SPECIFIC_STATION
		? enabledStations.filter((s) => s.id === SPECIFIC_STATION)
		: enabledStations;

	if (stationsToAnalyze.length === 0) {
		console.error("No stations found to analyze.");
		process.exit(1);
	}

	console.log(`Analyzing ${stationsToAnalyze.length} station(s)...\n`);

	const results: AnalysisResult[] = [];

	for (const station of stationsToAnalyze) {
		const result = await analyzeStation(
			station.id,
			station.name,
			station.streamUrl
		);
		results.push(result);
	}

	// Summary
	console.log("\n" + "=".repeat(60));
	console.log("RESULTS");
	console.log("=".repeat(60));

	const successful = results.filter((r) => r.lufs !== null);
	const failed = results.filter((r) => r.lufs === null);

	// prettier-ignore
	if (successful.length > 0) {
		console.log("\nCopy these values to stations.ts:\n");

		// Sort by LUFS (loudest first, most negative last)
		successful.sort((a, b) => (b.lufs || 0) - (a.lufs || 0));

		for (const r of successful) {
			console.log(`  lufs: ${r.lufs?.toFixed(1)},  // ${r.name}`);
		}

		const loudest = successful[0];
		const quietest = successful[successful.length - 1];

		console.log(`\nLoudest: ${loudest.name} (${loudest.lufs?.toFixed(1)} LUFS)`);
		console.log(`Quietest: ${quietest.name} (${quietest.lufs?.toFixed(1)} LUFS)`);
		console.log(`Range: ${((loudest.lufs || 0) - (quietest.lufs || 0)).toFixed(1)} dB`);
	}

	if (failed.length > 0) {
		console.log("\nFailed to analyze:");
		for (const r of failed) {
			console.log(`  - ${r.name}: ${r.error}`);
		}
	}
}

main().catch(console.error);
