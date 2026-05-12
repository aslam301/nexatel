import { type VercelConfig } from "@vercel/config/v1";

// Vercel automatically applies aggressive caching to /public/* assets and
// /_next/image responses, so a custom Cache-Control rule isn't required.
// Keeping this config minimal avoids invalid path-to-regexp patterns.
export const config: VercelConfig = {
  framework: "nextjs",
  buildCommand: "next build",
  installCommand: "npm install",
  redirects: [
    // Slug renames during the 2026-05 content overhaul. permanent: true => 308.
    { source: "/services/fiber-optics-cabling", destination: "/services/fiber-optic", permanent: true },
    { source: "/services/telecom-infrastructure", destination: "/services/telecom", permanent: true },
    { source: "/services/it-hardware-supply", destination: "/services/it-hardware", permanent: true },
    // Dropped pillars now point to the services index.
    { source: "/services/it-services", destination: "/services", permanent: true },
    { source: "/services/electrical-solar", destination: "/services", permanent: true },
  ],
};

export default config;
