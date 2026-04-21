import { Marquee } from "@/components/ui/Marquee";

const TOPICS: readonly string[] = [
  "tax workarounds",
  "weed",
  "speeding",
  "civil disobedience",
  "piracy",
  "white lies",
  "self-defense",
  "hate speech",
  "whistleblowing",
  "protest",
  "sex work",
  "insider trading",
  "squatting",
  "vigilantism",
  "draft dodging",
  "tomorrow's laws judged today",
] as const;

export function GrayStrip() {
  return (
    <div className="hairline-bot py-5">
      <Marquee speed={40} gap={40} ariaLabel="Sample topics from the gray area">
        {TOPICS.map((topic) => (
          <span key={topic} className="eyebrow flex items-center gap-10">
            <span>{topic}</span>
            <span aria-hidden style={{ opacity: 0.4 }}>
              ·
            </span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
