import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { getProjects, getProjectBySlug, getSettings } from "@/lib/data";
import { buildMetadata, resolveDescription, resolveOgImage } from "@/lib/seo";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.filter((p) => p.slug).map((p) => ({ slug: p.slug! }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, settings] = await Promise.all([getProjectBySlug(slug), getSettings()]);
  if (!project) return buildMetadata({ title: "Project", description: "Nexatel project", path: `/projects/${slug}` });
  const description = resolveDescription(undefined, project.description, project.summary, settings);
  const ogImage = resolveOgImage(undefined, project.image, settings);
  return buildMetadata({
    title: project.title,
    description,
    path: `/projects/${slug}`,
    image: ogImage ? { url: ogImage, alt: project.title } : undefined,
    ogType: "article",
  });
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  return (
    <>
      <section className="hero-gradient relative overflow-hidden">
        <div className="container-wide relative py-20 md:py-24">
          <div className="mb-6">
            <Link href="/projects" className="text-sm text-muted hover:text-foreground-strong inline-flex items-center gap-1 transition-colors">
              ← All projects
            </Link>
          </div>
          <span className="eyebrow">{project.category} / {project.year}</span>
          <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] max-w-3xl leading-[1.05] text-foreground-strong">
            {project.title}
          </h1>
          <p className="mt-3 text-muted-2 text-sm font-mono">{project.client}</p>
          <p className="mt-5 text-lg text-muted max-w-2xl leading-relaxed">{project.summary}</p>
        </div>
      </section>

      <section className="container-wide py-16 md:py-20 grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3 space-y-5">
          <h2 className="text-2xl font-semibold text-foreground-strong tracking-tight">About the project</h2>
          <p className="lead">{project.description || project.summary}</p>
          <div className="pt-4 flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary">Have a similar project? <Icon name="arrow" size={16} /></Link>
            <Link href="/projects" className="btn-outline">More projects</Link>
          </div>
        </div>
        <div className="lg:col-span-2 relative aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-[var(--border-strong)]">
          <Image src={project.image} alt={project.title} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
        </div>
      </section>
    </>
  );
}
