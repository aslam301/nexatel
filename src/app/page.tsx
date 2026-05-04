import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ServiceCard } from "@/components/ServiceCard";
import { ProductCard } from "@/components/ProductCard";
import { CapabilityCard } from "@/components/CapabilityCard";
import { StatCounter } from "@/components/StatCounter";
import { PartnerStrip } from "@/components/PartnerStrip";
import { Icon } from "@/components/Icon";
import { getCompany, getServices, getCapabilities, getProducts, getProjects } from "@/lib/data";

export default async function HomePage() {
  const [company, services, capabilities, products, projects] = await Promise.all([
    getCompany(),
    getServices(),
    getCapabilities(),
    getProducts(),
    getProjects(),
  ]);

  const featuredProducts = products.slice(0, 3);
  const recentProjects = projects.slice(0, 3);

  return (
    <>
      <Hero
        title="Engineering India's connected future."
        subtitle="Nexatel Private Limited builds and maintains telecom infrastructure across India — fiber optic, network cabling, CCTV and IT hardware — led by 25+ years of fiber engineering leadership."
        primaryCta={{ href: "/services", label: "Explore services" }}
        secondaryCta={{ href: "/capabilities", label: "Our capabilities" }}
        backgroundImage="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=2400&q=75&auto=format&fit=crop"
        statusText="Live · Kerala, IN"
      />

      {/* Animated stats */}
      <section className="bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="container-wide py-12 md:py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
          {company.stats.map((s) => (
            <StatCounter key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="container-wide py-20 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div className="max-w-2xl">
            <span className="eyebrow">What we do</span>
            <h2 className="section-title mt-2">Five practices. One trusted partner.</h2>
          </div>
          <p className="lead">
            From Optical Fiber Cable on the highway to a 24-port patch panel in the rack,
            our specialised teams deliver the full stack of telecom and IT infrastructure.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      </section>

      {/* Capabilities bento */}
      <section className="bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="container-wide py-20 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div className="max-w-2xl">
              <span className="eyebrow">Field capabilities</span>
              <h2 className="section-title mt-2">The work that makes the network real.</h2>
            </div>
            <Link href="/capabilities" className="btn-outline w-fit">
              All capabilities <Icon name="arrow" size={16} />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c) => (
              <CapabilityCard key={c.slug} capability={c} />
            ))}
          </div>
        </div>
      </section>

      {/* About strip */}
      <section className="container-wide py-20 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-[var(--border)] shadow-[0_30px_60px_-40px_rgba(10,37,64,0.35)]">
          <Image
            src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=70&auto=format&fit=crop"
            alt="Fiber-optic splicing in progress on a Nexatel project site"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <span className="eyebrow">Headquartered in Kerala</span>
          <h2 className="section-title mt-2">A telecom partner with 25+ years of fiber depth.</h2>
          <p className="lead mt-4">
            {company.mission}
          </p>
          <ul className="mt-6 grid sm:grid-cols-2 gap-3">
            {[
              "500+ km Optical Fiber Cable laid",
              "500+ km Right-of-Way managed",
              "OTDR & OPM-certified deliveries",
              "BMBC & interlocking road restoration",
            ].map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-[var(--accent-strong)] mt-0.5"><Icon name="check" size={18} /></span>
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex gap-3">
            <Link href="/about" className="btn-primary">About Nexatel <Icon name="arrow" size={16} /></Link>
            <Link href="/projects" className="btn-outline">See our work</Link>
          </div>
        </div>
      </section>

      {/* Fanr partnership */}
      {company.partner && (
        <section className="pb-20 md:pb-24">
          <PartnerStrip partner={company.partner} />
        </section>
      )}

      {/* Featured products */}
      <section className="container-wide py-20 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="eyebrow">Catalogue</span>
            <h2 className="section-title mt-2">Featured fiber-optic products</h2>
          </div>
          <Link href="/products" className="btn-outline w-fit">View all products</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Projects strip */}
      <section className="bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="container-wide py-20 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span className="eyebrow">Selected work</span>
              <h2 className="section-title mt-2">Recent projects</h2>
            </div>
            <Link href="/projects" className="btn-outline w-fit">All projects</Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recentProjects.map((p) => (
              <article key={p.id} className="card overflow-hidden">
                <div className="relative aspect-[16/10] bg-slate-100">
                  <Image src={p.image} alt={p.title} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover" />
                </div>
                <div className="p-5">
                  <span className="eyebrow">{p.category} · {p.year}</span>
                  <h3 className="text-base font-semibold text-[var(--primary)] mt-2 leading-snug">{p.title}</h3>
                  <p className="text-sm text-slate-600 mt-1.5 line-clamp-2">{p.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-wide py-20 md:py-24">
        <div className="rounded-2xl hero-gradient text-white p-10 md:p-14 relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-50" aria-hidden />
          <div
            className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full opacity-50 blur-3xl"
            aria-hidden
            style={{ background: "radial-gradient(closest-side, rgba(6,182,212,0.45), transparent)" }}
          />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Have a project on the table?
            </h2>
            <p className="mt-4 text-slate-200/90 text-lg">
              Whether it&rsquo;s a 10 km NLD fiber span, a campus FTTH rollout or a 200-camera CCTV
              deployment, our engineers can scope, price and deliver — across India.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/get-quote" className="btn-accent">Request a proposal <Icon name="arrow" size={16} /></Link>
              <a href={`mailto:${company.supportEmail}`} className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
                <Icon name="mail" size={16} /> {company.supportEmail}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
