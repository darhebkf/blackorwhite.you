type SiteHeaderProps = {
  section?: string;
};

export function SiteHeader({ section = "№ I" }: SiteHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-6 px-[var(--gutter)] py-5 hairline-bot">
      <a href="/" className="eyebrow">
        blackorwhite.you
      </a>
      <span className="eyebrow mono-nums hidden sm:inline">{section}</span>
      <span className="eyebrow mono-nums">NL · MMXXVI</span>
    </header>
  );
}
