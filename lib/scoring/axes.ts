import type { AxisId } from "./types";

export type AxisDescriptor = {
  id: AxisId;
  negativeLabel: string;
  positiveLabel: string;
  blurb: string;
};

export const AXES: readonly AxisDescriptor[] = [
  {
    id: "principled_pragmatic",
    negativeLabel: "Principled",
    positiveLabel: "Pragmatic",
    blurb: "decide by moral principle or by outcome",
  },
  {
    id: "rebel_conformist",
    negativeLabel: "Rebel",
    positiveLabel: "Conformist",
    blurb: "push against rules or stay within them",
  },
  {
    id: "victim_victimless",
    negativeLabel: "Victim-facing",
    positiveLabel: "Victimless",
    blurb: "identifiable victim, or nobody hurts",
  },
  {
    id: "self_other",
    negativeLabel: "Self-harming",
    positiveLabel: "Other-harming",
    blurb: "when harm exists, who pays — you or someone else",
  },
  {
    id: "calculated_spontaneous",
    negativeLabel: "Calculated",
    positiveLabel: "Spontaneous",
    blurb: "planned or impulsive",
  },
  {
    id: "ideological_opportunistic",
    negativeLabel: "Ideological",
    positiveLabel: "Opportunistic",
    blurb: "for beliefs or for convenience",
  },
  {
    id: "private_performative",
    negativeLabel: "Private",
    positiveLabel: "Performative",
    blurb: "quietly or loudly about it",
  },
  {
    id: "upward_downward",
    negativeLabel: "Upward-punching",
    positiveLabel: "Downward-punching",
    blurb: "targets above or below you in power",
  },
  {
    id: "active_omissive",
    negativeLabel: "Active",
    positiveLabel: "Omissive",
    blurb: "do gray things, or just omit and not-report",
  },
  {
    id: "realist_absolutist",
    negativeLabel: "Legal-realist",
    positiveLabel: "Legal-absolutist",
    blurb: "law is legitimate, or rules someone made up",
  },
] as const;

export const AXIS_IDS: readonly AxisId[] = AXES.map((a) => a.id);

export function axisById(id: AxisId): AxisDescriptor {
  const found = AXES.find((a) => a.id === id);
  if (!found) throw new Error(`Unknown axis: ${id}`);
  return found;
}
