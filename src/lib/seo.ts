import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://nexatel.example.com";

export function buildMetadata({
  title,
  description,
  path = "/",
  image = "/og-default.svg",
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Nexatel",
      type: "website",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: { index: true, follow: true },
  };
}

export function organizationJsonLd(company: {
  name: string;
  description: string;
  offices: { city: string; country: string; address: string; phone: string; isHeadquarters: boolean }[];
}) {
  const hq = company.offices.find((o) => o.isHeadquarters) ?? company.offices[0];
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    description: company.description,
    address: hq && {
      "@type": "PostalAddress",
      streetAddress: hq.address,
      addressLocality: hq.city,
      addressCountry: hq.country,
    },
    contactPoint: company.offices.map((o) => ({
      "@type": "ContactPoint",
      telephone: o.phone,
      contactType: "customer service",
      areaServed: o.country,
    })),
  };
}
