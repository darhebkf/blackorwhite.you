type SiteFooterProps = {
  mark: string;
};

export function SiteFooter({ mark }: SiteFooterProps) {
  return (
    <footer className="flex items-center justify-between gap-6 px-[var(--gutter)] py-5 eyebrow">
      <span>{mark}</span>
      <span
        className="hidden md:inline italic-accent"
        style={{
          letterSpacing: 0,
          textTransform: "none",
          fontSize: "var(--step--1)",
        }}
      >
        Unofficial · for amusement · not legal advice
      </span>
      <span className="mono-nums">MMXXVI</span>
    </footer>
  );
}
