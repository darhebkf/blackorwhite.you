import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ResultCard } from "@/components/result/ResultCard";
import { ShadeReflector } from "@/components/result/ShadeReflector";
import { SharedActions } from "@/components/result/SharedActions";
import { decodeResult } from "@/lib/share";

type SharedResultPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: SharedResultPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = decodeResult(slug);
  if (!result) return { title: "Shared result · blackorwhite.you" };
  return {
    title: `Shade ${String(result.shade).padStart(2, "0")} · ${result.archetype.name} · blackorwhite.you`,
    description: `${result.archetype.name} (${result.band.name}). Take yours.`,
  };
}

export default async function SharedResultPage({
  params,
}: SharedResultPageProps) {
  const { slug } = await params;
  const result = decodeResult(slug);
  if (!result) notFound();

  return (
    <main className="min-h-dvh flex flex-col">
      <SiteHeader section="§ R · Shared" />
      <ShadeReflector shade={result.shade} />
      <ResultCard
        result={result}
        section="§ R · Shared result"
        originLabel="Not yours · take one"
        actions={<SharedActions />}
      />
      <SiteFooter mark="§ R · Shared" />
    </main>
  );
}
