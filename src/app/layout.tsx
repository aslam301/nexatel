import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { ConditionalFooter } from "@/components/ConditionalFooter";
import { getCompany } from "@/lib/data";
import { buildMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompany();
  const meta = buildMetadata({
    title: `${company.name} — ${company.tagline}`,
    description: company.description,
    path: "/",
    keywords: [
      "Nexatel",
      "IT services Kuwait",
      "IT services Kerala",
      "fiber optics Kuwait",
      "structured cabling Kerala",
      "telecom infrastructure GCC",
      "solar installation Kuwait",
      "IT hardware supply Kuwait",
      "OFC backbone",
      "BICSI cabling",
    ],
  });
  return {
    ...meta,
    title: {
      default: `${company.name} — ${company.tagline}`,
      template: `%s · ${company.name}`,
    },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/apple-icon.svg", sizes: "180x180", type: "image/svg+xml" }],
    },
    manifest: "/manifest.webmanifest",
  };
}

export const viewport: Viewport = {
  themeColor: "#0a2540",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const company = await getCompany();
  const graph = {
    "@context": "https://schema.org",
    "@graph": [organizationJsonLd(company), websiteJsonLd(company)],
  };
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-white text-[var(--foreground)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <ConditionalFooter company={company} />
      </body>
    </html>
  );
}
