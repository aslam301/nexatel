import { type VercelConfig } from "@vercel/config/v1";

// Vercel automatically applies aggressive caching to /public/* assets and
// /_next/image responses, so a custom Cache-Control rule isn't required.
// Keeping this config minimal avoids invalid path-to-regexp patterns.
export const config: VercelConfig = {
  framework: "nextjs",
  buildCommand: "next build",
  installCommand: "npm install",
};

export default config;
