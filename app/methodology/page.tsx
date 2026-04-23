import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SwipeLink } from "@/components/ui/SwipeLink";
import { SHADE_BANDS, shadeToHex } from "@/lib/color";
import { FIGURES } from "@/lib/figures/server";
import { questionsFor } from "@/lib/questions";
import { ARCHETYPES, type Archetype, AXES, type Question } from "@/lib/scoring";

const NL_QUESTIONS = questionsFor("nl", "classic");

function dominantAxesFor(archetype: Archetype): string {
  return AXES.map((axis) => ({
    axis,
    value: archetype.axes[axis.id] ?? 0,
  }))
    .filter((e) => Math.abs(e.value) >= 0.6)
    .sort((x, y) => Math.abs(y.value) - Math.abs(x.value))
    .slice(0, 4)
    .map((e) => (e.value < 0 ? e.axis.negativeLabel : e.axis.positiveLabel))
    .join(" · ");
}

function groupQuestionsByTag(
  questions: readonly Question[],
): Array<[string, Question[]]> {
  const groups = new Map<string, Question[]>();
  for (const q of questions) {
    const primary = q.tags?.[0] ?? "uncategorized";
    const bucket = groups.get(primary) ?? [];
    bucket.push(q);
    groups.set(primary, bucket);
  }
  return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
}

function formatIntensityList(q: Question): string {
  return q.answers
    .map((a) => `${a.label} (${a.intensity.toFixed(2)})`)
    .join(" · ");
}

function dominantAxesForQuestion(q: Question): string {
  if (!q.axes) return "—";
  return Object.entries(q.axes)
    .filter(([, v]) => v !== undefined && Math.abs(v) >= 0.4)
    .sort(([, a], [, b]) => Math.abs(b ?? 0) - Math.abs(a ?? 0))
    .slice(0, 3)
    .map(([id, v]) => {
      const axis = AXES.find((a) => a.id === id);
      if (!axis) return "";
      const label = (v ?? 0) < 0 ? axis.negativeLabel : axis.positiveLabel;
      return `${label} ${((v ?? 0) * 100).toFixed(0)}`;
    })
    .join(" · ");
}

export const metadata = {
  title: "Methodology · blackorwhite.you",
  description:
    "Transparent rubric — the shade formula, the ten axes, the fifty bands, the fifty archetypes, and the questions with their severities and citations.",
};

export default function MethodologyPage() {
  const questionGroups = groupQuestionsByTag(NL_QUESTIONS);

  return (
    <main className="min-h-dvh flex flex-col">
      <SiteHeader section="§ 003 · Methodology" />

      <section className="px-[var(--gutter)] py-[clamp(4rem,8vw,9rem)] hairline-bot">
        <p className="eyebrow mb-6">§ 003 — The transparent rubric</p>
        <h1
          className="font-black tracking-tight leading-[0.85]"
          style={{ fontSize: "var(--step-display)" }}
        >
          Methodology
        </h1>
        <p
          className="italic-accent mt-6 max-w-[60ch]"
          style={{ fontSize: "var(--step-2)", lineHeight: 1.35 }}
        >
          How the gray gets measured. Every formula, every weight, every
          question, with sources. Published so you can argue with it.
        </p>
        <nav
          className="mt-10 flex flex-wrap gap-x-8 gap-y-3 eyebrow"
          style={{ opacity: 0.8 }}
          aria-label="Methodology sections"
        >
          <SwipeLink href="#shade">a · Shade</SwipeLink>
          <SwipeLink href="#axes">b · Axes</SwipeLink>
          <SwipeLink href="#bands">c · Bands</SwipeLink>
          <SwipeLink href="#archetypes">d · Archetypes</SwipeLink>
          <SwipeLink href="#questions">e · Questions</SwipeLink>
          <SwipeLink href="#figures">f · Figures</SwipeLink>
          <SwipeLink href="#disclaimers">g · Disclaimers</SwipeLink>
        </nav>
      </section>

      <section
        id="shade"
        className="px-[var(--gutter)] py-[clamp(3rem,6vw,6rem)] hairline-bot grid grid-cols-12 gap-[var(--gutter)]"
      >
        <div className="col-span-12 md:col-span-4">
          <p className="eyebrow mb-4">§ 003·a</p>
          <h2
            className="font-black tracking-tight"
            style={{ fontSize: "var(--step-4)", lineHeight: 0.95 }}
          >
            The shade
          </h2>
        </div>
        <div className="col-span-12 md:col-span-8 flex flex-col gap-6 max-w-[64ch]">
          <p style={{ fontSize: "var(--step-1)", lineHeight: 1.45 }}>
            Every quiz result is a single number from 00 to 100. 00 is total
            black — never legal. 100 is total white — never illegal. The space
            between is the gray you operate in.
          </p>
          <p
            className="mono-nums"
            style={{ fontSize: "var(--step-0)", lineHeight: 1.5 }}
          >
            shade = 100 × (1 − Σ(intensityₐ × severityₐ) / Σ(severityₐ))
          </p>
          <p style={{ fontSize: "var(--step-0)", lineHeight: 1.55 }}>
            Each answer has an <em className="italic-accent">intensity</em> (0
            for &ldquo;never&rdquo;, 1 for &ldquo;always&rdquo; or a single
            yes). Each question has a{" "}
            <em className="italic-accent">severity</em> rooted in the relevant
            statute — petty stuff like jaywalking lands near 1; assault near 60;
            the most serious acts near 90. The weighted average is subtracted
            from 100.
          </p>
          <p style={{ fontSize: "var(--step-0)", lineHeight: 1.55 }}>
            This means a single admission of a high-severity act pulls your
            shade down hard; many admissions of small severities accumulate
            mildly. That matches the way the law itself thinks about gray.
          </p>
        </div>
      </section>

      <section
        id="axes"
        className="px-[var(--gutter)] py-[clamp(3rem,6vw,6rem)] hairline-bot"
      >
        <div className="grid grid-cols-12 gap-[var(--gutter)] mb-10">
          <div className="col-span-12 md:col-span-4">
            <p className="eyebrow mb-4">§ 003·b</p>
            <h2
              className="font-black tracking-tight"
              style={{ fontSize: "var(--step-4)", lineHeight: 0.95 }}
            >
              The ten axes
            </h2>
          </div>
          <div className="col-span-12 md:col-span-8 max-w-[64ch]">
            <p style={{ fontSize: "var(--step-1)", lineHeight: 1.45 }}>
              Two people can land on the same shade for very different reasons.
              Each question also loads onto one or more of these ten axes, so
              your archetype reflects <em className="italic-accent">why</em>,
              not just <em className="italic-accent">how much</em>.
            </p>
          </div>
        </div>
        <ul className="flex flex-col">
          {AXES.map((axis, i) => (
            <li
              key={axis.id}
              className="grid grid-cols-12 gap-[var(--gutter)] py-5 hairline-top"
              style={
                i === AXES.length - 1 ? { borderBottom: "none" } : undefined
              }
            >
              <span
                className="mono-nums font-bold col-span-2 md:col-span-1"
                style={{ fontSize: "var(--step-0)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="col-span-10 md:col-span-4 font-bold tracking-tight"
                style={{ fontSize: "var(--step-1)" }}
              >
                {axis.negativeLabel}{" "}
                <span className="italic-accent font-normal opacity-70">↔</span>{" "}
                {axis.positiveLabel}
              </span>
              <span
                className="col-span-12 md:col-span-7 italic-accent"
                style={{ fontSize: "var(--step-0)", lineHeight: 1.5 }}
              >
                {axis.blurb}.
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="bands"
        className="px-[var(--gutter)] py-[clamp(3rem,6vw,6rem)] hairline-bot"
      >
        <div className="grid grid-cols-12 gap-[var(--gutter)] mb-8">
          <div className="col-span-12 md:col-span-4">
            <p className="eyebrow mb-4">§ 003·c</p>
            <h2
              className="font-black tracking-tight"
              style={{ fontSize: "var(--step-4)", lineHeight: 0.95 }}
            >
              The fifty bands
            </h2>
          </div>
          <div className="col-span-12 md:col-span-8 max-w-[64ch]">
            <p style={{ fontSize: "var(--step-1)", lineHeight: 1.45 }}>
              The 0–100 scale is sliced into fifty named bands. Your shade lands
              in one and inherits its name. Two shades apart means a different
              flavor.
            </p>
          </div>
        </div>
        <div className="flex w-full h-12 mb-6 hairline">
          {SHADE_BANDS.map((band) => (
            <div
              key={band.name}
              title={`${String(band.min).padStart(2, "0")}–${String(band.max).padStart(2, "0")} · ${band.name}`}
              className="flex-1"
              style={{
                background: shadeToHex(Math.round((band.min + band.max) / 2)),
              }}
              role="img"
              aria-label={`${band.name} · shade ${band.min}–${band.max}`}
            />
          ))}
        </div>
        <ul
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-2 mono-nums"
          style={{ fontSize: "var(--step--1)" }}
        >
          {SHADE_BANDS.map((band) => (
            <li key={band.name} className="flex items-baseline gap-2">
              <span className="font-bold">
                {String(band.min).padStart(2, "0")}
              </span>
              <span className="italic-accent" style={{ opacity: 0.85 }}>
                {band.name}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="archetypes"
        className="px-[var(--gutter)] py-[clamp(3rem,6vw,6rem)] hairline-bot"
      >
        <div className="grid grid-cols-12 gap-[var(--gutter)] mb-8">
          <div className="col-span-12 md:col-span-4">
            <p className="eyebrow mb-4">§ 003·d</p>
            <h2
              className="font-black tracking-tight"
              style={{ fontSize: "var(--step-4)", lineHeight: 0.95 }}
            >
              The fifty archetypes
            </h2>
          </div>
          <div className="col-span-12 md:col-span-8 max-w-[64ch]">
            <p style={{ fontSize: "var(--step-1)", lineHeight: 1.45 }}>
              Each archetype is anchored to a shade and described by a dominant
              cluster of axes. Your final archetype is the nearest-neighbour
              match within your shade band.
            </p>
          </div>
        </div>
        <ul className="flex flex-col">
          {[...ARCHETYPES]
            .sort((a, b) => a.shadeAnchor - b.shadeAnchor)
            .map((archetype) => (
              <li
                key={archetype.id}
                className="grid grid-cols-12 gap-x-[var(--gutter)] gap-y-1 py-5 hairline-top"
              >
                <span
                  className="mono-nums font-black col-span-2 md:col-span-1"
                  style={{ fontSize: "var(--step-2)", lineHeight: 1 }}
                >
                  {String(archetype.shadeAnchor).padStart(2, "0")}
                </span>
                <div className="col-span-10 md:col-span-4 flex flex-col gap-1">
                  <span
                    className="font-bold tracking-tight"
                    style={{ fontSize: "var(--step-1)" }}
                  >
                    {archetype.name}
                  </span>
                  <span
                    className="italic-accent"
                    style={{
                      fontSize: "var(--step--1)",
                      opacity: 0.7,
                      lineHeight: 1.35,
                    }}
                  >
                    {archetype.blurb}
                  </span>
                </div>
                <span
                  className="col-span-12 md:col-span-7 eyebrow self-center"
                  style={{ opacity: 0.75, lineHeight: 1.5 }}
                >
                  {dominantAxesFor(archetype) || "Balanced"}
                </span>
              </li>
            ))}
        </ul>
      </section>

      <section
        id="questions"
        className="px-[var(--gutter)] py-[clamp(3rem,6vw,6rem)] hairline-bot"
      >
        <div className="grid grid-cols-12 gap-[var(--gutter)] mb-10">
          <div className="col-span-12 md:col-span-4">
            <p className="eyebrow mb-4">§ 003·e</p>
            <h2
              className="font-black tracking-tight"
              style={{ fontSize: "var(--step-4)", lineHeight: 0.95 }}
            >
              The questions
            </h2>
          </div>
          <div className="col-span-12 md:col-span-8 max-w-[64ch]">
            <p style={{ fontSize: "var(--step-1)", lineHeight: 1.45 }}>
              The live NL bank, grouped by topic. Each entry shows the prompt,
              format, jurisdictional severity, statute citation, answer
              intensities, and the axes it loads onto.
            </p>
            <p className="eyebrow mt-4" style={{ opacity: 0.7 }}>
              {NL_QUESTIONS.length} questions authored · more to come to reach
              80
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-10">
          {questionGroups.map(([tag, group]) => (
            <div key={tag}>
              <div className="flex items-baseline justify-between mb-4 hairline-bot pb-2">
                <span className="eyebrow" style={{ fontSize: "var(--step-0)" }}>
                  {tag}
                </span>
                <span className="eyebrow mono-nums" style={{ opacity: 0.6 }}>
                  {String(group.length).padStart(2, "0")}
                </span>
              </div>
              <ul className="flex flex-col gap-6">
                {group.map((q) => (
                  <li key={q.id} className="flex flex-col gap-2">
                    <p
                      className="font-bold"
                      style={{
                        fontSize: "var(--step-1)",
                        lineHeight: 1.3,
                      }}
                    >
                      {q.prompt}
                    </p>
                    <dl
                      className="grid grid-cols-[8rem_1fr] gap-x-4 gap-y-1 eyebrow"
                      style={{
                        fontSize: "var(--step--2)",
                        opacity: 0.85,
                      }}
                    >
                      <dt style={{ opacity: 0.6 }}>Format</dt>
                      <dd>{q.format}</dd>
                      <dt style={{ opacity: 0.6 }}>Severity · NL</dt>
                      <dd className="mono-nums">
                        {q.severity.nl ?? "—"} / 100
                      </dd>
                      {q.citation?.nl && (
                        <>
                          <dt style={{ opacity: 0.6 }}>Citation</dt>
                          <dd>
                            {q.citation.nl.statute}
                            {q.citation.nl.note
                              ? ` — ${q.citation.nl.note}`
                              : ""}
                          </dd>
                        </>
                      )}
                      <dt style={{ opacity: 0.6 }}>Answers</dt>
                      <dd>{formatIntensityList(q)}</dd>
                      <dt style={{ opacity: 0.6 }}>Axes</dt>
                      <dd>{dominantAxesForQuestion(q) || "—"}</dd>
                    </dl>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section
        id="figures"
        className="px-[var(--gutter)] py-[clamp(3rem,6vw,6rem)] hairline-bot"
      >
        <div className="grid grid-cols-12 gap-[var(--gutter)] mb-10">
          <div className="col-span-12 md:col-span-4">
            <p className="eyebrow mb-4">§ 003·f</p>
            <h2
              className="font-black tracking-tight"
              style={{ fontSize: "var(--step-4)", lineHeight: 0.95 }}
            >
              The figures
            </h2>
          </div>
          <div className="col-span-12 md:col-span-8 max-w-[64ch]">
            <p style={{ fontSize: "var(--step-1)", lineHeight: 1.45 }}>
              Figures you can compare your shade against. Fictional characters
              are estimated opinion; real people appear only with public-record
              citations.
            </p>
            <p className="eyebrow mt-4" style={{ opacity: 0.7 }}>
              {FIGURES.filter((f) => f.kind === "fictional").length} fictional ·{" "}
              {FIGURES.filter((f) => f.kind === "real").length} real
            </p>
          </div>
        </div>

        {(["fictional", "real"] as const).map((kind) => {
          const list = [...FIGURES]
            .filter((f) => f.kind === kind)
            .sort((a, b) => a.shade - b.shade);
          return (
            <div key={kind} className="mb-12 last:mb-0">
              <div className="flex items-baseline justify-between mb-4 hairline-bot pb-2">
                <span className="eyebrow" style={{ fontSize: "var(--step-0)" }}>
                  {kind === "fictional"
                    ? "fictional"
                    : "real · public record only"}
                </span>
                <span className="eyebrow mono-nums" style={{ opacity: 0.6 }}>
                  {String(list.length).padStart(2, "0")}
                </span>
              </div>
              <ul className="flex flex-col">
                {list.map((figure) => (
                  <li
                    key={figure.id}
                    className="grid grid-cols-[3rem_1fr] gap-x-5 py-4 hairline-bot last:border-b-0"
                  >
                    <span
                      className="mono-nums font-black"
                      style={{ fontSize: "var(--step-2)", lineHeight: 1 }}
                    >
                      {String(figure.shade).padStart(2, "0")}
                    </span>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <span
                          className="font-bold tracking-tight"
                          style={{ fontSize: "var(--step-1)" }}
                        >
                          {figure.name}
                        </span>
                        {figure.work && (
                          <span className="eyebrow" style={{ opacity: 0.55 }}>
                            {figure.work}
                          </span>
                        )}
                      </div>
                      <p
                        className="italic-accent"
                        style={{
                          fontSize: "var(--step-0)",
                          lineHeight: 1.45,
                        }}
                      >
                        {figure.rationale}
                      </p>
                      {figure.citation && (
                        <p className="eyebrow mt-1" style={{ opacity: 0.7 }}>
                          {figure.citationUrl ? (
                            <a
                              href={figure.citationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative inline-block pb-[1px]"
                              style={{ textDecoration: "none" }}
                            >
                              ↗ {figure.citation}
                              <span
                                aria-hidden
                                className="pointer-events-none absolute left-0 bottom-0 h-px w-full bg-current transition-all duration-300 group-hover:w-0 group-focus-visible:w-0"
                              />
                            </a>
                          ) : (
                            figure.citation
                          )}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <section
        id="disclaimers"
        className="px-[var(--gutter)] py-[clamp(3rem,6vw,6rem)] hairline-bot"
      >
        <div className="grid grid-cols-12 gap-[var(--gutter)]">
          <div className="col-span-12 md:col-span-4">
            <p className="eyebrow mb-4">§ 003·g</p>
            <h2
              className="font-black tracking-tight"
              style={{ fontSize: "var(--step-4)", lineHeight: 0.95 }}
            >
              Disclaimers
            </h2>
          </div>
          <ul
            className="col-span-12 md:col-span-8 flex flex-col gap-4 max-w-[64ch]"
            style={{ fontSize: "var(--step-0)", lineHeight: 1.55 }}
          >
            <li className="flex gap-4">
              <span className="mono-nums opacity-60 shrink-0">01</span>
              <span>
                This is a{" "}
                <em className="italic-accent">satirical moral cartography</em>,
                not legal advice, not a psychological assessment, not a
                confession service. It does not authorise, excuse, or accuse
                anything.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="mono-nums opacity-60 shrink-0">02</span>
              <span>
                Severities are rooted in Dutch statutes (Wetboek van Strafrecht,
                Opiumwet, WVW, Auteurswet, etc.). They reflect statutory
                seriousness, not moral weight. Other jurisdictions coming — the
                architecture already supports them.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="mono-nums opacity-60 shrink-0">03</span>
              <span>
                <em className="italic-accent">Nothing leaves your device.</em>{" "}
                The quiz runs client-side only. No answers are sent anywhere. No
                account, no tracking of responses, no database of user results.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="mono-nums opacity-60 shrink-0">04</span>
              <span>
                Your derived shade may be stored in a first-party cookie
                (bow-shade) so the site can colour itself for you across visits,
                and in a session cookie (bow-view) while viewing someone
                else&rsquo;s shared result. Both are removable via browser
                settings.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="mono-nums opacity-60 shrink-0">05</span>
              <span>
                Shared result links encode the result{" "}
                <em className="italic-accent">inside the URL itself</em> as
                base64url. They are not stored on any server. Revoking a share
                means deleting the URL.
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section className="px-[var(--gutter)] py-[clamp(3rem,5vw,5rem)] flex flex-wrap gap-3">
        <Link href="/" className="hairline invert-on-hover px-6 py-3 eyebrow">
          ← Landing
        </Link>
        <Link
          href="/begin?len=fast"
          className="hairline invert-on-hover px-6 py-3 eyebrow"
        >
          → Take the quiz
        </Link>
      </section>

      <SiteFooter mark="§ 003 · Methodology" />
    </main>
  );
}
