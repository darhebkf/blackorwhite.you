import type { Jurisdiction } from "@/lib/jurisdictions";

export type AxisId =
  | "principled_pragmatic"
  | "rebel_conformist"
  | "victim_victimless"
  | "self_other"
  | "calculated_spontaneous"
  | "ideological_opportunistic"
  | "private_performative"
  | "upward_downward"
  | "active_omissive"
  | "realist_absolutist";

export type AxisVector = Partial<Record<AxisId, number>>;

export type AnswerFormat = "likert" | "binary" | "scenario";

export type Citation = {
  statute: string;
  note?: string;
};

export type AnswerOption = {
  label: string;
  intensity: number;
  axes?: AxisVector;
};

export type Question = {
  id: string;
  prompt: string;
  format: AnswerFormat;
  severity: Partial<Record<Jurisdiction, number>>;
  axes?: AxisVector;
  answers: readonly AnswerOption[];
  citation?: Partial<Record<Jurisdiction, Citation>>;
  tags?: readonly string[];
};

export type Answer = {
  questionId: string;
  optionIndex: number;
};

export type ShadeBand = {
  name: string;
  min: number;
  max: number;
};

export type Archetype = {
  id: string;
  name: string;
  shadeAnchor: number;
  axes: AxisVector;
  blurb: string;
};

export type QuizResult = {
  shade: number;
  axes: Record<AxisId, number>;
  band: ShadeBand;
  archetype: Archetype;
  colorCodes: {
    hex: string;
    rgb: string;
    hsl: string;
    oklch: string;
  };
  answered: number;
  total: number;
};
