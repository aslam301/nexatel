import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nexatel, building Kerala's network backbone.",
    short_name: "Nexatel",
    description:
      "IT networking, structured cabling, fibre, telecom infrastructure and security systems for enterprises and large infrastructure projects across India.",
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
