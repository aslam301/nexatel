"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploadField } from "./ImageUploadField";
import type { Site, HeroSlide, PageHero, CtaLink } from "@/lib/types";

interface Props {
  initial: Site;
}

export function SiteEditor({ initial }: Props) {
  const router = useRouter();
  const [site, setSite] = useState<Site>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function save() {
    setBusy(true);
    setError(null);
    setOk(false);
    try {
      const res = await fetch("/api/admin/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(site),
      });
      const body = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !body.ok) throw new Error(body.error || "Save failed");
      setOk(true);
      router.refresh();
      setTimeout(() => setOk(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  function patch<K extends keyof Site>(key: K, value: Site[K]) {
    setSite((s) => ({ ...s, [key]: value }));
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <HeroSection
        slides={site.hero.slides}
        onChange={(slides) => patch("hero", { slides })}
      />

      <HomeSection
        home={site.home}
        onChange={(home) => patch("home", home)}
      />

      <AboutSection
        about={site.about}
        onChange={(about) => patch("about", about)}
      />

      <ContactSection
        contact={site.contact}
        onChange={(contact) => patch("contact", contact)}
      />

      <PageBackgroundsSection
        pages={site.pages}
        onChange={(pages) => patch("pages", pages)}
      />

      <FooterSection
        footer={site.footer}
        onChange={(footer) => patch("footer", footer)}
      />

      <div className="sticky bottom-0 z-10 -mx-5 md:-mx-8 px-5 md:px-8 py-4 border-t border-[var(--border)] backdrop-blur-md"
        style={{ background: "rgba(10,15,31,0.85)" }}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            {error && <span className="text-sm text-red-300">{error}</span>}
            {ok && <span className="text-sm text-emerald-300">Saved.</span>}
          </div>
          <button onClick={save} disabled={busy} className="btn-primary">
            {busy ? "Saving…" : "Save all site content"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────── Building blocks ───────────────────────────

function Section({
  title,
  description,
  children,
  defaultOpen = false,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
        aria-expanded={open}
      >
        <div>
          <h2 className="text-base md:text-lg font-semibold text-white">{title}</h2>
          {description && <p className="text-sm text-slate-400 mt-0.5">{description}</p>}
        </div>
        <span className="text-slate-400 text-2xl leading-none">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="px-6 pb-6 space-y-5 border-t border-[var(--border)] pt-5">{children}</div>}
    </div>
  );
}

function Field({ label, helper, children }: { label: string; helper?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {helper && <p className="text-xs text-slate-500 mt-1.5">{helper}</p>}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <input
      type="text"
      className="input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
    />
  );
}

function TextArea({
  value,
  onChange,
  rows = 4,
  maxLength,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  maxLength?: number;
}) {
  return (
    <textarea
      className="textarea"
      rows={rows}
      maxLength={maxLength}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function ImageField({
  value,
  onChange,
  scope,
  slugHint,
  label = "Image",
}: {
  value: string;
  onChange: (v: string) => void;
  scope: "services" | "products" | "projects" | "misc";
  slugHint?: string;
  label?: string;
}) {
  // The ImageUploadField writes into a named hidden text input. We use a
  // unique name per slot and read the value back via an uncontrolled-style
  // wrapper: pass `defaultValue` and watch DOM changes.
  return (
    <ImageUploadField
      name={`__${scope}-${slugHint ?? Math.random().toString(36).slice(2)}`}
      defaultValue={value}
      scope={scope}
      slugHint={slugHint}
      label={label}
      onChangeValue={onChange}
    />
  );
}

// ─────────────────────────── Hero section ───────────────────────────

function HeroSection({
  slides,
  onChange,
}: {
  slides: HeroSlide[];
  onChange: (s: HeroSlide[]) => void;
}) {
  function update(idx: number, next: HeroSlide) {
    onChange(slides.map((s, i) => (i === idx ? next : s)));
  }
  function add() {
    onChange([
      ...slides,
      {
        eyebrow: "New slide",
        title: "Add a title",
        subtitle: "Add a subtitle",
        image: "",
        primaryCta: { label: "Talk to us", href: "/contact" },
        secondaryCta: undefined,
      },
    ]);
  }
  function remove(idx: number) {
    if (!confirm("Remove this slide?")) return;
    onChange(slides.filter((_, i) => i !== idx));
  }
  function move(idx: number, delta: -1 | 1) {
    const target = idx + delta;
    if (target < 0 || target >= slides.length) return;
    const copy = [...slides];
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    onChange(copy);
  }

  return (
    <Section
      title="Hero carousel"
      description={`${slides.length} slide(s) auto-rotating on the homepage every 6 seconds`}
      defaultOpen
    >
      <div className="space-y-5">
        {slides.map((slide, idx) => (
          <div key={idx} className="rounded-xl border border-[var(--border)] p-5 space-y-4" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs font-mono uppercase tracking-[0.16em] text-slate-400">Slide {idx + 1}</div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => move(idx, -1)} disabled={idx === 0} className="text-xs text-slate-400 hover:text-white disabled:opacity-30 px-2 py-1">↑</button>
                <button type="button" onClick={() => move(idx, 1)} disabled={idx === slides.length - 1} className="text-xs text-slate-400 hover:text-white disabled:opacity-30 px-2 py-1">↓</button>
                <button type="button" onClick={() => remove(idx)} className="text-xs text-red-300 hover:text-red-200 px-2 py-1">Remove</button>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Eyebrow"><TextInput value={slide.eyebrow ?? ""} onChange={(v) => update(idx, { ...slide, eyebrow: v })} maxLength={80} /></Field>
              <Field label="Title *"><TextInput value={slide.title} onChange={(v) => update(idx, { ...slide, title: v })} maxLength={200} /></Field>
            </div>
            <Field label="Subtitle *"><TextArea value={slide.subtitle} onChange={(v) => update(idx, { ...slide, subtitle: v })} rows={3} maxLength={600} /></Field>
            <ImageField
              value={slide.image}
              onChange={(v) => update(idx, { ...slide, image: v })}
              scope="misc"
              slugHint={`hero-${idx + 1}`}
              label="Background image"
            />
            <CtaInline label="Primary CTA" value={slide.primaryCta} onChange={(v) => update(idx, { ...slide, primaryCta: v })} />
            <CtaInline label="Secondary CTA" value={slide.secondaryCta} onChange={(v) => update(idx, { ...slide, secondaryCta: v })} />
          </div>
        ))}
        <button type="button" onClick={add} className="btn-outline w-full justify-center">+ Add hero slide</button>
      </div>
    </Section>
  );
}

function CtaInline({ label, value, onChange }: { label: string; value?: CtaLink; onChange: (v?: CtaLink) => void }) {
  const enabled = !!value;
  return (
    <div className="rounded-lg border border-[var(--border)] p-3">
      <label className="flex items-center justify-between cursor-pointer">
        <span className="text-sm font-semibold text-white">{label}</span>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onChange(e.target.checked ? { label: "Click here", href: "/" } : undefined)}
        />
      </label>
      {enabled && value && (
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <TextInput value={value.label} onChange={(v) => onChange({ ...value, label: v })} placeholder="Button label" maxLength={60} />
          <TextInput value={value.href} onChange={(v) => onChange({ ...value, href: v })} placeholder="/services or https://…" />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────── Home section ───────────────────────────

function HomeSection({ home, onChange }: { home: Site["home"]; onChange: (h: Site["home"]) => void }) {
  return (
    <Section title="Home page sections" description="What we do block and the bottom CTA panel">
      <div className="space-y-6">
        <div>
          <div className="text-sm font-semibold text-white mb-3">What we do</div>
          <div className="space-y-3">
            <Field label="Eyebrow"><TextInput value={home.whatWeDo.eyebrow} onChange={(v) => onChange({ ...home, whatWeDo: { ...home.whatWeDo, eyebrow: v } })} maxLength={80} /></Field>
            <Field label="Title"><TextInput value={home.whatWeDo.title} onChange={(v) => onChange({ ...home, whatWeDo: { ...home.whatWeDo, title: v } })} maxLength={200} /></Field>
            <Field label="Lead paragraph"><TextArea value={home.whatWeDo.lead} onChange={(v) => onChange({ ...home, whatWeDo: { ...home.whatWeDo, lead: v } })} rows={3} maxLength={1000} /></Field>
            <Field label="Body paragraph"><TextArea value={home.whatWeDo.body} onChange={(v) => onChange({ ...home, whatWeDo: { ...home.whatWeDo, body: v } })} rows={4} maxLength={4000} /></Field>
            <ImageField value={home.whatWeDo.image} onChange={(v) => onChange({ ...home, whatWeDo: { ...home.whatWeDo, image: v } })} scope="misc" slugHint="home-whatwedo" label="Image" />
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-5">
          <div className="text-sm font-semibold text-white mb-3">Bottom CTA panel</div>
          <div className="space-y-3">
            <Field label="Title"><TextInput value={home.cta.title} onChange={(v) => onChange({ ...home, cta: { ...home.cta, title: v } })} maxLength={200} /></Field>
            <Field label="Body"><TextArea value={home.cta.body} onChange={(v) => onChange({ ...home, cta: { ...home.cta, body: v } })} rows={3} maxLength={1000} /></Field>
            <Field label="Button label"><TextInput value={home.cta.primaryLabel} onChange={(v) => onChange({ ...home, cta: { ...home.cta, primaryLabel: v } })} maxLength={60} /></Field>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─────────────────────────── About section ───────────────────────────

function AboutSection({ about, onChange }: { about: Site["about"]; onChange: (a: Site["about"]) => void }) {
  return (
    <Section title="About page" description="Hero, main body and bottom CTA">
      <div className="space-y-6">
        <div>
          <div className="text-sm font-semibold text-white mb-3">Hero</div>
          <PageHeroFields
            value={about.hero}
            onChange={(hero) => onChange({ ...about, hero })}
            scope="misc"
            slugHint="about-hero"
          />
        </div>

        <div className="border-t border-[var(--border)] pt-5">
          <div className="text-sm font-semibold text-white mb-3">Main body</div>
          <div className="space-y-3">
            <Field label="Eyebrow"><TextInput value={about.body.eyebrow} onChange={(v) => onChange({ ...about, body: { ...about.body, eyebrow: v } })} maxLength={80} /></Field>
            <Field label="Title"><TextInput value={about.body.title} onChange={(v) => onChange({ ...about, body: { ...about.body, title: v } })} maxLength={200} /></Field>
            <ParagraphsEditor
              paragraphs={about.body.paragraphs}
              onChange={(paragraphs) => onChange({ ...about, body: { ...about.body, paragraphs } })}
            />
            <ImageField value={about.body.image} onChange={(v) => onChange({ ...about, body: { ...about.body, image: v } })} scope="misc" slugHint="about-body" label="Image" />
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-5">
          <div className="text-sm font-semibold text-white mb-3">Bottom CTA</div>
          <div className="space-y-3">
            <Field label="Title"><TextInput value={about.cta.title} onChange={(v) => onChange({ ...about, cta: { ...about.cta, title: v } })} maxLength={200} /></Field>
            <Field label="Body"><TextArea value={about.cta.body} onChange={(v) => onChange({ ...about, cta: { ...about.cta, body: v } })} rows={3} maxLength={1000} /></Field>
            <Field label="Button label"><TextInput value={about.cta.primaryLabel} onChange={(v) => onChange({ ...about, cta: { ...about.cta, primaryLabel: v } })} maxLength={60} /></Field>
          </div>
        </div>
      </div>
    </Section>
  );
}

function ParagraphsEditor({ paragraphs, onChange }: { paragraphs: string[]; onChange: (p: string[]) => void }) {
  return (
    <div className="space-y-3">
      <label className="label">Paragraphs</label>
      {paragraphs.map((p, i) => (
        <div key={i} className="flex gap-2">
          <TextArea value={p} onChange={(v) => onChange(paragraphs.map((x, j) => (j === i ? v : x)))} rows={3} maxLength={4000} />
          <button type="button" onClick={() => onChange(paragraphs.filter((_, j) => j !== i))} className="text-xs text-red-300 hover:text-red-200 self-start px-2 py-1">Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...paragraphs, ""])} className="btn-outline">+ Add paragraph</button>
    </div>
  );
}

// ─────────────────────────── Contact section ───────────────────────────

function ContactSection({ contact, onChange }: { contact: Site["contact"]; onChange: (c: Site["contact"]) => void }) {
  return (
    <Section title="Contact page" description="Hero and the headings around the form">
      <div className="space-y-6">
        <div>
          <div className="text-sm font-semibold text-white mb-3">Hero</div>
          <PageHeroFields value={contact.hero} onChange={(hero) => onChange({ ...contact, hero })} scope="misc" slugHint="contact-hero" />
        </div>
        <div className="border-t border-[var(--border)] pt-5">
          <div className="text-sm font-semibold text-white mb-3">Page intro copy</div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Reach heading"><TextInput value={contact.intro.reachHeading} onChange={(v) => onChange({ ...contact, intro: { ...contact.intro, reachHeading: v } })} maxLength={120} /></Field>
            <Field label="Reach subheading"><TextInput value={contact.intro.reachSubheading} onChange={(v) => onChange({ ...contact, intro: { ...contact.intro, reachSubheading: v } })} maxLength={240} /></Field>
            <Field label="Form heading"><TextInput value={contact.intro.formHeading} onChange={(v) => onChange({ ...contact, intro: { ...contact.intro, formHeading: v } })} maxLength={120} /></Field>
            <Field label="Form subheading"><TextInput value={contact.intro.formSubheading} onChange={(v) => onChange({ ...contact, intro: { ...contact.intro, formSubheading: v } })} maxLength={240} /></Field>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─────────────────────────── Inner page backgrounds ───────────────────────────

function PageBackgroundsSection({ pages, onChange }: { pages: Site["pages"]; onChange: (p: Site["pages"]) => void }) {
  return (
    <Section title="Inner page heroes" description="Hero copy and background image for /services, /products and /projects">
      <div className="space-y-6">
        {(["services", "products", "projects"] as const).map((key) => (
          <div key={key} className="border-t border-[var(--border)] first:border-t-0 first:pt-0 pt-5">
            <div className="text-sm font-semibold text-white mb-3 capitalize">{key} page</div>
            <PageHeroFields
              value={pages[key]}
              onChange={(hero) => onChange({ ...pages, [key]: hero })}
              scope="misc"
              slugHint={`${key}-hero`}
            />
          </div>
        ))}
      </div>
    </Section>
  );
}

function PageHeroFields({
  value,
  onChange,
  scope,
  slugHint,
}: {
  value: PageHero;
  onChange: (h: PageHero) => void;
  scope: "services" | "products" | "projects" | "misc";
  slugHint: string;
}) {
  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Eyebrow"><TextInput value={value.eyebrow ?? ""} onChange={(v) => onChange({ ...value, eyebrow: v })} maxLength={80} /></Field>
        <Field label="Title"><TextInput value={value.title} onChange={(v) => onChange({ ...value, title: v })} maxLength={200} /></Field>
      </div>
      <Field label="Subtitle"><TextArea value={value.subtitle} onChange={(v) => onChange({ ...value, subtitle: v })} rows={2} maxLength={600} /></Field>
      <ImageField value={value.image} onChange={(v) => onChange({ ...value, image: v })} scope={scope} slugHint={slugHint} label="Background image" />
    </div>
  );
}

// ─────────────────────────── Footer ───────────────────────────

function FooterSection({ footer, onChange }: { footer: Site["footer"]; onChange: (f: Site["footer"]) => void }) {
  return (
    <Section title="Footer" description="Column headings and copyright suffix">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Column 1 heading"><TextInput value={footer.companyHeading} onChange={(v) => onChange({ ...footer, companyHeading: v })} maxLength={60} /></Field>
        <Field label="Column 2 heading"><TextInput value={footer.verticalsHeading} onChange={(v) => onChange({ ...footer, verticalsHeading: v })} maxLength={60} /></Field>
        <Field label="Column 3 heading"><TextInput value={footer.officeHeading} onChange={(v) => onChange({ ...footer, officeHeading: v })} maxLength={60} /></Field>
        <Field label="Copyright suffix" helper={'Shown after "© 2026 Nexatel Private Limited."'}><TextInput value={footer.copyrightSuffix} onChange={(v) => onChange({ ...footer, copyrightSuffix: v })} maxLength={240} /></Field>
      </div>
    </Section>
  );
}
