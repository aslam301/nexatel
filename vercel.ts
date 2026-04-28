import { routes, type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  framework: "nextjs",
  buildCommand: "next build",
  installCommand: "npm install",
  headers: [
    routes.cacheControl("/(.*)\\.(?:svg|jpg|jpeg|png|webp|avif|ico)", {
      public: true,
      maxAge: "30 days",
    }),
  ],
};

export default config;
