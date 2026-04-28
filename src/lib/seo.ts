import type { Metadata } from "next";
import type { Company, Product, Service } from "./types";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://nexatel.example.com";

const DEFAULT_OG = {
  url: "/og-default.svg",
  width: 1200,
  height: 630,
  alt: "Nexatel — Engineering Connections. Building Tomorrow.",
} as const;

const SITE_NAME = "Nexatel";
const TWITTER_HANDLE = "@nexatel"; // change in env once a real handle exists

export interface BuildMetadataInput {
  title: string;
  description: string;
  /** Path including leading slash, e.g. "/services" */
  path?: string;
  /** Optional og:image URL (absolute or starting with "/") with optional dims */
  image?: string | { url: string; width?: number; height?: number; alt?: string };
  /** Default "website"; pages like blog posts can override to "article" */
  ogType?: "website" | "article" | "profile";
  /** Optional keywords list */
  keywords?: string[];
  /** Override robots, e.g. for admin pages */
  robots?: Metadata["robots"];
  /** Article publish/update timestamps */
  publishedTime?: string;
  modifiedTime?: string;
}

function absoluteUrl(input: string): string {
  if (/^https?:\/\//i.test(input)) return input;
  return `${SITE_URL}${input.startsWith("/") ? "" : "/"}${input}`;
}

export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  ogType = "website",
  keywords,
  robots,
  publishedTime,
  modifiedTime,
}: BuildMetadataInput): Metadata {
  const url = `${SITE_URL}${path}`;

  const og =
    typeof image === "string"
      ? { url: absoluteUrl(image), width: 1200, height: 630, alt: title }
      : image
        ? {
            url: absoluteUrl(image.url),
            width: image.width ?? 1200,
            height: image.height ?? 630,
            alt: image.alt ?? title,
          }
        : { ...DEFAULT_OG, url: absoluteUrl(DEFAULT_OG.url) };

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    referrer: "strict-origin-when-cross-origin",
    keywords,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    formatDetection: { email: false, address: false, telephone: false },
    alternates: {
      canonical: url,
      languages: { "en-US": url },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: ogType,
      locale: "en_US",
      images: [og],
      ...(publishedTime || modifiedTime
        ? { publishedTime, modifiedTime }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      images: [og.url],
    },
    robots: robots ?? {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    other: {
      "format-detection": "telephone=no",
    },
  };
}

// ---------- Structured data helpers (JSON-LD) ---------------------------

interface OrgJsonLdInput {
  name: string;
  description: string;
  offices: {
    city: string;
    country: string;
    address: string;
    phone: string;
    email: string;
    isHeadquarters: boolean;
  }[];
  founded?: string;
  social?: { linkedin?: string; twitter?: string; facebook?: string; instagram?: string };
}

export function organizationJsonLd(company: OrgJsonLdInput) {
  const hq = company.offices.find((o) => o.isHeadquarters) ?? company.offices[0];
  const sameAs = Object.values(company.social || {}).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}#organization`,
    name: company.name,
    legalName: company.name,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    image: `${SITE_URL}/og-default.svg`,
    description: company.description,
    foundingDate: company.founded,
    address: hq && {
      "@type": "PostalAddress",
      streetAddress: hq.address,
      addressLocality: hq.city,
      addressCountry: hq.country,
    },
    contactPoint: company.offices.map((o) => ({
      "@type": "ContactPoint",
      telephone: o.phone,
      email: o.email,
      contactType: "customer service",
      areaServed: o.country,
      availableLanguage: ["en", "ar", "ml", "hi"],
    })),
    location: company.offices.map((o) => ({
      "@type": "Place",
      name: `${o.city} office${o.isHeadquarters ? " (HQ)" : ""}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: o.address,
        addressLocality: o.city,
        addressCountry: o.country,
      },
    })),
    sameAs: sameAs.length ? sameAs : undefined,
  };
}

export function websiteJsonLd(company: { name: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    url: SITE_URL,
    name: company.name,
    description: company.description,
    publisher: { "@id": `${SITE_URL}#organization` },
    inLanguage: "en-US",
  };
}

export function breadcrumbsJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export function serviceJsonLd(service: Service, company: Company) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.summary,
    serviceType: service.title,
    provider: {
      "@type": "Organization",
      name: company.name,
      url: SITE_URL,
    },
    areaServed: company.offices.map((o) => ({ "@type": "Country", name: o.country })),
    url: `${SITE_URL}/services/${service.slug}`,
    image: service.image,
  };
}

export function productJsonLd(product: Product, company: Company) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.id,
    category: product.category,
    image: product.image,
    url: `${SITE_URL}/products/${product.slug}`,
    brand: {
      "@type": "Brand",
      name: company.name,
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
      // We don't quote prices publicly; mark as "Quote on request".
      price: 0,
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "USD",
        valueAddedTaxIncluded: false,
      },
      url: `${SITE_URL}/get-quote?service=it-hardware`,
    },
  };
}

export function localBusinessJsonLd(company: Company) {
  return company.offices.map((o) => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${company.name} — ${o.city}`,
    image: `${SITE_URL}/og-default.svg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: o.address,
      addressLocality: o.city,
      addressCountry: o.country,
    },
    telephone: o.phone,
    email: o.email,
    url: SITE_URL,
    priceRange: "$$",
    parentOrganization: { "@id": `${SITE_URL}#organization` },
  }));
}
