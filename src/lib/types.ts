export interface Office {
  city: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  isHeadquarters: boolean;
}

export interface PartnerCompany {
  name: string;
  legalName?: string;
  url: string;
  country: string;
  note?: string;
}

export interface ValuePillar {
  title: string;
  description: string;
}

export interface FocusArea {
  title: string;
  description: string;
  icon?: string;
}

export interface Company {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  shortDescription: string;
  founded: string;
  yearsOfExperience: number;
  verticals: string[];
  offices: Office[];
  social: {
    linkedin: string;
    twitter: string;
    facebook: string;
    instagram: string;
  };
  supportEmail: string;
  supportPhone: string;
  mission: string;
  vision: string;
  values: ValuePillar[];
  areasOfFocus: FocusArea[];
  partner?: PartnerCompany;
}

// ─────────────────────────── Editable site content ───────────────────────────

export interface CtaLink {
  label: string;
  href: string;
}

export interface HeroSlide {
  eyebrow?: string;
  title: string;
  subtitle: string;
  image: string;
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
}

export interface PageHero {
  eyebrow?: string;
  title: string;
  subtitle: string;
  image: string;
}

export interface HomeWhatWeDo {
  eyebrow: string;
  title: string;
  lead: string;
  body: string;
  image: string;
}

export interface CtaPanel {
  title: string;
  body: string;
  primaryLabel: string;
}

export interface AboutBody {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  image: string;
}

export interface ContactIntro {
  reachHeading: string;
  reachSubheading: string;
  formHeading: string;
  formSubheading: string;
}

export interface FooterContent {
  /** Column 1 heading (default: Company). */
  companyHeading: string;
  /** Column 2 heading (default: Verticals). */
  verticalsHeading: string;
  /** Column 3 heading (default: Office). */
  officeHeading: string;
  /** Copyright suffix; year is added automatically. */
  copyrightSuffix: string;
}

export interface Site {
  hero: { slides: HeroSlide[] };
  home: {
    whatWeDo: HomeWhatWeDo;
    cta: CtaPanel;
  };
  about: {
    hero: PageHero;
    body: AboutBody;
    cta: CtaPanel;
  };
  contact: {
    hero: PageHero;
    intro: ContactIntro;
  };
  pages: {
    services: PageHero;
    products: PageHero;
    projects: PageHero;
  };
  footer: FooterContent;
}

// ─────────────────────────── Catalogue entities ───────────────────────────

export interface Service {
  slug: string;
  title: string;
  summary: string;
  icon: string;
  highlights: string[];
  details: string;
  image: string;
  featured?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  features: string[];
  image: string;
  datasheetUrl?: string;
  createdAt: string;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
}

export interface Project {
  id: string;
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

export interface Settings {
  notificationEmail: string;
  ccEmails: string[];
  emailSubjectPrefix: string;
  autoReplyEnabled: boolean;
  updatedAt: string;
  defaultOgImage?: string;
  defaultMetaDescription?: string;
}

export type SubmissionKind = "contact" | "quote";

export interface Submission {
  id: string;
  kind: SubmissionKind;
  createdAt: string;
  name: string;
  email: string;
  organisation?: string;
  phone?: string;
  topic?: string;
  serviceArea?: string;
  scope?: string;
  budget?: string;
  timeline?: string;
  location?: string;
  message: string;
  emailDelivered: boolean;
  emailError?: string;
  ip?: string;
}
