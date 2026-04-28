import { promises as fs } from "node:fs";
import path from "node:path";
import type { Company, Service, Product, Project } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJson<T>(file: string): Promise<T> {
  const buf = await fs.readFile(path.join(DATA_DIR, file), "utf8");
  return JSON.parse(buf) as T;
}

async function writeJson<T>(file: string, value: T): Promise<void> {
  const target = path.join(DATA_DIR, file);
  const tmp = target + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(value, null, 2) + "\n", "utf8");
  await fs.rename(tmp, target);
}

export const getCompany = (): Promise<Company> => readJson<Company>("company.json");
export const getServices = (): Promise<Service[]> => readJson<Service[]>("services.json");
export const getProducts = (): Promise<Product[]> => readJson<Product[]>("products.json");
export const getProjects = (): Promise<Project[]> => readJson<Project[]>("projects.json");

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

export async function saveProducts(products: Product[]): Promise<void> {
  await writeJson("products.json", products);
}

export function isFsWritable(): boolean {
  // Vercel serverless filesystem is read-only at runtime.
  return process.env.VERCEL !== "1";
}
