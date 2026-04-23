export type FigureKind = "fictional" | "real";

export type Figure = {
  id: string;
  name: string;
  kind: FigureKind;
  shade: number;
  rationale: string;
  work?: string;
  citation?: string;
  citationUrl?: string;
};

export function nearestFigures(
  figures: readonly Figure[],
  shade: number,
  n = 3,
): readonly Figure[] {
  return [...figures]
    .map((figure) => ({ figure, distance: Math.abs(figure.shade - shade) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, n)
    .map((entry) => entry.figure);
}

export function nearestMixed(
  figures: readonly Figure[],
  shade: number,
  nFictional = 2,
  nReal = 1,
): readonly Figure[] {
  const fictional = figures.filter((f) => f.kind === "fictional");
  const real = figures.filter((f) => f.kind === "real");
  return [
    ...nearestFigures(fictional, shade, nFictional),
    ...nearestFigures(real, shade, nReal),
  ].sort((a, b) => Math.abs(a.shade - shade) - Math.abs(b.shade - shade));
}
