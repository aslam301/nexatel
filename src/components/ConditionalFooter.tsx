"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import type { Company } from "@/lib/types";

export function ConditionalFooter({ company }: { company: Company }) {
  const pathname = usePathname();
  // Admin pages render inside AdminShell, which provides its own chrome.
  if (pathname?.startsWith("/admin")) return null;
  return <Footer company={company} />;
}
