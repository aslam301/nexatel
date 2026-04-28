import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ServiceCard } from "@/components/ServiceCard";
import { ProductCard } from "@/components/ProductCard";
import { Icon } from "@/components/Icon";
import { getCompany, getServices, getProducts, getProjects } from "@/lib/data";

export default async function HomePage() {
  const [company, services, products, projects] = await Promise.all([
    getCompany(),
    getServices(),
    getProducts(),
    getProjects(),
  ]);

  const featuredProducts = products.slice(0, 3);
  const recentProjects = projects.slice(0, 3);

  return (
    <>
      <Hero
        eyebrow="Kerala · Kuwait"
        title="Engineering connections. Powering tomorrow."
        subtitle="Nexatel is a multi-vertical engineering and technology group delivering fiber optics, structured cabling, telecom, IT services and clean-energy installations across the GCC and India."
        primaryCta={{ href: "/services", label: "Explore services" }}
        secondaryCta={{ href: "/contact", label: "Talk to our team" }}
        backgroundImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=2400&q=70&auto=format&fit=crop"
      />

      {/* Stats */}
      <section className="bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="container-wide py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {company.stats.map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <div className="text-3xl md:text-4xl font-bold text-[var(--primary)] tracking-tight">
                {s.value}
              </div>
              <div className="text-xs md:text-sm uppercase tracking-wider text-slate-500 mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="container-wide py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <span className="eyebrow">What we do</span>
            <h2 className="section-title mt-2">Five practices. One trusted partner.</h2>
          </div>
          <p className="lead">
            From the OFC backbone in your basement to the solar panels on your roof,
            our specialised divisions deliver end-to-end execution under a single roof.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      </section>

      {/* About strip */}
      <section className="bg-[var(--surface)]">
        <div className="container-wide py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=70&auto=format&fit=crop"
              alt="Engineers reviewing a structured cabling layout on site"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <span className="eyebrow">Rooted in Kerala. Trusted in Kuwait.</span>
            <h2 className="section-title mt-2">A regional partner with global standards.</h2>
            <p className="lead mt-4">
              For over {company.yearsOfExperience} years, Nexatel has been the quiet engineering
              backbone behind some of the GCC and India&rsquo;s most reliable telecom, IT and
              electrical deployments. We blend Kerala&rsquo;s engineering depth with Kuwait&rsquo;s
              project execution to deliver work that stays standing for decades.
            </p>
            <ul className="mt-6 grid sm:grid-cols-2 gap-3">
              {[
                "Licensed & insured installations",
                "Tier-1 OEM partnerships",
                "BICSI-aligned cabling practices",
                "24x7 maintenance contracts",
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
        </div>
      </section>

      {/* Featured products */}
      <section className="container-wide py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <span className="eyebrow">Catalogue</span>
            <h2 className="section-title mt-2">Featured products</h2>
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
      <section className="bg-[var(--surface)]">
        <div className="container-wide py-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
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
      <section className="container-wide py-20">
        <div className="rounded-2xl hero-gradient text-white p-10 md:p-14 relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-50" aria-hidden />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Have a project on the table?
            </h2>
            <p className="mt-4 text-slate-200/90 text-lg">
              Whether it&rsquo;s a 10 km fiber backbone or a rooftop solar plant, our engineers
              can scope, price and deliver — across Kuwait and Kerala.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-accent">Request a proposal <Icon name="arrow" size={16} /></Link>
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
