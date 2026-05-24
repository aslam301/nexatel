"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import type { Company, FooterContent } from "@/lib/types";

export function ConditionalFooter({ company, footer }: { company: Company; footer: FooterContent }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <Footer company={company} footer={footer} />;
}
