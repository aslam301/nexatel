import type { MetadataRoute } from "next";
import { getServices, getCapabilities, getProducts } from "@/lib/data";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, capabilities, products] = await Promise.all([
    getServices(),
    getCapabilities(),
    getProducts(),
  ]);
  const now = new Date();
  const staticPaths = [
    "",
    "/about",
    "/services",
    "/capabilities",
    "/products",
    "/projects",
    "/contact",
  ];
  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${SITE_URL}${p || "/"}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.8,
  }));
  const serviceEntries: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${SITE_URL}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  const capabilityEntries: MetadataRoute.Sitemap = capabilities.map((c) => ({
    url: `${SITE_URL}/capabilities/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/products/${p.slug}`,
    lastModified: new Date(p.createdAt || now),
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  return [...staticEntries, ...serviceEntries, ...capabilityEntries, ...productEntries];
}
