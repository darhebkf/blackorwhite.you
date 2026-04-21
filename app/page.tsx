import { BeginChoices } from "@/components/landing/BeginChoices";
import { GrayStrip } from "@/components/landing/GrayStrip";
import { Hero } from "@/components/landing/Hero";
import { SpectrumLegend } from "@/components/landing/SpectrumLegend";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function Home() {
  return (
    <main className="min-h-dvh flex flex-col">
      <SiteHeader section="§ 001 · Landing" />

      <section className="grid grid-cols-12 gap-[var(--gutter)] px-[var(--gutter)] py-[clamp(3rem,7vw,7rem)]">
        <Hero />
        <SpectrumLegend />
      </section>

      <BeginChoices />
      <GrayStrip />

      <SiteFooter mark="§ 001 — Landing" />
    </main>
  );
}
