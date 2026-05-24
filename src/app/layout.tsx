import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { ConditionalFooter } from "@/components/ConditionalFooter";
import { getCompany, getSite } from "@/lib/data";
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
    title: `${company.name}, ${company.tagline}`,
    description: company.description,
    path: "/",
    keywords: [
      "Nexatel",
      "Nexatel Private Limited",
      "IT networking India",
      "structured cabling Kerala",
      "fibre optic installation India",
      "telecom infrastructure India",
      "OFC backbone",
      "ROW liaison India",
      "CCTV access control India",
      "enterprise IT hardware supplier India",
    ],
  });
  return {
    ...meta,
    title: {
      default: `${company.name}, ${company.tagline}`,
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
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [company, site] = await Promise.all([getCompany(), getSite()]);
  const graph = {
    "@context": "https://schema.org",
    "@graph": [organizationJsonLd(company), websiteJsonLd(company)],
  };
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen flex flex-col text-[var(--foreground)]" style={{ background: "var(--background)" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <ConditionalFooter company={company} footer={site.footer} />
      </body>
    </html>
  );
}
