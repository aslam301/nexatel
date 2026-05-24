import type {
  Product,
  Service,
  Project,
  Site,
  Company,
  HeroSlide,
  PageHero,
  CtaLink,
  Office,
  ValuePillar,
  FocusArea,
} from "./types";

export type Issue = { field: string; message: string };

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const URL_OR_PATH = /^(?:https?:\/\/|\/)/i;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function str(value: unknown, max = 500): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function strArr(value: unknown, maxItems = 20, maxLen = 200): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim().slice(0, maxLen))
    .filter(Boolean)
    .slice(0, maxItems);
}

function bool(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value === "true" || value === "on" || value === "1";
  return false;
}

// ─────────────────────────── Products ───────────────────────────

export interface ProductInput {
  id?: string;
  slug?: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  features: string[];
  image: string;
  datasheetUrl?: string;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
}

export function validateProductInput(raw: unknown): {
  ok: true;
  value: ProductInput;
} | { ok: false; issues: Issue[] } {
  const issues: Issue[] = [];
  const data = (raw ?? {}) as Record<string, unknown>;

  const name = str(data.name, 120);
  if (!name) issues.push({ field: "name", message: "Name is required" });

  const category = str(data.category, 80);
  if (!category) issues.push({ field: "category", message: "Category is required" });

  const shortDescription = str(data.shortDescription, 240);
  if (!shortDescription) issues.push({ field: "shortDescription", message: "Short description is required" });

  const description = str(data.description, 4000);
  if (!description) issues.push({ field: "description", message: "Description is required" });

  const features = strArr(data.features);
  const image = str(data.image, 600);
  const datasheetUrl = str(data.datasheetUrl, 600);
  const seoTitle = str(data.seoTitle, 120);
  const seoDescription = str(data.seoDescription, 320);
  const seoImage = str(data.seoImage, 600);
  const featured = bool(data.featured);

  if (image && !URL_OR_PATH.test(image)) {
    issues.push({ field: "image", message: "Image must be an http(s) URL or a /public path" });
  }
  if (datasheetUrl && !URL_OR_PATH.test(datasheetUrl)) {
    issues.push({ field: "datasheetUrl", message: "Datasheet URL must be an http(s) URL or /public path" });
  }
  if (seoImage && !URL_OR_PATH.test(seoImage)) {
    issues.push({ field: "seoImage", message: "SEO image must be an http(s) URL or a /public path" });
  }

  let slug = str(data.slug, 120);
  if (!slug) slug = slugify(name);
  if (slug && !SLUG_RE.test(slug)) {
    issues.push({ field: "slug", message: "Slug may contain lowercase letters, numbers and dashes only" });
  }

  const id = str(data.id, 80);

  if (issues.length) return { ok: false, issues };

  return {
    ok: true,
    value: {
      id: id || undefined,
      slug,
      name,
      category,
      shortDescription,
      description,
      features,
      image,
      datasheetUrl: datasheetUrl || undefined,
      featured,
      seoTitle: seoTitle || undefined,
      seoDescription: seoDescription || undefined,
      seoImage: seoImage || undefined,
    },
  };
}

export function toProduct(input: ProductInput, existing?: Product): Product {
  return {
    id: input.id || existing?.id || `nx-${Date.now().toString(36)}`,
    slug: input.slug!,
    name: input.name,
    category: input.category,
    shortDescription: input.shortDescription,
    description: input.description,
    features: input.features,
    image: input.image,
    datasheetUrl: input.datasheetUrl,
    featured: input.featured ?? false,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    seoImage: input.seoImage,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };
}

// ─────────────────────────── Services ───────────────────────────

export interface ServiceInput {
  slug?: string;
  title: string;
  summary: string;
  icon: string;
  highlights: string[];
  details: string;
  image: string;
  featured?: boolean;
}

const SERVICE_ICONS = ["cpu", "fiber", "tower", "bolt", "box", "cabling", "cctv"];

export function validateServiceInput(raw: unknown): { ok: true; value: ServiceInput } | { ok: false; issues: Issue[] } {
  const issues: Issue[] = [];
  const data = (raw ?? {}) as Record<string, unknown>;

  const title = str(data.title, 120);
  if (!title) issues.push({ field: "title", message: "Title is required" });

  const summary = str(data.summary, 280);
  if (!summary) issues.push({ field: "summary", message: "Summary is required" });

  const details = str(data.details, 4000);
  if (!details) issues.push({ field: "details", message: "Details is required" });

  const icon = str(data.icon, 32) || "box";
  if (!SERVICE_ICONS.includes(icon)) {
    issues.push({ field: "icon", message: `Icon must be one of: ${SERVICE_ICONS.join(", ")}` });
  }

  const image = str(data.image, 600);
  if (image && !URL_OR_PATH.test(image)) {
    issues.push({ field: "image", message: "Image must be an http(s) URL or a /public path" });
  }

  const highlights = strArr(data.highlights, 20, 240);
  const featured = bool(data.featured);

  let slug = str(data.slug, 120);
  if (!slug) slug = slugify(title);
  if (slug && !SLUG_RE.test(slug)) {
    issues.push({ field: "slug", message: "Slug may contain lowercase letters, numbers and dashes only" });
  }

  if (issues.length) return { ok: false, issues };

  return {
    ok: true,
    value: { slug, title, summary, details, icon, image, highlights, featured },
  };
}

export function toService(input: ServiceInput): Service {
  return {
    slug: input.slug!,
    title: input.title,
    summary: input.summary,
    icon: input.icon,
    highlights: input.highlights,
    details: input.details,
    image: input.image,
    featured: input.featured ?? false,
  };
}

// ─────────────────────────── Projects ───────────────────────────

export interface ProjectInput {
  id?: string;
  slug?: string;
  title: string;
  client: string;
  category: string;
  summary: string;
  description?: string;
  year: string;
  image: string;
  featured?: boolean;
}

export function validateProjectInput(raw: unknown): { ok: true; value: ProjectInput } | { ok: false; issues: Issue[] } {
  const issues: Issue[] = [];
  const data = (raw ?? {}) as Record<string, unknown>;

  const title = str(data.title, 160);
  if (!title) issues.push({ field: "title", message: "Title is required" });

  const client = str(data.client, 160);
  if (!client) issues.push({ field: "client", message: "Client is required" });

  const category = str(data.category, 80);
  if (!category) issues.push({ field: "category", message: "Category is required" });

  const summary = str(data.summary, 320);
  if (!summary) issues.push({ field: "summary", message: "Summary is required" });

  const description = str(data.description, 4000);
  const year = str(data.year, 16);
  if (!year) issues.push({ field: "year", message: "Year is required" });

  const image = str(data.image, 600);
  if (image && !URL_OR_PATH.test(image)) {
    issues.push({ field: "image", message: "Image must be an http(s) URL or a /public path" });
  }

  let slug = str(data.slug, 120);
  if (!slug) slug = slugify(title);
  if (slug && !SLUG_RE.test(slug)) {
    issues.push({ field: "slug", message: "Slug may contain lowercase letters, numbers and dashes only" });
  }

  const featured = bool(data.featured);
  const id = str(data.id, 80);

  if (issues.length) return { ok: false, issues };

  return {
    ok: true,
    value: {
      id: id || undefined,
      slug,
      title,
      client,
      category,
      summary,
      description: description || undefined,
      year,
      image,
      featured,
    },
  };
}

export function toProject(input: ProjectInput, existing?: Project): Project {
  return {
    id: input.id || existing?.id || `p-${Date.now().toString(36)}`,
    slug: input.slug,
    title: input.title,
    client: input.client,
    category: input.category,
    summary: input.summary,
    description: input.description,
    year: input.year,
    image: input.image,
    featured: input.featured ?? false,
  };
}

// ─────────────────────────── Site content ───────────────────────────

function urlOrEmpty(value: unknown, max = 600): string {
  const v = str(value, max);
  if (v && !URL_OR_PATH.test(v)) return "";
  return v;
}

function ctaLink(value: unknown): CtaLink | undefined {
  if (!value || typeof value !== "object") return undefined;
  const v = value as Record<string, unknown>;
  const label = str(v.label, 60);
  const href = str(v.href, 600);
  if (!label || !href) return undefined;
  return { label, href };
}

function heroSlide(value: unknown): HeroSlide | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  const title = str(v.title, 200);
  const subtitle = str(v.subtitle, 600);
  const image = urlOrEmpty(v.image);
  if (!title || !subtitle) return null;
  return {
    eyebrow: str(v.eyebrow, 80) || undefined,
    title,
    subtitle,
    image,
    primaryCta: ctaLink(v.primaryCta),
    secondaryCta: ctaLink(v.secondaryCta),
  };
}

function pageHero(value: unknown): PageHero {
  const v = (value ?? {}) as Record<string, unknown>;
  return {
    eyebrow: str(v.eyebrow, 80) || undefined,
    title: str(v.title, 200),
    subtitle: str(v.subtitle, 600),
    image: urlOrEmpty(v.image),
  };
}

export function validateSite(raw: unknown): { ok: true; value: Site } | { ok: false; issues: Issue[] } {
  const issues: Issue[] = [];
  const data = (raw ?? {}) as Record<string, unknown>;

  const heroRaw = (data.hero as { slides?: unknown })?.slides;
  const slides: HeroSlide[] = Array.isArray(heroRaw)
    ? heroRaw.map(heroSlide).filter((s): s is HeroSlide => s !== null)
    : [];
  if (slides.length === 0) {
    issues.push({ field: "hero.slides", message: "At least one hero slide is required" });
  }

  const home = (data.home ?? {}) as Record<string, unknown>;
  const wwd = (home.whatWeDo ?? {}) as Record<string, unknown>;
  const homeCta = (home.cta ?? {}) as Record<string, unknown>;

  const about = (data.about ?? {}) as Record<string, unknown>;
  const aboutBody = (about.body ?? {}) as Record<string, unknown>;
  const aboutCta = (about.cta ?? {}) as Record<string, unknown>;

  const contact = (data.contact ?? {}) as Record<string, unknown>;
  const contactIntro = (contact.intro ?? {}) as Record<string, unknown>;

  const pages = (data.pages ?? {}) as Record<string, unknown>;
  const footer = (data.footer ?? {}) as Record<string, unknown>;

  const aboutParagraphs = Array.isArray(aboutBody.paragraphs)
    ? (aboutBody.paragraphs as unknown[])
        .map((p) => str(p, 4000))
        .filter(Boolean)
        .slice(0, 10)
    : [];

  if (issues.length) return { ok: false, issues };

  const site: Site = {
    hero: { slides },
    home: {
      whatWeDo: {
        eyebrow: str(wwd.eyebrow, 80),
        title: str(wwd.title, 200),
        lead: str(wwd.lead, 1000),
        body: str(wwd.body, 4000),
        image: urlOrEmpty(wwd.image),
      },
      cta: {
        title: str(homeCta.title, 200),
        body: str(homeCta.body, 1000),
        primaryLabel: str(homeCta.primaryLabel, 60),
      },
    },
    about: {
      hero: pageHero(about.hero),
      body: {
        eyebrow: str(aboutBody.eyebrow, 80),
        title: str(aboutBody.title, 200),
        paragraphs: aboutParagraphs,
        image: urlOrEmpty(aboutBody.image),
      },
      cta: {
        title: str(aboutCta.title, 200),
        body: str(aboutCta.body, 1000),
        primaryLabel: str(aboutCta.primaryLabel, 60),
      },
    },
    contact: {
      hero: pageHero(contact.hero),
      intro: {
        reachHeading: str(contactIntro.reachHeading, 120),
        reachSubheading: str(contactIntro.reachSubheading, 240),
        formHeading: str(contactIntro.formHeading, 120),
        formSubheading: str(contactIntro.formSubheading, 240),
      },
    },
    pages: {
      services: pageHero(pages.services),
      products: pageHero(pages.products),
      projects: pageHero(pages.projects),
    },
    footer: {
      companyHeading: str(footer.companyHeading, 60) || "Company",
      verticalsHeading: str(footer.verticalsHeading, 60) || "Verticals",
      officeHeading: str(footer.officeHeading, 60) || "Office",
      copyrightSuffix: str(footer.copyrightSuffix, 240),
    },
  };

  return { ok: true, value: site };
}

// ─────────────────────────── Company ───────────────────────────

function office(value: unknown): Office | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  const city = str(v.city, 80);
  if (!city) return null;
  return {
    city,
    country: str(v.country, 80),
    address: str(v.address, 600),
    phone: str(v.phone, 60),
    email: str(v.email, 200),
    isHeadquarters: bool(v.isHeadquarters),
  };
}

function valuePillar(value: unknown): ValuePillar | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  const title = str(v.title, 60);
  if (!title) return null;
  return { title, description: str(v.description, 400) };
}

function focusArea(value: unknown): FocusArea | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  const title = str(v.title, 120);
  if (!title) return null;
  return {
    title,
    description: str(v.description, 600),
    icon: str(v.icon, 32) || undefined,
  };
}

export function validateCompany(raw: unknown): { ok: true; value: Company } | { ok: false; issues: Issue[] } {
  const issues: Issue[] = [];
  const data = (raw ?? {}) as Record<string, unknown>;

  const name = str(data.name, 120);
  if (!name) issues.push({ field: "name", message: "Name is required" });

  const legalName = str(data.legalName, 200);
  if (!legalName) issues.push({ field: "legalName", message: "Legal name is required" });

  const social = (data.social ?? {}) as Record<string, unknown>;
  const partnerRaw = (data.partner ?? {}) as Record<string, unknown>;

  const offices = Array.isArray(data.offices)
    ? (data.offices as unknown[]).map(office).filter((o): o is Office => o !== null)
    : [];
  if (offices.length === 0) issues.push({ field: "offices", message: "At least one office is required" });

  const values = Array.isArray(data.values)
    ? (data.values as unknown[]).map(valuePillar).filter((v): v is ValuePillar => v !== null)
    : [];

  const areasOfFocus = Array.isArray(data.areasOfFocus)
    ? (data.areasOfFocus as unknown[]).map(focusArea).filter((a): a is FocusArea => a !== null)
    : [];

  const verticals = strArr(data.verticals, 12, 120);

  if (issues.length) return { ok: false, issues };

  const company: Company = {
    name,
    legalName,
    tagline: str(data.tagline, 240),
    description: str(data.description, 1000),
    shortDescription: str(data.shortDescription, 600),
    founded: str(data.founded, 8),
    yearsOfExperience: typeof data.yearsOfExperience === "number" ? data.yearsOfExperience : 0,
    verticals,
    offices,
    social: {
      linkedin: str(social.linkedin, 400),
      twitter: str(social.twitter, 400),
      facebook: str(social.facebook, 400),
      instagram: str(social.instagram, 400),
    },
    supportEmail: str(data.supportEmail, 200),
    supportPhone: str(data.supportPhone, 60),
    mission: str(data.mission, 2000),
    vision: str(data.vision, 2000),
    values,
    areasOfFocus,
    partner: partnerRaw && str(partnerRaw.name, 120)
      ? {
          name: str(partnerRaw.name, 120),
          legalName: str(partnerRaw.legalName, 200) || undefined,
          url: str(partnerRaw.url, 400),
          country: str(partnerRaw.country, 80),
          note: str(partnerRaw.note, 600) || undefined,
        }
      : undefined,
  };

  return { ok: true, value: company };
}
