import type { QuizResult } from "@/lib/scoring";

export type SharePerspective = "first-person" | "third-person";

export type ShareMessage = {
  title: string;
  text: string;
  clipboard: string;
};

export function buildShareMessage(
  result: Pick<QuizResult, "shade" | "archetype" | "band">,
  url: string,
  perspective: SharePerspective = "first-person",
): ShareMessage {
  const shade = String(result.shade).padStart(2, "0");
  const title = `Shade ${shade} · ${result.archetype.name} · blackorwhite.you`;
  const text =
    perspective === "first-person"
      ? `I landed on Shade ${shade} · ${result.archetype.name} (${result.band.name}) on blackorwhite.you. Where do you land?`
      : `Shade ${shade} · ${result.archetype.name} (${result.band.name}) on blackorwhite.you. Find your shade.`;
  return {
    title,
    text,
    clipboard: `${text}\n${url}`,
  };
}
