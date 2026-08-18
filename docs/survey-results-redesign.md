# Survey Results - Redesign Notes

Working notes for the survey-results redesign.

## Starting position

The section is **not** short on content: `/survey-results` lists 11 editions (2015–2025), and each year renders five tabs - Overview, Most Followed, Daily Audience, Programmes, Reception - across ~24 components, twelve of them charts. Charting is Recharts used directly, not through the repo's own `src/components/ui/chart.tsx` wrapper.

The problem isn't coverage but rather that the chart forms are mostly defaults, and that eleven years of data are presented as eleven unconnected pages.

## What the data actually supports

`Survey` is richer than the current pages use. Per edition:

| Field                             | Shape                                          | Currently used for           |
| --------------------------------- | ---------------------------------------------- | ---------------------------- |
| `stations[].mostFollowedPct`      | % per station                                  | tooltip only, on some charts |
| `stations[].weeklySharePct`       | % per station                                  | weekly averages table        |
| `stations[].stationListeners`     | count                                          | the top-stations bar chart   |
| `stations[].avgHours`             | hours/day per listener                         | little or nothing            |
| `stations[].dailyListeners`       | date -> count                                  | daily audience tab           |
| `stations[].ageDemographics`      | 7 age brackets                                 | heatmap                      |
| `stations[].genderDemographics`   | m/f                                            | demographics charts          |
| `stations[].districtDemographics` | 6 Malta districts                              | older surveys only           |
| `timebands[]`                     | 30-min slots, listeners **and `topStationId`** | listener curve               |
| `programmes[]`                    | name, station, %, demographics                 | programmes tab               |
| `receptionTypes[]`                | how people tune in, with demographics          | reception tab                |
| `dabOwnership`                    | ownership % + usage split (2017–19)            | reception tab                |

Two fields stand out as under-used: **`timebands[].topStationId`** (who leads each half-hour) and **`stations[].avgHours`** (intensity, not just reach).

## The biggest opportunity: cross-year

Nothing in the app compares editions. Every page is one year in isolation, and the year switcher is prev/next buttons at the bottom of the page.

Eleven consecutive years of national audience data is the one asset here that can't be generated, scraped in an afternoon, or replicated by a competitor. It deserves a first-class view - a `/survey-results/trends` page, or a section on the index:

- **Rank over time (bump chart).** Station rank per year, 2015->2025. Shows Calypso overtaking, ONE holding, newcomers arriving. One chart that tells the whole story of Maltese radio for a decade.
- **Share over time (multi-line).** `mostFollowedPct` or `weeklySharePct` per station per year, with a small number of highlighted series and the rest greyed - not eleven equally-weighted lines.
- **"No radio" over time.** The share naming no station at all is a genuinely interesting cultural indicator and is already in the data.
- **Peak listening drift.** Whether the morning peak has shifted earlier or later across a decade.

This is where effort pays off most, and it should probably come before polishing any single-year chart.

## Concrete issues found

1. **Hard-coded Y domain.** `top-stations-chart.tsx:110` sets `domain={[0, 45000]}`. Editions with different population estimates will be squashed or clipped. Domains should derive from the data.
2. **Wrong chart form for long labels.** The same chart uses vertical bars with station names rotated −45° and truncated to 14 characters (`:101`). Ranked categories with long names are the textbook case for **horizontal** bars: labels read normally, nothing truncates, and rank reads top-to-bottom. This single change fixes the most-visible chart on the page.
3. **Chart junk.** The dotted-pattern background (`:65–89`) adds no information and competes with the bars. Remove.
4. **Data hidden in tooltips.** `mostFollowedPct` is computed and then only shown on hover. Anything that matters should be visible without interaction - tooltips are for detail, not for the primary reading.
5. **Card styling drift.** Chart cards use `rounded-2xl shadow-md`, predating the radius scale set during theming (`--radius: 0.5rem`, so tiles are `rounded-xl`). They should match the rest of the site.
6. **Chart tokens are stale.** `--chart-1..7` and `--heatmap-1..5` were deliberately left on the old cool-slate palette when the site palette was replaced, so these pages are the last un-themed surface. Re-deriving them is part of this work.
7. **Two chart APIs.** Recharts is imported directly here while `components/ui/chart.tsx` exists unused. Pick one.

## Principles for the rework

- **Form follows question.** Ranked comparison -> horizontal bars. Change over time -> lines. Part-to-whole across few categories -> stacked bar, not a pie. Distribution across age brackets -> small multiples rather than one dense heatmap.
- **Colour carries meaning or nothing.** With the site now on neutral chrome, charts are where colour legitimately lives - but categorical colour should only encode series identity, and sequential ramps should be used for ordered quantities. Avoid rainbow assignment across seven chart tokens by default.
- **Never colour alone.** Pair with direct labels or ordering so the charts survive greyscale and colour-blindness.
- **Tabular figures.** Already available site-wide via `font-mono`; percentages and listener counts should use it so columns align.
- **Every chart needs a plain-language takeaway.** A one-line subtitle stating what the reader should notice beats a title that only names the axes.
- **Tables are not a fallback, they're a feature.** The existing `weekly-averages-table` and `programmes-table` are good; keep the pattern of offering the numbers, not only the picture.

## Sequencing when this gets picked up

1. Re-derive `--chart-*` / `--heatmap-*` against the neutral palette - closes the theming loop and everything else builds on it.
2. Fix `top-stations-chart` (horizontal bars, derived domain, drop the pattern). Highest visibility, lowest risk.
3. Audit the remaining eleven charts against the principles above.
4. Build the cross-year view. Largest new value; do it once the single-year pages are stable.
5. Link ranked rows through to station pages - **blocked** until the missing stations exist in `stations.ts` (Radju Malta, Radju Marija, Radju Malta 2, Foreign Station - all tracked in `todo.md`, all present in every edition).

## Open questions

- Should the index page lead with the trends view rather than a grid of year cards? The grid treats all eleven editions as equals when readers almost certainly want the latest plus the trajectory.
- Is `avgHours` (time spent) worth surfacing as its own view? Reach and intensity tell different stories - a station can be widely sampled but rarely dwelt on.
- Do the older editions (2015–2016) have enough field coverage to appear in cross-year charts, or will series need explicit gaps?
