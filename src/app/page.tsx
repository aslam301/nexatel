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

      {/* Animated stats — divider style */}
      <section className="container-wide -mt-10 md:-mt-14 relative z-10">
        <div
          className="relative overflow-hidden rounded-2xl border border-[var(--border-strong)] backdrop-blur-md"
          style={{ background: "rgba(15, 23, 42, 0.65)" }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            aria-hidden
            style={{
              background:
                "radial-gradient(600px 200px at 50% 0%, rgba(124,58,237,0.18), transparent 60%)",
            }}
          />
          <div className="relative grid grid-cols-2 md:grid-cols-4 divide-x divide-[var(--border)] py-6 md:py-8">
            {company.stats.map((s) => (
              <div key={s.label} className="px-6 md:px-8">
                <StatCounter value={s.value} label={s.label} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container-wide py-24 md:py-28 section-glow">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <div className="max-w-2xl">
            <span className="eyebrow">What we do</span>
            <h2 className="section-title mt-3">Five practices. <span style={{ background: "linear-gradient(90deg, #a78bfa, #67e8f9)", backgroundClip: "text", color: "transparent" }}>One trusted partner.</span></h2>
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
      <section className="border-y border-[var(--border)] section-glow" style={{ background: "var(--background-2)" }}>
        <div className="container-wide py-24 md:py-28">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
            <div className="max-w-2xl">
              <span className="eyebrow">Field capabilities</span>
              <h2 className="section-title mt-3">The work that makes the network real.</h2>
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
      <section className="container-wide py-24 md:py-28 grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-[var(--border-strong)]">
          <Image
            src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=70&auto=format&fit=crop"
            alt="Fiber-optic splicing in progress on a Nexatel project site"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            aria-hidden
            style={{ background: "linear-gradient(180deg, transparent 50%, rgba(5,8,22,0.45))" }}
          />
        </div>
        <div>
          <span className="eyebrow">Headquartered in Kerala</span>
          <h2 className="section-title mt-3">A telecom partner with 25+ years of fiber depth.</h2>
          <p className="lead mt-5">
            {company.mission}
          </p>
          <ul className="mt-7 grid sm:grid-cols-2 gap-3">
            {[
              "500+ km Optical Fiber Cable laid",
              "500+ km Right-of-Way managed",
              "OTDR & OPM-certified deliveries",
              "BMBC & interlocking road restoration",
            ].map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm text-slate-300">
                <span className="mt-0.5" style={{ color: "var(--tech)" }}><Icon name="check" size={18} /></span>
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-9 flex gap-3">
            <Link href="/about" className="btn-primary">About Nexatel <Icon name="arrow" size={16} /></Link>
            <Link href="/projects" className="btn-outline">See our work</Link>
          </div>
        </div>
      </section>

      {/* Fanr partnership */}
      {company.partner && (
        <section className="pb-24">
          <PartnerStrip partner={company.partner} />
        </section>
      )}

      {/* Featured products */}
      <section className="border-y border-[var(--border)]" style={{ background: "var(--background-2)" }}>
        <div className="container-wide py-24 md:py-28">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
            <div>
              <span className="eyebrow">Catalogue</span>
              <h2 className="section-title mt-3">Featured fiber-optic products</h2>
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

      {/* Projects strip */}
      <section className="container-wide py-24 md:py-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <div>
            <span className="eyebrow">Selected work</span>
            <h2 className="section-title mt-3">Recent projects</h2>
          </div>
          <Link href="/projects" className="btn-outline w-fit">All projects</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recentProjects.map((p) => (
            <article key={p.id} className="card overflow-hidden">
              <div className="relative aspect-[16/10] bg-[var(--surface)]">
                <Image src={p.image} alt={p.title} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover" />
                <div
                  className="absolute inset-0"
                  aria-hidden
                  style={{ background: "linear-gradient(180deg, transparent 50%, rgba(5,8,22,0.55))" }}
                />
              </div>
              <div className="p-6">
                <span className="eyebrow">{p.category} · {p.year}</span>
                <h3 className="text-base font-semibold text-white mt-3 leading-snug">{p.title}</h3>
                <p className="text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">{p.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-wide pb-28">
        <div
          className="rounded-2xl text-white p-10 md:p-16 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.20) 0%, rgba(15,23,42,1) 50%, rgba(6,182,212,0.18) 100%)",
            border: "1px solid var(--border-strong)",
          }}
        >
          <div className="absolute inset-0 grid-pattern opacity-30" aria-hidden />
          <div
            className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full opacity-60 blur-3xl"
            aria-hidden
            style={{ background: "radial-gradient(closest-side, rgba(124,58,237,0.45), transparent)" }}
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full opacity-40 blur-3xl"
            aria-hidden
            style={{ background: "radial-gradient(closest-side, rgba(6,182,212,0.40), transparent)" }}
          />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.1]">
              Have a project on the table?
            </h2>
            <p className="mt-5 text-slate-300 text-lg leading-relaxed">
              Whether it&rsquo;s a 10 km NLD fiber span, a campus FTTH rollout or a 200-camera CCTV
              deployment, our engineers can scope, price and deliver — across India.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">Request a proposal <Icon name="arrow" size={16} /></Link>
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
