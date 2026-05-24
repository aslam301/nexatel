import type { Company, Service, Product, Project, Settings, Site, Submission } from "./types";
import { isPersistenceWritable, readJson, readJsonOr, writeJson } from "./storage";

export const getCompany = (): Promise<Company> => readJson<Company>("company.json");
export const getServices = (): Promise<Service[]> => readJson<Service[]>("services.json");
export const getProducts = (): Promise<Product[]> => readJson<Product[]>("products.json");
export const getProjects = (): Promise<Project[]> => readJson<Project[]>("projects.json");
export const getSite = (): Promise<Site> => readJson<Site>("site.json");

export async function saveCompany(company: Company): Promise<void> {
  await writeJson("company.json", company);
}

export async function saveSite(site: Site): Promise<void> {
  await writeJson("site.json", site);
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  const list = await getServices();
  return list.find((s) => s.slug === slug);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const list = await getProducts();
  return list.find((p) => p.slug === slug);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const list = await getProducts();
  return list.find((p) => p.id === id);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const list = await getProjects();
  return list.find((p) => p.slug === slug);
}

export async function saveProducts(products: Product[]): Promise<void> {
  await writeJson("products.json", products);
}

export async function saveServices(services: Service[]): Promise<void> {
  await writeJson("services.json", services);
}

export async function saveProjects(projects: Project[]): Promise<void> {
  await writeJson("projects.json", projects);
}

const DEFAULT_SETTINGS: Settings = {
  notificationEmail: "sales@nexatel.org",
  ccEmails: [],
  emailSubjectPrefix: "[Nexatel]",
  autoReplyEnabled: false,
  updatedAt: new Date(0).toISOString(),
};

export async function getSettings(): Promise<Settings> {
  return readJsonOr<Settings>("settings.json", DEFAULT_SETTINGS);
}

export async function saveSettings(settings: Settings): Promise<void> {
  await writeJson("settings.json", settings);
}

export async function getSubmissions(): Promise<Submission[]> {
  const list = await readJsonOr<Submission[]>("submissions.json", []);
  return Array.isArray(list) ? list : [];
}

export async function appendSubmission(submission: Submission): Promise<{ saved: boolean; reason?: string }> {
  if (!isPersistenceWritable()) {
    return { saved: false, reason: "read-only-fs" };
  }
  try {
    const list = await getSubmissions();
    list.unshift(submission);
    const capped = list.slice(0, 500);
    await writeJson("submissions.json", capped);
    return { saved: true };
  } catch (err) {
    return { saved: false, reason: err instanceof Error ? err.message : "unknown" };
  }
}

// Back-compat alias. Older admin pages and API routes import this name; it now
// reflects "can the app persist edits in this environment" rather than literal
// filesystem writability, since Blob is also a write target.
export function isFsWritable(): boolean {
  return isPersistenceWritable();
}
