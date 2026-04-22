<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

Known Next 16 renames so far:
- `middleware.ts` → `proxy.ts` (function name also `proxy`, same matcher API)
- `params` and `searchParams` in pages / icon / apple-icon / opengraph-image are now `Promise`s (await them)

---

# Project: blackorwhite.you

A moral-cartography quiz. User answers → shade 0–100 (0 = total black / never legal, 100 = total white / never illegal) → color codes + named band + archetype match. The site *becomes* your color across bg, theme-color, favicon, and PWA install icon.

## Core principles

1. **Nothing leaves the device.** Quiz is client-only. No backend, no DB, no raw-answer storage. Derived aggregates (final shade) MAY go to GA later behind a consent banner — but per-question answers are Art. 10 GDPR territory and never leave.
2. **Transparent rubric.** Every severity weight, axis loading, citation, and archetype fingerprint is published at `/methodology`, auto-rendered from the data modules so it can't drift.
3. **Neutral framing.** Questions describe an *area of behavior* the user locates themselves in. They never premise guilt ("have you ever committed X?" is wrong framing — use scenario with X as one of N stances).
4. **Real-data-only for named figures.** Fictional characters: free rein. Real people: public-record convictions/admissions/documented incidents only, with citations. Prefer deceased. Dutch defamation (smaad/laster) is stricter than US — no "allegedly".

## Architecture anchors

- `lib/scoring/` — types, 10 axes, 50 archetypes, weighted-sum scorer + nearest-neighbour archetype matcher.
- `lib/color/` — shade → HEX/RGB/HSL/OKLCH + 50 named bands + contrast-safe theme picker.
- `lib/questions/` — jurisdiction-keyed question banks. Each question has per-jurisdiction severity + citation + per-option intensity + axis loadings.
- `lib/figures/` — fictional + real people with shade anchors + rationale/citation. Result screen shows nearest few.
- `lib/browser/` — client-side reflectShade (CSS vars + theme-color + favicon), cookie helpers (OG `bow-shade` + session `bow-view`), favicon canvas generation.
- `lib/og/shadeIcon.tsx` — shared server-side renderer for `/icon`, `/icon1..3`, `/apple-icon`, keyed by the same cookie precedence (view > og > default 100).
- `lib/share/` — base64url-encoded stateless share URLs. Payload: `{ v, s (shade), a (archetype id), x (10 axes), j (jurisdiction) }`. Nothing stored server-side.
- `proxy.ts` — on `/r/*`, decodes shade from slug and injects `bow-view` cookie into request so SSR matches shared shade from first byte (no flash).

## Jurisdictions

v1 target: `nl` (flagship, fully authored) → `de` → `fr` → `uk` → `europe` (aggregate: ECHR + EU directives + member-state average) → `world` (aggregate: ICCPR + Rome Statute + UN conventions).

`us` + others ship after v1.

Status flags in `lib/jurisdictions.ts`:
- `live` — fully authored and selectable in picker
- `coming_soon` — declared but disabled in picker
- `aggregate` — derived/averaged, labelled as such on output

Authoring order: sequential, one jurisdiction at a time. Do NOT stub non-NL severities until NL is at full 80 questions. Once a jurisdiction hits full coverage, flip its flag to `live`.

## Staged roadmap

### Shipped (prior sessions)
- Brutalist-editorial landing (Gotham + Libre Baskerville italic + JetBrains Mono)
- 10 axes + 50 archetypes + 50 shade bands
- Quiz flow (`/begin?len=superfast|fast|classic`) with live shade reflection
- Result screen + download-your-icon
- Dynamic PWA manifest + 5 app icons + apple-icon + theme-color via `generateViewport`
- Stateless share URLs at `/r/[slug]` + `proxy.ts` for zero-flash SSR
- Two-cookie model (`bow-shade` OG + `bow-view` session)
- `/methodology` auto-rendered transparency page

### This session (stages 0, A, B + jurisdiction groundwork)
- **Stage 0 — Neutral framing.** Rewrite all questions. Remove accusatory premises; use scenario-style or frequency-style where tone stays descriptive.
- **Stage A — Scale to 80.** Scale NL from 25 → 80 questions with neutral framing baked in.
- **Stage B — Figures.** Fictional (low risk) + real (high risk, cite or skip). Result screen shows nearest 3 to user's shade.
- **Jurisdiction groundwork.** Picker on `/begin`, extend `Jurisdiction` type with `europe` + `world`, add `j` field to share payload, methodology per-jurisdiction display, result screen shows origin jurisdiction.

### Next session — jurisdiction authoring
For each of DE, FR, UK, Europe, World (in this order):
1. Author per-question `severity` + `citation` entries against the full 80 NL master set.
2. Flip status from `coming_soon` → `live` in `lib/jurisdictions.ts`.
3. Methodology page picks up the new column automatically.
4. Update picker to enable the jurisdiction.

Source starting points:
- **DE**: Strafgesetzbuch (StGB), StVO, BtMG, AO
- **FR**: Code pénal, Code de la route, Code général des impôts
- **UK**: Criminal Justice Act, Misuse of Drugs Act, Road Traffic Act, Theft Act
- **Europe (aggregate)**: ECHR, EU directives, member-state averaging — label as aggregate on output
- **World (aggregate)**: ICCPR, Rome Statute, UN conventions — label as aggregate on output

Rule: each severity number needs a citation. Aggregates may cite the treaty + an averaging note.

### Later sessions
- **US jurisdiction** (federal + note about state variance)
- **GA4 + Klaro consent banner**: only derived aggregates (shade, archetype id), never raw answers
- **Per-shade OG / Twitter image** tied to share URL
- **SEO**: `robots.ts`, `sitemap.ts`
- **Expand figures**: add more fictional/real entries; add "figure search" UI if the module grows

## Question-authoring rules

1. **Neutral premise.** "When X happens, where do you usually land?" not "have you ever X?".
2. **Options span the gray.** 5 options for Likert/scenario, each with its own intensity (0.0 to 1.0) and axis loadings. The "most-admitting" option sits at intensity 1.0.
3. **Severity grounded in statute.** 0–100 scale:
   - 1–10 minor infractions (jaywalking, small speed over)
   - 10–25 everyday misdemeanors (small drug use, minor fraud)
   - 25–50 moderate (tax evasion, simple assault, drug dealing small-scale)
   - 50–75 serious (aggravated violence, significant fraud, organized drug trade)
   - 75–100 severest (rape, murder, crimes against humanity)
4. **Citation required.** Every question's `citation.nl.statute` points at the actual article. Notes are optional but encouraged where NL law diverges from common sense.
5. **Axes per question** load the broad direction; per-option overrides only when option stances genuinely differ on an axis.

## Figure-authoring rules

- **Fictional**: widely-known characters from books/film/TV. Shade anchor + one-line rationale. No real-world defamation exposure.
- **Real**: public-record only. Deceased preferred. If living, must be (a) public figure AND (b) on-record admission OR (c) documented conviction. Citation URL/source required. Any uncertainty → don't include.
- **Mix**: always surface a blend of fictional + real on the result screen so the tone stays satirical rather than accusatory.

## File conventions recap

- Next 16: `proxy.ts` not `middleware.ts`
- Component folders: kebab-case; component files: PascalCase
- Utilities: `lib/<domain>/*` with explicit `index.ts` barrels
- No Zod (runtime validation not needed for compile-in data)
- Biome for lint/format, `bun run check` for type check, `bun run format` to auto-fix
- No comments unless the *why* is non-obvious; no JSDoc unless narrowing JS types
