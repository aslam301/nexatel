export const revalidate = 60;

import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Icon } from "@/components/Icon";
import { getProjects, getSite } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const site = await getSite();
  return buildMetadata({
    title: "Projects",
    description: site.pages.projects.subtitle,
    path: "/projects",
    image: site.pages.projects.image,
  });
}

export default async function ProjectsPage() {
  const [projects, site] = await Promise.all([getProjects(), getSite()]);
  return (
    <>
      <Hero
        eyebrow={site.pages.projects.eyebrow}
        title={site.pages.projects.title}
        subtitle={site.pages.projects.subtitle}
        size="compact"
        showStatus={false}
        backgroundImage={site.pages.projects.image}
      />
      <section className="container-wide py-20 md:py-24 section-glow">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => {
            const inner = (
              <>
                <div className="relative aspect-[16/10] bg-[var(--surface)] overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-6 flex flex-col gap-2 flex-1">
                  <span className="eyebrow">{p.category} / {p.year}</span>
                  <h3 className="text-lg font-semibold text-foreground-strong leading-snug">{p.title}</h3>
                  <p className="text-xs text-muted-2">{p.client}</p>
                  <p className="text-sm text-muted mt-1.5 leading-relaxed line-clamp-3">{p.summary}</p>
                  {p.slug && (
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground-strong group-hover:gap-2.5 transition-all">
                      <span style={{ background: "linear-gradient(90deg, var(--violet), var(--tech))", backgroundClip: "text", color: "transparent" }}>
                        Read case
                      </span>
                      <Icon name="arrow" size={14} className="text-muted group-hover:text-foreground-strong" />
                    </span>
                  )}
                </div>
              </>
            );
            return p.slug ? (
              <Link key={p.id} href={`/projects/${p.slug}`} className="card overflow-hidden flex flex-col group">
                {inner}
              </Link>
            ) : (
              <article key={p.id} className="card overflow-hidden flex flex-col group">
                {inner}
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
