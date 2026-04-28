import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nexatel — Engineering Connections. Building Tomorrow.",
    short_name: "Nexatel",
    description:
      "Multi-vertical engineering and technology group serving Kerala and Kuwait. IT, fiber optics, telecom, and clean-energy installations.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a2540",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/apple-icon.svg", sizes: "180x180", type: "image/svg+xml", purpose: "any" },
    ],
    categories: ["business", "technology", "infrastructure"],
    lang: "en-US",
  };
}
