# Audio Normalization

Different radio stations broadcast at different volume levels. This document explains how volume normalization is handled to provide a consistent listening experience.

## What is LUFS?

**LUFS** (Loudness Units relative to Full Scale) is the industry standard for measuring perceived loudness. LUFS accounts for how human ears perceive sound.

| LUFS | Usage                               |
| ---- | ----------------------------------- |
| -14  | Spotify/YouTube target (loud)       |
| -16  | Broadcast standard (moderate)       |
| -23  | EBU R128 reference (quiet, dynamic) |

**Lower numbers = louder audio.** A 10 LUFS difference equals roughly 3x perceived loudness.

## The Problem

Switching between stations can cause volume jumps. For example:

| Station     | LUFS  | Perceived |
| ----------- | ----- | --------- |
| Vibe FM     | -7.4  | Very loud |
| Bay FM      | -15.2 | Moderate  |
| Magic Malta | -9.0  | Loud      |

Switching from Vibe FM (-7 LUFS) to Bay FM (-15 LUFS) is an 8dB difference - almost 3x perceived loudness change.

## How Spotify Handles This

Spotify uses **EBU R128 loudness normalization**:

1. Each track is pre-analyzed for perceived loudness (LUFS)
2. A gain adjustment is stored in metadata
3. During playback, gain is applied to reach target loudness (-14 LUFS)
4. A limiter prevents clipping when boosting quiet tracks

## Our Approach

We store the **measured LUFS value** for each station and calculate the gain adjustment at runtime.

```typescript
const TARGET_LUFS = -16;
const gainDb = TARGET_LUFS - station.lufs;
```

For example:

- Vibe FM at -7.4 LUFS → gainDb = -16 - (-7.4) = **-8.6 dB** (reduce volume)
- Calypso Radio at -18.5 LUFS → gainDb = -16 - (-18.5) = **+2.5 dB** (boost volume)

### How It Works

```typescript
function calculateEffectiveVolume(userVolume, stationLufs) {
  const baseVolume = userVolume / 100;
  const gainDb = TARGET_LUFS - stationLufs;
  const stationMultiplier = Math.pow(10, gainDb / 20); // dB to linear
  return Math.min(1, Math.max(0, baseVolume * stationMultiplier));
}
```

### Workflow for New Stations

1. Run the analysis script (multiple times for accuracy)
2. Average the LUFS values
3. Add `lufs: <value>` to the station in `stations.ts`

## Limitations

### CORS Restriction (Cannot Use Web Audio API)

The ideal approach would be real-time loudness analysis using the Web Audio API:

```mermaid
graph LR
  Audio[Audio Element]
  Source[MediaElementSource]
  Analyser[AnalyserNode]
  Gain[GainNode]
  Speakers[Speakers]

  Audio --> Source --> Analyser --> Gain --> Speakers
```

However, browsers block `MediaElementAudioSourceNode` for cross-origin streams:

```md
MediaElementAudioSource outputs zeroes due to CORS access restrictions
```

This is a security measure - the browser prevents JavaScript from reading audio data from other domains. Since radio streams come from external servers without CORS headers, we cannot:

- Analyze the audio in real-time
- Measure RMS/LUFS dynamically
- Auto-adjust gain based on content

### Cannot Boost Beyond 100%

`HTMLAudioElement.volume` is clamped to 0-1. This means:

- Reducing loud stations works perfectly (negative gainDb)
- Boosting quiet stations only works if user volume is below 100%

Example at 70% user volume with +6dB boost:

```md
0.7 × 2.0 = 1.4 -> clamped to 1.0 (100%)
```

**Implication:** Stations that broadcast too quietly (like Bay Retro at -29 LUFS) cannot be amplified beyond their native maximum. The only solutions would be:

1. The station increases their broadcast level
2. Proxy streams through a server that adds CORS headers
3. User manually increases system volume

## Station Loudness Measurements

Measured using ffmpeg's EBU R128 filter (20-second samples, target -16 LUFS). Multiple runs help account for content variation (music/ ads/ talk).

| Station              | Run 1 | Run 2 |
| -------------------- | ----- | ----- |
| Bay FM               | -15.2 | -13.7 |
| Bay Easy             | -11.0 | -10.9 |
| Bay Retro            | -29.2 | -30.1 |
| Vibe FM              | -7.4  | -8.0  |
| Magic Malta FM       | -9.0  | -8.8  |
| Pure Radio           | -6.8  | -7.0  |
| Smash FM             | -13.0 | -9.6  |
| Calypso Radio        | -18.5 | -17.1 |
| RTK 103              | -20.1 | -21.9 |
| ONE Radio            | -20.3 | -19.7 |
| NET FM               | -9.9  | -13.1 |
| Campus FM            | -17.6 | -17.0 |
| Smooth Radio         | -6.3  | -6.3  |
| Smooth Breeze        | -8.4  | -8.1  |
| Maltin Biss          | -6.7  | -6.6  |
| BKR Radio            | -14.1 | -15.2 |
| Radju Luminaria      | -7.1  | -7.9  |
| Malta Sunshine Radio | -10.0 | -10.5 |
| Radio 105            | -8.6  | -6.5  |
| Radio 105 Retro      | -10.4 | -10.6 |
| Radio 105 Sixties    | -11.6 | -12.1 |
| Radio 105 Nineties   | -11.1 | -9.7  |
| Radio 105 Rock       | -10.8 | -10.4 |
| Radio 105 Urban      | -8.1  | -9.1  |
| Radio 105 Cuore      | -10.0 | -8.6  |
| Radio 105 Mellow     | -12.1 | -13.2 |
| Radio 105 Maltin     | -13.3 | -10.9 |
| Radio 105 Reggae     | -8.8  | -9.9  |
| Radio 105 Country    | -6.0  | -7.9  |
| Radio 105 Eurovision | -7.2  | -10.0 |
| Radio 105 Christmas  | -10.2 | -13.1 |

### Why Radio 105 Stations Vary

Despite being from the same host, Radio 105 channels vary by ~7dB because different music genres are mastered at different loudness levels:

- **Louder:** Country, Eurovision, Urban (heavily compressed modern masters)
- **Quieter:** Mellow, Maltin (more dynamic range, folk/acoustic content)

## Analysis Script

To analyze stations, install ffmpeg and run:

```bash
npx tsx scripts/analyze-station-loudness.ts
```

Options:

- `--duration <seconds>` - Sample duration (default: 20)
- `--station <id>` - Analyze specific station

The script outputs LUFS values that can be copied directly to `stations.ts`.

## Files

- `src/lib/types/radio.ts` - RadioStation interface with `lufs` field
- `src/lib/hooks/audio-player.tsx` - Volume calculation with gain derived from LUFS
- `src/lib/data/stations.ts` - Station data with LUFS values
- `scripts/analyze-station-loudness.ts` - LUFS analysis script
