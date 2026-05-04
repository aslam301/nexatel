import Link from "next/link";
import { Hero } from "@/components/Hero";
import { CapabilityCard } from "@/components/CapabilityCard";
import { Icon } from "@/components/Icon";
import { getCapabilities } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Capabilities",
  description:
    "Field capabilities behind every Nexatel project — Horizontal Directional Drilling, manual trenching, manhole installation, DIT testing, fiber cable blowing and splicing & termination.",
  path: "/capabilities",
  image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&h=630&fit=crop&q=70&auto=format",
  keywords: [
    "HDD horizontal directional drilling India",
    "manual trenching fiber",
    "manhole installation telecom",
    "DIT testing pressure shuttle sponge",
    "fiber cable blowing service",
    "fiber splicing termination Kerala",
  ],
});

export default async function CapabilitiesPage() {
  const capabilities = await getCapabilities();
  return (
    <>
      <Hero
        eyebrow="Capabilities"
        title="The work that makes the network real."
        subtitle="From trenchless drilling under highways to fusion-spliced fiber inside an FTTH FAT — these are the field capabilities our crews execute every day."
        size="compact"
        showStatus={false}
        backgroundImage="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=2000&q=75&auto=format&fit=crop"
      />
      <section className="container-wide py-20 md:py-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c) => (
            <CapabilityCard key={c.slug} capability={c} />
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="max-w-2xl">
            <span className="eyebrow">Bigger picture</span>
            <h2 className="text-xl md:text-2xl font-semibold text-[var(--primary)] mt-2 tracking-tight">
              See how capabilities roll up into our service practices.
            </h2>
            <p className="text-slate-600 mt-2 text-[15px]">
              Each capability sits inside one of our five service pillars — fiber optic projects,
              telecom infrastructure, network cabling, CCTV systems and IT hardware supply.
            </p>
          </div>
          <Link href="/services" className="btn-primary self-start md:self-auto">
            View services <Icon name="arrow" size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
