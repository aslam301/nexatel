import Image from "next/image";
import { Hero } from "@/components/Hero";
import { getProjects } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Projects",
  description:
    "Selected Nexatel projects across fiber optics, structured cabling, telecom infrastructure, IT services and solar energy.",
  path: "/projects",
  image: "https://images.unsplash.com/photo-1545987796-200677ee1011?w=1200&h=630&fit=crop&q=70&auto=format",
});

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <>
      <Hero
        eyebrow="Selected work"
        title="Built. Tested. Trusted."
        subtitle="A short selection of recent Nexatel deployments across Kuwait and Kerala."
        size="compact"
        showStatus={false}
        backgroundImage="https://images.unsplash.com/photo-1545987796-200677ee1011?w=2000&q=70&auto=format&fit=crop"
      />
      <section className="container-wide py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <article key={p.id} className="card overflow-hidden flex flex-col">
              <div className="relative aspect-[16/10] bg-slate-100">
                <Image src={p.image} alt={p.title} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover" />
              </div>
              <div className="p-6 flex flex-col gap-2 flex-1">
                <span className="eyebrow">{p.category} · {p.year}</span>
                <h3 className="text-lg font-semibold text-[var(--primary)] leading-snug">{p.title}</h3>
                <p className="text-xs text-slate-500">{p.client}</p>
                <p className="text-sm text-slate-600 mt-1.5">{p.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
