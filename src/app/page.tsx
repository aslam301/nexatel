import Image from "next/image";
import Link from "next/link";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ServiceCard } from "@/components/ServiceCard";
import { ProductCard } from "@/components/ProductCard";
import { MissionVisionValues } from "@/components/MissionVisionValues";
import { AreasOfFocus } from "@/components/AreasOfFocus";
import { PartnerStrip } from "@/components/PartnerStrip";
import { Icon } from "@/components/Icon";
import { getCompany, getServices, getProducts, getProjects, getSite } from "@/lib/data";

export default async function HomePage() {
  const [company, site, services, products, projects] = await Promise.all([
    getCompany(),
    getSite(),
    getServices(),
    getProducts(),
    getProjects(),
  ]);

  const featuredServices = services.filter((s) => s.featured !== false);
  const featuredProducts = products.filter((p) => p.featured).slice(0, 6);
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <>
      <HeroCarousel slides={site.hero.slides} intervalMs={6000} />

      {/* Mission / Vision / Values */}
      <section className="container-wide py-20 md:py-24 section-glow">
        <div className="max-w-2xl mb-10 md:mb-14">
          <span className="eyebrow">Who we are</span>
          <h2 className="section-title mt-3">A telecom and IT partner built for the long projects.</h2>
        </div>
        <MissionVisionValues company={company} />
      </section>

      {/* What we do / About strip */}
      <section className="border-y border-[var(--border)] section-glow" style={{ background: "var(--background-2)" }}>
        <div className="container-wide py-20 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-[var(--border-strong)]">
            <Image
              src={site.home.whatWeDo.image}
              alt="Nexatel project work"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <span className="eyebrow">{site.home.whatWeDo.eyebrow}</span>
            <h2 className="section-title mt-3">{site.home.whatWeDo.title}</h2>
            <p className="lead mt-5">{site.home.whatWeDo.lead}</p>
            <p className="text-muted mt-4 leading-relaxed">{site.home.whatWeDo.body}</p>
            <div className="mt-7 flex gap-3">
              <Link href="/about" className="btn-primary">About Nexatel <Icon name="arrow" size={16} /></Link>
              <Link href="/projects" className="btn-outline">See our work</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container-wide py-24 md:py-28 section-glow">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <div className="max-w-2xl">
            <span className="eyebrow">What we deliver</span>
            <h2 className="section-title mt-3">Five practices. One team on site.</h2>
          </div>
          <p className="lead">
            From a 24 port patch panel in the rack to a 10 km fibre span on the highway, our crews deliver every piece of the network we install.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      </section>

      {/* Areas of focus */}
      <section className="border-y border-[var(--border)]" style={{ background: "var(--background-2)" }}>
        <div className="container-wide py-24 md:py-28">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
            <div className="max-w-2xl">
              <span className="eyebrow">Who we work with</span>
              <h2 className="section-title mt-3">Built for the sectors that cannot afford downtime.</h2>
            </div>
          </div>
          <AreasOfFocus areas={company.areasOfFocus} />
        </div>
      </section>

      {company.partner && (
        <section className="py-24 md:py-28">
          <PartnerStrip partner={company.partner} />
        </section>
      )}

      {featuredProducts.length > 0 && (
        <section className="border-y border-[var(--border)]" style={{ background: "var(--background-2)" }}>
          <div className="container-wide py-24 md:py-28">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
              <div>
                <span className="eyebrow">Catalogue</span>
                <h2 className="section-title mt-3">Featured products</h2>
              </div>
              <Link href="/products" className="btn-outline w-fit">View all products</Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {featuredProjects.length > 0 && (
        <section className="container-wide py-24 md:py-28">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
            <div>
              <span className="eyebrow">Selected work</span>
              <h2 className="section-title mt-3">Recent projects</h2>
            </div>
            <Link href="/projects" className="btn-outline w-fit">All projects</Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((p) => (
              <article key={p.id} className="card overflow-hidden group">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-6 flex flex-col gap-2">
                  <span className="text-xs font-mono uppercase tracking-[0.16em] text-muted-2">
                    {p.category} / {p.year}
                  </span>
                  <h3 className="text-base font-semibold text-foreground-strong mt-1 leading-snug">{p.title}</h3>
                  <p className="text-xs text-muted-2">{p.client}</p>
                  <p className="text-sm text-muted mt-2 line-clamp-2 leading-relaxed">{p.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-wide pb-28">
        <div
          className="rounded-2xl text-foreground-strong p-10 md:p-16 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.06) 0%, var(--background-2) 50%, rgba(6,182,212,0.06) 100%)",
            border: "1px solid var(--border-strong)",
          }}
        >
          <div className="absolute inset-0 grid-pattern opacity-40" aria-hidden />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.1]">
              {site.home.cta.title}
            </h2>
            <p className="mt-5 text-muted text-lg leading-relaxed">{site.home.cta.body}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">{site.home.cta.primaryLabel} <Icon name="arrow" size={16} /></Link>
              <a href={`mailto:${company.supportEmail}`} className="btn-outline">
                <Icon name="mail" size={16} /> {company.supportEmail}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
